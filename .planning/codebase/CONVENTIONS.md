# Conventions

- **Auth**: SIWE JWT tokens use the `jose` library (edge-friendly) over `jsonwebtoken`.
- **Environment**: Strict runtime enforcement of secrets. Build-time fallbacks exist to prevent Next.js static generation from failing.
- **Styling**: Tailwind CSS classes. No CSS modules.
- **State**: Client state management uses standard React Context (`WalletProvider.tsx`).
