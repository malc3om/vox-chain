
import type { DAppConnectorAPI } from '@midnight-ntwrk/midnight-js-dapp-connector';

export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: string | null;
  api: DAppConnectorAPI | null;
}

/**
 * Check if the Lace wallet is available in the browser.
 */
export function isWalletAvailable(): boolean {
  if (typeof window === "undefined") return false;
  const voxWindow = window as unknown as { midnight?: { mnLace?: unknown } };
  return !!voxWindow.midnight?.mnLace;
}

/**
 * Connect to the Lace wallet.
 * Returns wallet API interface on success.
 */
export async function connectWallet(): Promise<WalletState> {
  if (!isWalletAvailable()) {
    throw new Error(
      "Lace wallet not found. Please install the Lace Beta Wallet for the secure network."
    );
  }

  try {
    const voxWindow = window as unknown as { midnight?: { mnLace?: { enable: () => Promise<any> } } };
    const wallet = voxWindow.midnight?.mnLace;

    if (!wallet) {
      throw new Error("Secure wallet extension not detected.");
    }


    // Request wallet connection
    const walletAPI = await wallet.enable();
    const state = await walletAPI.state();

    return {
      connected: true,
      address: state.address || null,
      balance: state.balance || null,
      api: walletAPI as DAppConnectorAPI,
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
    const voxWindow = window as unknown as { midnight?: { mnLace?: { serviceUriConfig: () => Promise<any> } } };
    const wallet = voxWindow.midnight?.mnLace;
    if (!wallet) return null;

    return await wallet.serviceUriConfig();
  } catch {
    return null;
  }
}
