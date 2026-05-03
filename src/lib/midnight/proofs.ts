
export interface ProofInput {
  age: number;
  constituency: string;
  secretKey?: string;
}

export interface ProofResult {
  valid: boolean;
  proofHash: string;
  nullifier: string;
  timestamp: number;
  computeTimeMs: number;
}

/**
 * Generate a ZK proof for eligibility verification.
 * 
 * In production, this uses the Midnight proof server or
 * the Lace wallet's built-in proving capabilities.
 * 
 * The proof proves:
 * 1. age >= 18
 * 2. constituency is in the valid set
 * 3. No double-verification (nullifier check)
 * 
 * WITHOUT revealing the actual age, constituency, or identity.
 */
export async function generateEligibilityProof(
  input: ProofInput
): Promise<ProofResult> {
  const startTime = Date.now();

  console.log("[ZK] Starting proof generation...");
  console.log("[ZK] Input processed locally — not transmitted");

  // Simulate proof generation time (real proofs take 2-30 seconds)
  await new Promise((resolve) => setTimeout(resolve, 2500));

  // Verify eligibility criteria locally
  const isEligible = input.age >= 18 && input.constituency.trim().length > 0;

  // Generate deterministic nullifier (in production: hash(secretKey + "eligibility_nullifier"))
  const nullifier = `0xNULL_${hashString(input.constituency + input.age)}`;

  // Generate proof hash (in production: actual ZK proof bytes)
  const proofHash = `0xZK_${hashString(JSON.stringify(input) + Date.now())}`;

  const computeTimeMs = Date.now() - startTime;

  console.log(`[ZK] Proof generated in ${computeTimeMs}ms`);
  console.log(`[ZK] Result: ${isEligible ? "ELIGIBLE" : "NOT ELIGIBLE"}`);

  return {
    valid: isEligible,
    proofHash,
    nullifier,
    timestamp: Date.now(),
    computeTimeMs,
  };
}

/**
 * Verify a proof on-chain (read-only check).
 * In production, this queries the Midnight ledger.
 */
export async function verifyProofOnChain(
  proofHash: string
): Promise<{ verified: boolean; blockNumber: number }> {
  console.log(`[ZK] Verifying proof ${proofHash} on-chain...`);

  // Simulate on-chain verification
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    verified: proofHash.startsWith("0xZK_"),
    blockNumber: Math.floor(Math.random() * 1000000) + 500000,
  };
}

/**
 * Check if a nullifier has already been used (double-vote prevention).
 */
export async function checkNullifier(
  nullifier: string
): Promise<{ used: boolean }> {
  console.log(`[ZK] Checking nullifier ${nullifier}...`);

  // In production: query EligibilityVerifier.isNullifierUsed(nullifier)
  return { used: false };
}



function hashString(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}
