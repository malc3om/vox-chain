# ARCHITECTURE

## Paradigm
- **Dual-State Architecture**: Combines a public on-chain ledger (Midnight Network) with private local state. ZK circuits compile from Compact language. Raw private data never touches the backend.
- **Client-Server Separation**: Uses Next.js App Router.
  - Server Components / Server Actions handle Gemini AI requests to protect API keys.
  - Client Components handle GSAP animations and Midnight Wallet connections (window.midnight.mnLace).

## Layers
1. **Presentation Layer**: Next.js UI using Tailwind CSS and GSAP. `src/app/`
2. **Business Logic Layer**: `src/lib/gemini.ts` (AI logic), `src/lib/midnight/` (Web3 logic).
3. **Data/Integration Layer**: Firebase Auth integration, Midnight Proof Server local communication.
4. **Smart Contract Layer**: `contracts/EligibilityVerifier.compact` compiled into circuits.

## Data Flow (Eligibility Verification)
1. User clicks "Connect Wallet" -> UI queries `window.midnight.mnLace`.
2. Wallet connects. User inputs private witness data (e.g. Age).
3. Client-side JS sends witness data to local Docker `proof-server` (port 6300).
4. Local server generates ZK proof.
5. Client submits ZK proof to Midnight Network.
6. Network verifies proof and logs nullifier to prevent double-spending/voting.
