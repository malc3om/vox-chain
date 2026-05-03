# Phase 2 Plan: Knowledge & ZK-Proofs

## Wave 1: Midnight ZK-Circuit (The Engine)
- [ ] Task 02-01-01: Create `contracts/voter_eligibility.compact` for age and uniqueness verification.
- [ ] Task 02-01-02: Compile Compact contract and generate TypeScript SDK wrappers.
- [ ] Task 02-01-03: Implement `VoterEligibility` component in `src/app/eligibility/page.tsx` with Lace wallet connection.

## Wave 2: Grounded AI (The Knowledge)
- [ ] Task 02-01-04: Create `src/lib/civic_data.json` with localized election information (dates, rules, registration).
- [ ] Task 02-01-05: Refactor `/api/chat` to inject `civic_data.json` into the Gemini system prompt.
- [ ] Task 02-01-06: Update `AskPage` UI to support document citations in AI responses.

## Wave 3: Verified Interaction (The Gamification)
- [ ] Task 02-01-07: Build `src/app/quiz/page.tsx` with dynamic questions from the civic dataset.
- [ ] Task 02-01-08: Implement ZK-nullifier check to ensure each user only submits one "High Score" per cycle.
- [ ] Task 02-01-09: Final visual audit of Phase 2 features.

## Verification
- Run `midnight-proof-server` and verify successful proof generation.
- Test AI assistant with edge-case civic questions.
- Verify nullifier set correctly prevents duplicate quiz submissions.
