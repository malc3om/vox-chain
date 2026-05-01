# Concerns & Technical Debt

1. **Stubbed Smart Contracts**: The `.ts` files under `src/lib/midnight/contracts.ts` return randomly generated IDs instead of real blockchain hashes.
2. **Missing E2E Tests**: Essential for robust deployments, especially surrounding Web3 wallet connections. (Note: Playwright tests added but need to run in CI)
