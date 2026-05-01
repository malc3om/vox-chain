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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState<User | null>(null);
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
      await signOutUser();
    } else {
      await signInWithGoogle();
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "glass-header py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-[var(--spacing-page)] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border border-text-secondary flex items-center justify-center overflow-hidden relative transition-transform duration-300 group-hover:scale-110">
              <div className="absolute inset-0 bg-text-primary opacity-0 group-hover:opacity-10 transition-opacity" />
              <div className="w-2.5 h-2.5 bg-text-primary rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </div>
            <span className="font-heading font-medium text-lg tracking-[0.2em] uppercase text-text-primary">
              VoxChain
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full border border-border bg-black/20 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300
                    ${
                      isActive
                        ? "bg-white/10 text-text-primary shadow-sm"
                        : "text-text-muted hover:text-text-primary hover:bg-white/5"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side — Language + Google + Wallet */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 text-sm py-2 px-3 rounded-full bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all"
                aria-label="Select language"
                aria-haspopup="listbox"
                aria-expanded={langDropdownOpen}
                id="language-selector-btn"
              >
                <span className="text-base">🌐</span>
                <span className="text-xs">{currentLang?.native ?? "EN"}</span>
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-44 glass rounded-xl border border-white/10 py-1 shadow-2xl z-50 animate-fade-in"
                  role="listbox"
                  aria-label="Language options"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      role="option"
                      aria-selected={language === lang.code}
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                        language === lang.code
                          ? "text-primary bg-primary/10"
                          : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                      }`}
                    >
                      <span>{lang.native}</span>
                      <span className="text-xs text-text-muted">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Google Sign-In */}
            <button
              onClick={handleGoogleAuth}
              className={`flex items-center gap-2 text-sm py-2 px-3 rounded-full transition-all duration-300 ${
                googleUser
                  ? "bg-white/10 border border-white/20 text-text-primary hover:bg-white/20"
                  : "bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/10"
              }`}
              aria-label={googleUser ? "Sign out of Google" : "Sign in with Google"}
              id="google-signin-btn"
            >
              {googleUser ? (
                <>
                  {googleUser.photoURL ? (
                    <img
                      src={googleUser.photoURL}
                      alt=""
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center text-[10px] font-bold">
                      {googleUser.displayName?.charAt(0) ?? "G"}
                    </span>
                  )}
                  <span className="text-xs max-w-[80px] truncate">
                    {googleUser.displayName?.split(" ")[0] ?? "User"}
                  </span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-xs">Google</span>
                </>
              )}
            </button>

            {/* Wallet Connect */}
            <button
              id="connect-wallet-btn"
              onClick={() => setWalletModalOpen(true)}
              className={`text-sm flex items-center gap-2 py-2.5 px-6 rounded-full transition-all duration-300 font-medium ${
                connected
                  ? "bg-white/10 text-text-primary border border-white/20 hover:bg-white/20"
                  : "bg-text-primary text-bg-deep hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  connected
                    ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"
                    : "bg-bg-deep animate-pulse"
                }`}
              />
              {connected ? shortAddress : "Connect Wallet"}
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
