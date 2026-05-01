"use client";

import { useState } from "react";
import { useWallet } from "./WalletProvider";

/**
 * Connect Wallet Modal
 * 
 * Shows wallet connection flow:
 * 1. If Lace detected → connect directly
 * 2. If no wallet → offer demo mode + install link
 * 3. Once connected → show address, balance, network, disconnect
 */
export default function WalletModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    connected,
    connecting,
    address,
    balance,
    network,
    error,
    shortAddress,
    connect,
    disconnect,
  } = useWallet();
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className="relative glass-strong rounded-2xl w-full max-w-md mx-4 p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          id="wallet-modal-close"
        >
          ✕
        </button>

        {/* ── Not Connected ────────────────── */}
        {!connected && !connecting && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl glow-primary">
                🔗
              </div>
              <h2 className="font-heading text-xl font-bold">
                Connect Wallet
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Connect your Midnight wallet to verify eligibility and interact
                with on-chain data.
              </p>
            </div>

            {/* Lace Wallet Option */}
            <button
              onClick={connect}
              className="w-full glass rounded-xl p-4 flex items-center gap-4 card-hover mb-3 text-left"
              id="connect-lace-btn"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A44B8] to-[#2D5FE5] flex items-center justify-center text-white text-lg font-bold shrink-0">
                L
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold">
                  Lace Wallet (Midnight)
                </h3>
                <p className="text-xs text-text-muted">
                  Connect via DApp Connector API
                </p>
              </div>
              <span className="text-primary text-lg">→</span>
            </button>

            {/* Demo Mode */}
            <button
              onClick={connect}
              className="w-full glass rounded-xl p-4 flex items-center gap-4 card-hover mb-4 text-left"
              id="connect-demo-btn"
            >
              <div className="w-12 h-12 rounded-xl bg-bg-elevated flex items-center justify-center text-xl shrink-0">
                🧪
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-text-secondary">
                  Demo Mode
                </h3>
                <p className="text-xs text-text-muted">
                  Try VoxChain without a wallet
                </p>
              </div>
              <span className="text-text-muted text-lg">→</span>
            </button>

            {error && (
              <div className="bg-error/10 border border-error/30 rounded-xl p-3 mb-3">
                <p className="text-xs text-error">{error}</p>
              </div>
            )}

            <p className="text-[11px] text-text-muted text-center">
              Don&apos;t have Lace?{" "}
              <a
                href="https://www.lace.io/midnight"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-light transition-colors"
              >
                Download Lace Beta →
              </a>
            </p>
          </>
        )}

        {/* ── Connecting ───────────────────── */}
        {connecting && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <h2 className="font-heading text-xl font-bold mb-2">
              Connecting...
            </h2>
            <p className="text-text-secondary text-sm">
              Approve the connection in your wallet extension.
            </p>
          </div>
        )}

        {/* ── Connected ────────────────────── */}
        {connected && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center glow-success">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="font-heading text-xl font-bold text-success">
                Connected
              </h2>
              <p className="text-text-secondary text-sm mt-1">{network}</p>
            </div>

            {/* Wallet Info */}
            <div className="space-y-3 mb-6">
              {/* Address */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted uppercase tracking-wider">
                    Address
                  </span>
                  <button
                    onClick={() => {
                      if (address) navigator.clipboard.writeText(address);
                    }}
                    className="text-[10px] text-primary hover:text-primary-light transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="font-mono text-sm text-text-primary mt-1">
                  {shortAddress}
                </p>
              </div>

              {/* Balance */}
              <div className="glass rounded-xl p-4">
                <span className="text-xs text-text-muted uppercase tracking-wider">
                  Balance
                </span>
                <p className="font-heading text-2xl font-bold gradient-text mt-1">
                  {balance}
                </p>
              </div>

              {/* Full Details Toggle */}
              {address && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors w-full text-center"
                >
                  {showDetails ? "Hide" : "Show"} full address
                </button>
              )}
              {showDetails && address && (
                <div className="bg-bg-elevated rounded-xl p-3 animate-fade-in">
                  <p className="font-mono text-[11px] text-text-secondary break-all">
                    {address}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <a
                href="/eligibility"
                onClick={onClose}
                className="btn-primary flex-1 text-center text-sm"
              >
                Verify Eligibility
              </a>
              <button
                onClick={disconnect}
                className="btn-ghost text-sm !px-4 text-error border-error/30 hover:bg-error/10"
                id="disconnect-wallet-btn"
              >
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
