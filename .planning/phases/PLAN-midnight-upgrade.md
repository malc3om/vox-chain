# Phase Plan: Midnight Integration Upgrade

## Objective
Upgrade the mocked Midnight Network integration to use real ZK proof-based voter eligibility logic with the Midnight SDK and Lace Wallet, ensuring compliance with the dual-state architecture.

## Context
Currently, the `/eligibility` page fakes the ZK proof generation via `setTimeout`. The `contracts.ts` file simulates deployments and interactions. We need to implement the real TypeScript SDK layer that connects the NextJS UI to the Compact smart contracts (`EligibilityVerifier.compact`) and the local proof server. 

**Note on Environment:** The user is on Windows, which is officially not supported for Midnight development (Linux/Mac only). The code will be implemented correctly but local execution of the proof server may not be possible on the host OS.

## Steps
1. **Update Dependencies**
   - Add `@midnight-ntwrk/midnight-js-contracts`, `@midnight-ntwrk/compact-runtime`, `@midnight-ntwrk/midnight-js-types`, `@midnight-ntwrk/midnight-js-network-id`, `@midnight-ntwrk/midnight-js-dapp-connector`, and `@midnight-ntwrk/midnight-js-level-private-state-provider` to `package.json`.
   
2. **Upgrade TypeScript SDK Layer (`src/lib/midnight/contracts.ts`)**
   - Import necessary Midnight SDK modules.
   - Implement real `deployEligibilityVerifier` using the SDK's contract deployment mechanics.
   - Implement `callCircuit` to actually invoke the local proof server and submit transactions.

3. **Upgrade Wallet Integration (`src/lib/midnight/wallet.ts`)**
   - Ensure the DApp Connector API uses the official `mnLace` objects and properly retrieves the `DAppConnectorWalletAPI`.

4. **Upgrade Next.js UI (`src/app/eligibility/page.tsx`)**
   - Replace the fake `setTimeout` logic with actual calls to `callCircuit('verifyEligibility', [age, constituency])`.
   - Ensure raw user data (age, constituency) is passed only to the client-side proof generation function and never touches the backend.
   - Add explicit warnings if the Lace wallet is missing or if the user is on an unsupported OS (Windows).
