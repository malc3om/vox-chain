# Architecture: VoxChain

## Overview
VoxChain is a Next.js application using the App Router, following a modular "Component-First" architecture with clear separation between UI, business logic (lib), and state (contexts).

## Key Patterns
- **Dual State (Midnight Pattern)**: Public on-chain data (minimal) vs Private local data (private inputs for ZK proofs).
- **Ref-Based GSAP Targeting**: Standardized on using `useRef` for GSAP animations to avoid hydration mismatches and selector race conditions.
- **Client Providers**: Heavy use of the `Providers` pattern in `layout.tsx` to handle client-side libraries like GSAP, Lenis, and Firebase.
- **Serverless API Routes**: API routes handle Gemini AI interactions and secure authentication nonces.

## Data Flow
1. **User Interaction**: Triggered in client components (`src/components/*`).
2. **State Management**: Handled via React Context (`src/contexts/*`) for language and wallet state.
3. **External Logic**: Orchestrated via `src/lib/*` (Firebase, Midnight SDK, Gemini AI).
4. **ZK Proofs**: Generated client-side via Midnight SDK, with nullifiers stored on-chain to prevent double-voting.

## Entry Points
- `src/app/page.tsx`: Landing Page (Hero + Marquee + Features).
- `src/app/ask/page.tsx`: AI Assistant Interface.
- `src/app/eligibility/page.tsx`: Midnight ZK-Proof Flow.
- `src/app/quiz/page.tsx`: Gamified Education.
