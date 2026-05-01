# Concerns & Technical Debt

1. **Mocked Crypto**: The Midnight wallet signature verification is currently mocked and accepts any signature of length > 10. This MUST be replaced before Mainnet.
2. **Stubbed Smart Contracts**: The `.ts` files under `src/lib/midnight/contracts.ts` return randomly generated IDs instead of real blockchain hashes.
3. **Missing E2E Tests**: Essential for robust deployments, especially surrounding Web3 wallet connections.
