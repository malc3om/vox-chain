# Structure: VoxChain

## Directory Layout
- `src/app/`: Next.js App Router pages and API routes.
- `src/components/`:
  - `home/`: Hero, Features, GSAPAnimations.
  - `layout/`: Navbar, Footer, MobileMenu.
  - `providers/`: LenisProvider, ThemeProvider.
  - `ui/`: Reusable primitive components (Buttons, Inputs, Cards).
  - `wallet/`: Wallet connection logic and UI.
- `src/contexts/`: React Context providers (Language, Auth, Wallet).
- `src/lib/`:
  - `firebase.ts`: Authentication and Firestore configuration.
  - `gemini.ts`: AI assistant configuration.
  - `midnight/`: ZK circuit wrappers and SDK helpers.
- `src/types/`: TypeScript definitions for election data, user profiles, and app state.
- `contracts/`: Compact (Midnight) smart contract source code.
- `proofs/`: Local ZK proof artifacts.
- `tests/`:
  - `unit/`: Vitest component and logic tests.
  - `e2e/`: Playwright integration tests.

## Naming Conventions
- **Components**: PascalCase (e.g., `Navbar.tsx`).
- **Hooks/Lib**: camelCase (e.g., `useWallet.ts`, `firebase.ts`).
- **Folders**: lowercase (e.g., `src/app/eligibility`).
- **CSS**: Tailwind utility classes + CSS variables in `globals.css`.
