import { proofServerConfig } from "../../../proofs/config";

import type { MidnightProviders } from '@midnight-ntwrk/midnight-js-types';

import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
// @ts-expect-error
import { Contract, type ContractAddress } from '@midnight-ntwrk/midnight-js-contracts';

export interface ContractDeployResult {
  contractAddress: string;
  transactionHash: string;
  network: string;
}

export interface ContractCallResult {
  success: boolean;
  data: unknown;
  transactionHash?: string;
}

/**
 * Deploy the ElectionTimeline contract.
 * In production, this compiles and deploys the Compact contract.
 */
export async function deployElectionTimeline(
  adminPublicKey: string,
  deadlines: {
    registrationDeadline: number;
    campaignEnd: number;
    earlyVotingStart: number;
    earlyVotingEnd: number;
    electionDay: number;
    certificationDeadline: number;
  }
): Promise<ContractDeployResult> {
  console.log("[Midnight] Deploying ElectionTimeline contract...");
  console.log("[Midnight] Admin:", adminPublicKey);
  console.log("[Midnight] Deadlines:", deadlines);
  console.log("[Midnight] Network:", proofServerConfig.network.id);

  // Simulated for development
  return {
    contractAddress: `mid1_${Math.random().toString(36).slice(2, 10)}`,
    transactionHash: `0x${Math.random().toString(16).slice(2, 18)}`,
    network: proofServerConfig.network.id,
  };
}

/**
 * Deploy the EligibilityVerifier contract.
 */
export async function deployEligibilityVerifier(
  adminPublicKey: string,
  minimumAge: number,
  constituencyMerkleRoot: string
): Promise<ContractDeployResult> {
  console.log("[Midnight] Deploying EligibilityVerifier contract...");
  console.log("[Midnight] Admin:", adminPublicKey);
  console.log("[Midnight] Minimum Age:", minimumAge);
  console.log("[Midnight] Merkle Root:", constituencyMerkleRoot);

  return {
    contractAddress: `mid1_${Math.random().toString(36).slice(2, 10)}`,
    transactionHash: `0x${Math.random().toString(16).slice(2, 18)}`,
    network: proofServerConfig.network.id,
  };
}

/**
 * Call a circuit on a deployed contract.
 */
export async function callCircuit(
  contractAddress: string,
  circuitName: string,
  args: unknown[] = []
): Promise<ContractCallResult> {
  console.log(`[Midnight] Calling ${circuitName} on ${contractAddress}`);
  console.log("[Midnight] Args:", args);

  const voxWindow = window as unknown as { midnight?: { mnLace?: unknown } };
  if (!voxWindow.midnight?.mnLace) {
    throw new Error("Lace wallet not found. Required for ZK proof generation.");
  }
  return {
    success: true,
    data: null,
    transactionHash: `0x${Math.random().toString(16).slice(2, 18)}`,
  };
}

/**
 * Query the current state of a contract (read-only).
 * Does not require proof generation.
 */
export async function queryContract(
  contractAddress: string,
  queryName: string
): Promise<unknown> {
  console.log(`[Midnight] Querying ${queryName} on ${contractAddress}`);

  return null;
}

/**
 * Find a deployed contract by its name/type.
 */
export async function findDeployedContract(
  contractName: string
): Promise<string | null> {
  const config = proofServerConfig.contracts;
  
  if (contractName === "ElectionTimeline" && config.electionTimeline.address) {
    return config.electionTimeline.address;
  }
  if (contractName === "EligibilityVerifier" && config.eligibilityVerifier.address) {
    return config.eligibilityVerifier.address;
  }
  
  return null;
}
