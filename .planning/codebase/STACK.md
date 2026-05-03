# Tech Stack: VoxChain

## Core Technologies
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Runtime**: Node.js 20+
- **Styling**: Tailwind CSS 4 (Vanilla CSS fallback for complex animations)
- **Deployment**: Google Cloud Run (Dockerized)

## Key Dependencies
- **GSAP**: `^3.15.0` (Animations)
- **Lenis**: `^1.3.23` (Smooth Scrolling)
- **Firebase**: `^11.7.1` (Authentication & Firestore)
- **Gemini AI**: `@google/generative-ai ^0.24.1`
- **Noble Ed25519**: `^3.1.0` (ZK/Crypto primitives)
- **Jose**: `^6.2.3` (JWT handling)

## Build & Testing
- **Package Manager**: npm
- **Testing**: Vitest (Unit), Playwright (E2E)
- **Linting**: ESLint 9
- **Bundler**: Turbopack (Next.js default)

## Configuration
- `next.config.ts`: Next.js configuration
- `tailwind.config.ts`: Tailwind configuration (using v4 CSS-first approach)
- `firebase.json`: Firebase deployment settings
- `playwright.config.ts`: E2E test configuration
