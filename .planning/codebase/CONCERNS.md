# Concerns: VoxChain

## Technical Debt
- **Firebase Auth Domains**: `localhost` and the production URL must be manually whitelisted in the Firebase console.
- **Midnight Proof Server**: Dependency on a local Docker container (`port 6300`) can be a bottleneck for automated testing.
- **Mock User Fallback**: The code still contains a demo user fallback that could mask real auth issues if not monitored.

## Potential Fragility
- **GSAP Selector Races**: While ref-based targeting is being phased in, some legacy class-based selectors might still exist in complex components.
- **Mobile Smooth Scroll**: Lenis on mobile requires careful touch multiplier tuning to avoid jitter.
- **Midnight Wallet States**: Lace wallet connection can be intermittent on certain browsers/OS combinations.

## Security
- **API Key Exposure**: Ensure `.env.local` is not committed (already in `.gitignore`).
- **ZK Witness Privacy**: Verify that private inputs never leave the client-side execution context.
- **Rate Limiting**: AI chat endpoint (`/api/chat`) needs robust rate limiting to prevent quota exhaustion.

## Future Stability
- **Next.js 15 Migration**: Recently updated; monitor for any hydration warnings or Turbopack-specific build issues.
