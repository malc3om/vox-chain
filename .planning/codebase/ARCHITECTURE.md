# Architecture

## Core Components
- **Frontend App**: Next.js App Router providing pages for Chat (`/ask`), Eligibility (`/eligibility`), Timeline (`/timeline`), and Quiz (`/quiz`).
- **Auth Flow**: SIWE (Sign-in With Midnight). The client requests a nonce, signs it, and POSTs it to `/api/auth/verify`. The server issues an HTTP-only JWT cookie (`voxchain_session`).
- **Smart Contracts / ZK Proofs**: Stubs in `src/lib/midnight/` acting as a bridging layer to the Midnight blockchain.
- **AI Integration**: Server-side `/api/chat` route orchestrating interaction with the Gemini AI model.
