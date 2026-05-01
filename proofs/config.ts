/**
 * Midnight ZK Proof Server Configuration
 * 
 * Configuration for the local proof generation server.
 * In production, proofs are generated client-side using the Lace wallet.
 * This config is for development/testing with the Midnight devnet.
 */

export const proofServerConfig = {
  // Network configuration
  network: {
    id: "mainnet" as const,
    indexerUrl: "https://indexer.midnight.network/api/v1/graphql",
    indexerWsUrl: "wss://indexer.midnight.network/api/v1/graphql",
    nodeUrl: "https://rpc.midnight.network",
    proofServerUrl: "http://localhost:6300",
  },

  // Contract addresses (deployed on Midnight)
  contracts: {
    electionTimeline: {
      address: "", // Set after deployment
      name: "ElectionTimeline",
    },
    eligibilityVerifier: {
      address: "", // Set after deployment
      name: "EligibilityVerifier",
    },
  },

  // Proof generation settings
  proving: {
    // Maximum time to wait for proof generation (ms)
    timeout: 120_000,
    // Number of retries on failure
    maxRetries: 3,
    // Whether to use the DApp connector (Lace) or HTTP proof server
    useDAppConnector: true,
  },
};

export type NetworkConfig = typeof proofServerConfig.network;
export type ContractConfig = typeof proofServerConfig.contracts;
