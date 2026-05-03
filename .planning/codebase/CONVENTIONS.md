# Conventions: VoxChain

## Coding Style
- **ESLint**: Strict rules for React and Next.js.
- **Type Safety**: Avoid `any`. Use interfaces in `src/types/` for all domain objects.
- **Formatting**: Standardized whitespace (2 spaces).

## Animation Standards
- **Ref targeting**: Always use `ref` for GSAP targets.
- **Cleanup**: Ensure `gsap.context` or `useGSAP` cleanup is handled to prevent memory leaks in SPAs.
- **Ease**: Standardized on `expo.out` or `power4.out` for architectural movement.

## Error Handling
- **Auth**: Errors must be caught and surfaced to the UI (e.g., `authError` state in `Navbar`).
- **Midnight**: ZK proof failures should provide actionable feedback (e.g., "Install Lace Wallet").
- **API**: Standardized JSON error responses (`{ error: string }`).

## Component Patterns
- **Composition**: Use React Composition patterns for flexible layouts.
- **Server vs Client**: Use `"use client"` directive only where interactivity or browser APIs are required.
