/**
 * Midnight Wallet Integration
 * 
 * Connects to Lace wallet (Midnight edition) via DApp Connector API.
 * Provides wallet state, balance, and transaction capabilities.
 */

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: string | null;
}

/**
 * Check if the Lace wallet is available in the browser.
 */
export function isWalletAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as unknown as Record<string, unknown>).midnight;
}

/**
 * Connect to the Lace wallet.
 * Returns wallet API interface on success.
 */
export async function connectWallet(): Promise<WalletState> {
  if (!isWalletAvailable()) {
    throw new Error(
      "Lace wallet not found. Please install the Lace Beta Wallet for Midnight Network."
    );
  }

  try {
    // Access the Midnight wallet API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const midnight = (window as any).midnight;
    const wallet = midnight?.mnLace;

    if (!wallet) {
      throw new Error("Lace Midnight extension not detected.");
    }

    // Request wallet connection
    const walletAPI = await wallet.enable();
    const state = await walletAPI.state();

    return {
      connected: true,
      address: state.address || null,
      balance: state.balance || null,
    };
  } catch (error) {
    console.error("Wallet connection failed:", error);
    throw error;
  }
}

/**
 * Get wallet service URIs (indexer, prover, etc.)
 */
export async function getServiceUris() {
  if (!isWalletAvailable()) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const midnight = (window as any).midnight;
    const wallet = midnight?.mnLace;
    if (!wallet) return null;

    return await wallet.serviceUriConfig();
  } catch {
    return null;
  }
}
