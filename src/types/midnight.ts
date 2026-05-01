/**
 * Midnight Network Type Definitions
 */

export interface MidnightWalletState {
  connected: boolean;
  address: string | null;
  balance: string | null;
}

export interface MidnightTransaction {
  hash: string;
  status: "pending" | "confirmed" | "failed";
  blockNumber?: number;
  timestamp?: number;
}

export interface MidnightContractState {
  address: string;
  name: string;
  deployed: boolean;
  network: string;
}

export interface ZKProof {
  proofHash: string;
  nullifier: string;
  valid: boolean;
  timestamp: number;
  computeTimeMs: number;
}

export interface ServiceUriConfig {
  indexerUrl: string;
  indexerWsUrl: string;
  nodeUrl: string;
  proofServerUrl: string;
}
