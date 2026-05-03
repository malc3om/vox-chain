# Integrations: VoxChain

## External Services
- **Firebase Authentication**: Google OAuth provider.
- **Google Gemini API**: Used for civic education chat and automated eligibility guidance.
- **Midnight Network**: ZK-proof verification (integrated via `@midnight-ntwrk/midnight-js-*` packages, specifically for voter eligibility).

## Data Storage
- **Firestore**: User profiles, quiz results, and election metadata.
- **Midnight Proof Server**: Local/remote ZK circuit execution (Port 6300).

## Auth Flows
- **Google OAuth**: Primary authentication for user sessions.
- **SIWE (Sign-In With Midnight)**: Proof-of-personhood/eligibility flow (in progress).
- **Session Management**: JWT-based via `jose` and `next-auth` style patterns.

## APIs & Webhooks
- `/api/chat`: Gemini AI assistant endpoint.
- `/api/auth/*`: Nonce generation and signature verification.
- `/api/translate`: Localization helper.
- `/api/tts`: Text-to-speech for accessibility.
