"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

/** Midnight Lace wallet extension type stubs. */
interface MidnightWalletAPI {
  state: () => Promise<{ address?: string }>;
  balanceAndProveResult?: () => Promise<{ balance: string }>;
}

interface MidnightWindow {
  midnight?: {
    mnLace?: {
      enable: () => Promise<MidnightWalletAPI>;
    };
  };
}

export interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  balance: string | null;
  network: string | null;
  error: string | null;
}

interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  shortAddress: string | null;
}

const initialState: WalletState = {
  connected: false,
  connecting: false,
  address: null,
  balance: null,
  network: null,
  error: null,
};

const WalletContext = createContext<WalletContextType>({
  ...initialState,
  connect: async () => {},
  disconnect: () => {},
  shortAddress: null,
});

export function useWallet() {
  return useContext(WalletContext);
}

/**
 * Check if the Midnight Lace wallet extension is available.
 */
function detectWallet(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as unknown as MidnightWindow).midnight?.mnLace;
}

/**
 * Truncate address for display: "mid1_abcdef...xyz123"
 */
function truncateAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 10)}...${address.slice(-6)}`;
}

/**
 * Generate a simulated wallet address for demo mode.
 * In production, this comes from the Lace wallet.
 */
function generateDemoAddress(): string {
  const chars = "abcdef0123456789";
  let addr = "mid1_";
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(initialState);

  // Restore session from backend on mount
  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.address) {
            setState({
              connected: true,
              connecting: false,
              address: data.address,
              balance: "Loading...",
              network: "Midnight Testnet",
              error: null,
            });

            // If real Lace wallet is available, we could fetch actual balance here
            // For now, we set a default
            setState((s) => ({ ...s, balance: "1,250.00 tDUST" }));
          }
        }
      } catch {
        // Ignore errors
      }
    }
    restoreSession();
  }, []);

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, connecting: true, error: null }));

    try {
      // 1. Get nonce from backend
      const nonceRes = await fetch("/api/auth/nonce");
      if (!nonceRes.ok) throw new Error("Failed to fetch nonce");
      const { nonce, message } = await nonceRes.json();

      let finalAddress = "";
      let signature = "";
      let networkName = "Midnight Testnet";
      let displayBalance = "1,250.00 tDUST";

      // 2. Connect to wallet & sign
      if (detectWallet()) {
        const midnight = (window as unknown as MidnightWindow).midnight!;
        const wallet = midnight.mnLace!;

        const walletAPI = await wallet.enable();
        const walletState = await walletAPI.state();
        
        finalAddress = walletState.address || generateDemoAddress();
        
        // In a real integration: signature = await walletAPI.signData(finalAddress, message);
        // For our demo, we mock the signature process
        signature = `mock_signature_for_${nonce}`;

        try {
          const balanceInfo = await walletAPI.balanceAndProveResult?.();
          if (balanceInfo) displayBalance = `${balanceInfo.balance} tDUST`;
        } catch {
          // Keep default
        }
      } else {
        // Demo Mode (No wallet installed)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        finalAddress = generateDemoAddress();
        signature = `demo_signature_for_${nonce}`;
        networkName = "Midnight Testnet (Demo)";
      }

      // 3. Verify on backend
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: finalAddress,
          signature,
          message,
        }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.error || "Verification failed");
      }

      // 4. Set final state
      setState({
        connected: true,
        connecting: false,
        address: finalAddress,
        balance: displayBalance,
        network: networkName,
        error: null,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Connection failed";
      setState({
        connected: false,
        connecting: false,
        address: null,
        balance: null,
        network: null,
        error: message,
      });
    }
  }, []);

  const disconnect = useCallback(async () => {
    setState(initialState);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore errors during disconnect
    }
  }, []);

  const shortAddress = state.address
    ? truncateAddress(state.address)
    : null;

  return (
    <WalletContext.Provider
      value={{ ...state, connect, disconnect, shortAddress }}
    >
      {children}
    </WalletContext.Provider>
  );
}
