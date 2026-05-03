# Testing: VoxChain

## Frameworks
- **Unit Testing**: Vitest + React Testing Library.
- **E2E Testing**: Playwright.
- **Mocking**: Custom mock data for voters and election cycles.

## Test Structure
- `tests/unit/*.test.tsx`: Component unit tests.
- `tests/e2e/*.spec.ts`: User journey tests.

## Key Coverage Areas
- **Auth Flow**: Mocking Google Sign-In and verifying session state.
- **AI Chat**: Verifying API responses and error handling for Gemini.
- **Midnight Integration**: Verifying proof generation triggers (requires manual verification for Lace wallet).
- **Smooth Scroll**: Visual regression testing for Lenis/GSAP interactions.

## Commands
- `npm run test`: Run all unit tests.
- `npm run test:e2e`: Run Playwright tests.
- `npm run lint`: Code quality check.
