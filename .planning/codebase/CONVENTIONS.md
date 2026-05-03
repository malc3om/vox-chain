# CONVENTIONS

## Code Style
- **TypeScript**: Strict mode must be enabled. Avoid `any`.
- **Styling**: Tailwind CSS utility classes. Avoid inline styles.
- **Component Structure**: Functional React components using hooks.
- **GSAP**: Animations isolated in side-effect only Client Components (e.g., `GSAPAnimations.tsx`) and dynamically imported with `ssr: false` to avoid layout thrashing and hydration mismatch.

## State Management
- React `useState` and `useEffect` for local UI state.
- Form inputs controlled via standard React patterns.

## Security & Privacy
- **Zero-Knowledge**: Never mock on-chain data. Raw private data MUST NEVER touch the backend. Proofs must be generated client-side via a local proof server.
- **API Keys**: Server Actions or API routes must be used for interactions requiring sensitive keys (like Google Gemini) to prevent exposure to the client.

## Error Handling
- Display clear error messages in UI.
- Use try-catch blocks around async operations.
