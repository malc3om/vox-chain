# Phase 2 Research: Midnight & Gemini Integration

## Midnight Network (ZK Proofs)
- **Language**: Compact (TypeScript-based DSL).
- **Circuit**: `voter_eligibility` circuit requires:
  - Witness: `userAge` (u32), `electionCycleId` (string).
  - Public State: `nullifierSet` (Set of used hashes).
  - Logic: `assert(userAge >= 18)`, `assert(!nullifierSet.contains(hash(privateKey, electionCycleId)))`.
- **Wallet**: Lace wallet integration via `@midnight-ntwrk/midnight-js-contracts`.

## Gemini AI (Grounded Knowledge)
- **Model**: `gemini-1.5-flash` or `gemini-2.0-flash`.
- **Context Injection**: Use System Instructions to ground the model in a `civic_data.json` file.
- **Tools**: Enable `function calling` for real-time election date lookups.

## Implementation Path
1. **Circuit Development**: Write `.compact` contract and compile to ZK circuits.
2. **SDK Integration**: Use `midnight-js` to trigger proof generation in `src/app/eligibility/page.tsx`.
3. **AI Backend**: Refactor `/api/chat` to use a custom system prompt and localized documents.
