# STRUCTURE

## Root Directories
- `src/` - Application source code.
  - `src/app/` - Next.js App Router pages (e.g. `/`, `/eligibility`, `/chat`).
  - `src/components/` - Reusable UI components (e.g., `GSAPAnimations.tsx`, `FeatureCard.tsx`).
  - `src/lib/` - Shared business logic and external service integrations.
    - `src/lib/midnight/` - Midnight Network connection logic (`wallet.ts`, `contracts.ts`).
    - `src/lib/gemini.ts` - Google Gemini integration.
- `contracts/` - Midnight Compact smart contracts (e.g., `EligibilityVerifier.compact`).
- `tests/` - Testing configuration and suites.
- `public/` - Static assets.
- `.planning/` - GSD project planning and documentation folder.

## Key Files
- `src/app/page.tsx` - Landing page with GSAP animations.
- `src/app/eligibility/page.tsx` - Verification UI bridging Midnight wallet and Next.js.
- `Dockerfile` - Containerization for Google Cloud Run deployment.
- `playwright.config.ts` & `vitest.config.ts` - Test setup files.
