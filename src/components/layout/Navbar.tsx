"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useWallet } from "@/components/wallet/WalletProvider";
import WalletModal from "@/components/wallet/WalletModal";

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
  const { connected, shortAddress } = useWallet();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

          {/* Wallet Connect (Desktop) */}
          <div className="hidden md:block">
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
          </div>
          <div className="mt-auto pt-6 border-t border-border">
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
    </>
  );
}
