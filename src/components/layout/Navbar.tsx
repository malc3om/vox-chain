"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useWallet } from "@/components/wallet/WalletProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/lib/google/translate";
import { signInWithGoogle, signOutUser, getFirebaseAuth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

// Lazy-load WalletModal — only needed on click interaction
const WalletModal = dynamic(
  () => import("@/components/wallet/WalletModal"),
  { ssr: false }
);

const navLinks = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/timeline", label: "Timeline", icon: "◈" },
  { href: "/ask", label: "Ask AI", icon: "◎" },
  { href: "/eligibility", label: "Eligibility", icon: "◇" },
  { href: "/quiz", label: "Quiz", icon: "△" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const { connected, shortAddress } = useWallet();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setGoogleUser(user);
      });
      return () => unsubscribe();
    } catch {
      // Firebase not configured — no-op
    }
  }, []);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  async function handleGoogleAuth() {
    if (googleUser) {
      if ((googleUser as any).isMock) {
        setGoogleUser(null);
      } else {
        await signOutUser();
      }
    } else {
      try {
        const result = await signInWithGoogle();
        if (!result) {
          // Fallback to mock user if Firebase is not configured at all
          setGoogleUser({
            displayName: "Demo Voter",
            photoURL: "",
            isMock: true,
          } as any);
        }
      } catch (err: any) {
        if (err.code === "auth/unauthorized-domain") {
          setAuthError("Unauthorized Domain: Please check Firebase settings.");
          // Clear error after 5s
          setTimeout(() => setAuthError(null), 5000);
        } else {
          console.error("Login failed:", err);
          setAuthError("Login failed. Please try again.");
          setTimeout(() => setAuthError(null), 5000);
        }
      }
    }
  }

  return (
    <>
      <nav
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled && !isHovered ? "-translate-y-[calc(100%-5px)]" : "translate-y-0"
        } ${isScrolled ? "glass-header py-3 shadow-lg" : "bg-transparent py-5"}`}
      >
        <div className="max-w-7xl mx-auto px-[var(--spacing-page)] flex items-center justify-between relative h-20">
          {/* Logo - Top Left */}
          <Link href="/" className="flex items-center gap-3 group absolute left-[var(--spacing-page)]">
            <div className="w-8 h-8 rounded-full border border-accent/30 flex items-center justify-center overflow-hidden relative transition-transform duration-300 group-hover:scale-110">
              <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="w-2.5 h-2.5 bg-accent rounded-full shadow-[0_0_10px_rgba(253,224,71,0.5)]" />
            </div>
            <span className="font-heading font-medium text-lg tracking-[0.2em] uppercase text-text-primary">
              VoxChain
            </span>
          </Link>
 
          {/* Main Desktop Nav - Centered & Enlarged */}
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 gap-2 p-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl scale-110">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-500 uppercase tracking-widest
                    ${
                      isActive
                        ? "bg-accent text-bg-deep shadow-[0_0_30px_rgba(253,224,71,0.4)]"
                        : "text-text-muted hover:text-text-primary hover:bg-white/5"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
 
          {/* Top-Right Utility Stack - Vertically Stacked */}
          <div className="hidden md:flex flex-col items-end gap-2 fixed top-8 right-8 z-[60]">
            {/* Language Selector */}
            <div className="relative group/lang">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="utility-button flex items-center gap-2 min-w-[140px] justify-between"
                aria-label="Select language"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base opacity-70">🌐</span>
                  <span>{currentLang?.native ?? "English"}</span>
                </span>
                <span className="text-[8px] opacity-40">▼</span>
              </button>
 
              {langDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl border border-white/10 py-1 shadow-2xl z-[70] animate-fade-in overflow-hidden">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center justify-between transition-colors ${
                        language === lang.code
                          ? "text-accent bg-accent/10"
                          : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-[8px] opacity-40">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
 
            {/* Google Sign-In */}
            <button
              onClick={handleGoogleAuth}
              className="utility-button flex items-center gap-3 min-w-[140px] justify-between relative overflow-hidden"
            >
              {authError && (
                <div className="absolute inset-0 bg-red-500 text-white text-[9px] flex items-center justify-center font-bold px-2 text-center z-10 animate-fade-in">
                  {authError}
                </div>
              )}
              {googleUser ? (
                <>
                  <span className="flex items-center gap-2">
                    {googleUser.photoURL ? (
                      <img src={googleUser.photoURL} alt="" className="w-4 h-4 rounded-full border border-white/20" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[8px]">{googleUser.displayName?.charAt(0)}</div>
                    )}
                    <span className="truncate max-w-[80px]">{googleUser.displayName?.split(" ")[0]}</span>
                  </span>
                  <span className="text-[8px] opacity-40">OUT</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="currentColor"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" opacity="0.8"/>
                    </svg>
                    <span>Login</span>
                  </span>
                  <span className="text-[8px] opacity-40">AUTH</span>
                </>
              )}
            </button>
 
            {/* Wallet Connect */}
            <button
              id="connect-wallet-btn"
              onClick={() => setWalletModalOpen(true)}
              className={`utility-button flex items-center gap-3 min-w-[140px] justify-between ${
                connected ? "border-accent/40 text-accent" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-accent shadow-[0_0_8px_var(--color-accent)]" : "bg-white/20 animate-pulse"}`} />
                <span>{connected ? shortAddress : "Wallet"}</span>
              </span>
              <span className="text-[8px] opacity-40">{connected ? "ACTIVE" : "OFF"}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors z-10"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span
                className={`w-full h-[2px] bg-current rounded-full transition-all duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-[8px]" : ""
                }`}
              />
              <span
                className={`w-full h-[2px] bg-current rounded-full transition-all duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`w-full h-[2px] bg-current rounded-full transition-all duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-[8px]" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-bg-deep/95 backdrop-blur-xl z-[-1] transition-all duration-500 ease-in-out md:hidden flex flex-col pt-24 px-[var(--spacing-page)] pb-8 ${
            mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-2 flex-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    p-4 rounded-xl border border-border text-lg font-medium transition-all duration-300 flex items-center gap-4
                    ${
                      isActive
                        ? "bg-white/10 text-text-primary border-white/20"
                        : "text-text-muted hover:text-text-primary hover:bg-white/5"
                    }
                  `}
                >
                  <span className="opacity-50">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Language Selector */}
            <div className="p-4 rounded-xl border border-border">
              <p className="text-xs text-text-muted mb-2 uppercase tracking-wider">Language</p>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as LanguageCode)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      language === lang.code
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-white/5 text-text-muted border border-white/10 hover:text-text-primary"
                    }`}
                    aria-label={`Switch to ${lang.label}`}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-auto pt-6 border-t border-border space-y-3">
            {/* Mobile Google Sign-In */}
            <button
              onClick={() => {
                setMobileOpen(false);
                handleGoogleAuth();
              }}
              className="w-full text-base flex items-center justify-center gap-3 py-3 rounded-xl font-medium bg-white/5 border border-white/10 text-text-secondary transition-all"
              id="mobile-google-signin-btn"
              aria-label={googleUser ? "Sign out of Google" : "Sign in with Google"}
            >
              {googleUser ? `Signed in as ${googleUser.displayName?.split(" ")[0] ?? "User"}` : "Sign in with Google"}
            </button>

            <button
              onClick={() => {
                setMobileOpen(false);
                setWalletModalOpen(true);
              }}
              className={`w-full text-base flex items-center justify-center gap-3 py-4 rounded-xl font-medium transition-all duration-300 ${
                connected
                  ? "bg-white/10 text-text-primary border border-white/20"
                  : "bg-text-primary text-bg-deep"
              }`}
              id="mobile-connect-wallet-btn"
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  connected
                    ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"
                    : "bg-bg-deep animate-pulse"
                }`}
              />
              {connected ? shortAddress : "Connect Wallet"}
            </button>
          </div>
        </div>
      </nav>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />

      {/* Click outside to close language dropdown */}
      {langDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setLangDropdownOpen(false)}
        />
      )}
    </>
  );
}
