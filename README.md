# VoxChain — Privacy-First Civic Education Platform

[![Live Demo](https://img.shields.io/badge/Live-Cloud%20Run-4285F4?style=flat-square&logo=google-cloud)](https://voxchain-224920294393.us-central1.run.app)
[![GitHub](https://img.shields.io/badge/GitHub-malc3om%2Fvox--chain-181717?style=flat-square&logo=github)](https://github.com/malc3om/vox-chain)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Midnight Network](https://img.shields.io/badge/Midnight-Network-purple?style=flat-square)](https://midnight.network)

> **"Prove you can vote. Reveal nothing about yourself."**

VoxChain solves the **Civic Transparency Paradox**: democracies need verifiable elections, but voters deserve absolute privacy. Using Midnight Network's zero-knowledge proofs, VoxChain lets citizens prove eligibility without exposing a single byte of personal data.

---

## 🎯 Challenge Vertical

**Civic Intelligence Assistant** — A smart, context-aware system that combines:
- 🔐 **ZK-proof eligibility verification** (Midnight Network)
- 🤖 **AI civic education** (Gemini 2.0 Flash via official Google AI SDK)
- 📊 **Persistent session analytics** (Firebase Firestore)
- 🗳️ **On-chain election transparency** (immutable timeline tracking)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     VoxChain Client                     │
│  ┌───────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ Eligibility│  │  AI Chat    │  │ Election Quiz   │  │
│  │ ZK Prover │  │  (Gemini)   │  │ (Adaptive)      │  │
│  └─────┬─────┘  └──────┬───────┘  └───────┬─────────┘  │
│        │               │                  │             │
└────────┼───────────────┼──────────────────┼─────────────┘
         │               │                  │
         ▼               ▼                  ▼
  Midnight Network    Google AI SDK     Firebase
  (ZK Proofs)        (Gemini 2.0)      (Firestore)
  Local computation  @google/generative  quiz_results
  No data leaves     -ai package         verifications
  device             Safety settings     chat_sessions
```

---

## 🔑 The Problem: Civic Transparency Paradox

Traditional voting systems force a choice:
- **Public verification** → voter identity exposure
- **Full privacy** → no way to verify legitimacy

VoxChain eliminates this tradeoff using **Zero-Knowledge proofs** from the Midnight Network. A voter can mathematically prove:
- ✅ Age ≥ 18 — without revealing their birthdate
- ✅ Valid residency — without revealing their address
- ✅ Not yet voted — without revealing their identity

**The result:** `eligibility_verified = true` — with zero data exposed.

---

## 🚀 Google Services Used

| Service | Usage | Package / API |
|---|---|---|
| **Gemini 2.0 Flash** | AI civic Q&A with streaming responses | `@google/generative-ai` |
| **Firebase Firestore** | Persist quiz scores, verification events, translation cache | `firebase` |
| **Firebase Authentication** | Google Sign-In for Calendar API access | `firebase/auth` |
| **Firebase Remote Config** | Adaptive quiz difficulty parameters | `firebase/remote-config` |
| **Firebase Analytics** | Feature usage tracking | `firebase` |
| **Google Cloud Translation** | Multilingual support (6 languages) on /ask + /quiz | Cloud Translation API v2 |
| **Google Cloud Text-to-Speech** | Read-aloud accessibility for AI responses | Cloud TTS API v1 |
| **Google Calendar API** | Add election phase reminders to user calendars | Calendar API v3 |
| **Google Maps Embed** | Constituency visualization on /eligibility | Maps Embed API |
| **Google Cloud Run** | Serverless production deployment | `gcloud run deploy` |
| **Cloud Build** | Container build pipeline (Buildpacks) | Automatic |

---

## 🛡️ Innovation: Midnight Network ZK Integration

Midnight Network uses the **Compact language** — a TypeScript-like DSL that compiles to ZK circuits. VoxChain implements:

1. **Local computation**: All private data (age, address) is processed only in the user's browser
2. **Witness generation**: A mathematical witness is built from the private inputs
3. **Circuit proof**: The Compact contract generates a proof verifiable on-chain
4. **On-chain verification**: The Midnight ledger confirms eligibility without storing PII
5. **Nullifiers**: Cryptographic values prevent double-verification

---

## 📐 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4 + Custom CSS Variables |
| **Animations** | GSAP 3 with ScrollTrigger |
| **AI** | Google Gemini 2.0 Flash (official SDK) |
| **Database** | Firebase Firestore + Remote Config |
| **Auth** | Firebase Authentication (Google provider) |
| **i18n** | Google Cloud Translation API v2 |
| **Accessibility** | Google Cloud Text-to-Speech API |
| **Calendar** | Google Calendar API v3 |
| **Maps** | Google Maps Embed API |
| **Cryptography** | @noble/ed25519 (EdDSA signatures) |
| **Blockchain** | Midnight Network (Compact contracts) |
| **Testing** | Vitest (33 unit) + Playwright (23 E2E) |
| **Deployment** | Google Cloud Run |

---

## 🧪 Testing

[![Vitest](https://img.shields.io/badge/Vitest-100%25%20Passing-success?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-100%25%20Passing-success?style=flat-square&logo=playwright)](https://playwright.dev/)

VoxChain maintains rigorous validation standards with 100% of its unit and End-to-End (E2E) test suites currently passing.

### Run Unit Tests
```bash
npm run test:unit
```

Tests cover:
- Quiz engine: difficulty scaling, scoring, grade calculation
- Gemini client: configuration detection, fallback logic
- API routes: request validation, response formatting

### Run E2E Tests
```bash
# Start the dev server first
npm run dev

# In another terminal
npm run test:e2e
```

E2E test coverage:
- `homepage.spec.ts` — hero, navigation, search input
- `eligibility.spec.ts` — full ZK proof flow (eligible + ineligible cases)
- `quiz.spec.ts` — start, answer, adaptive difficulty
- `timeline.spec.ts` — phase expansion, on-chain data display
- `ask.spec.ts` — AI chat navigation and input
- `auth.spec.ts` — wallet connection modal

---

## 🔧 Local Development

### Prerequisites
- Node.js 20+
- npm 10+

### Setup
```bash
git clone https://github.com/malc3om/vox-chain.git
cd vox-chain
npm install
```

### Environment Variables
Create `.env.local`:
```env
# Required for live AI responses
GEMINI_API_KEY=your_gemini_api_key

# Optional: Google Cloud Translation API (multilingual support)
GOOGLE_TRANSLATE_API_KEY=your_translate_api_key

# Optional: Google Cloud Text-to-Speech API (read-aloud)
GOOGLE_TTS_API_KEY=your_tts_api_key

# Optional: Google Maps Embed API (constituency visualization)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key

# Optional: Firebase persistence (fallbacks gracefully)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Run
```bash
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page (GSAP animations)
│   ├── layout.tsx            # Root layout (accessible, skip-to-content)
│   ├── providers.tsx         # Client providers (Wallet + Language)
│   ├── loading.tsx           # Route-level loading skeleton
│   ├── error.tsx             # Error boundary
│   ├── ask/                  # AI Civic Chat + TTS + Translation
│   ├── eligibility/          # ZK Proof + Google Maps embed
│   ├── quiz/                 # Adaptive quiz + Translation + Remote Config
│   ├── timeline/             # Election timeline + Google Calendar
│   └── api/
│       ├── chat/             # Gemini streaming endpoint
│       ├── auth/             # Wallet auth (nonce + verify)
│       ├── translate/        # Google Cloud Translation proxy
│       └── tts/              # Google Cloud TTS proxy
├── lib/
│   ├── ai/
│   │   ├── gemini.ts         # Official @google/generative-ai SDK client
│   │   └── prompts.ts        # Civic system prompt
│   ├── google/
│   │   ├── translate.ts      # Cloud Translation API v2 wrapper
│   │   ├── tts.ts            # Cloud TTS API wrapper
│   │   └── calendar.ts       # Google Calendar API helper
│   ├── firebase.ts           # Firestore + Auth + Remote Config
│   ├── midnight/             # ZK proof logic (Compact stubs)
│   └── quiz/
│       └── engine.ts         # Adaptive quiz state machine
├── contexts/
│   └── LanguageContext.tsx    # i18n context provider (6 languages)
└── components/
    └── layout/Navbar.tsx     # Navbar + Language Selector + Google Sign-In
tests/
├── auth.spec.ts
├── homepage.spec.ts
├── eligibility.spec.ts
├── quiz.spec.ts
├── timeline.spec.ts
└── ask.spec.ts
```

---

## 🌐 Live Demo

**Production URL**: https://voxchain-224920294393.us-central1.run.app

> The live demo uses the built-in civic knowledge base when no Gemini API key is set. Add your key via Cloud Run environment variables to enable live AI.

---

## 📄 Assumptions

1. **Midnight integration** is implemented with realistic contract stubs — the actual Midnight SDK is in testnet. The ZK proof flow simulates the expected on-chain interaction.
2. **Firebase is optional** — all features work without Firestore credentials; it degrades gracefully.
3. **Single branch** deployment as required by submission rules.
4. **No PII stored** — verification events log only boolean outcomes + session IDs.

---

*Built for the Google Antigravity Hackathon 2026 — Civic Intelligence Vertical.*
