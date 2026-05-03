# VoxChain — Institutional Web3 Civic Education Platform

[![Live Demo](https://img.shields.io/badge/Live-Cloud%20Run-4285F4?style=flat-square&logo=google-cloud)](https://voxchain-224920294393.us-central1.run.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Midnight Network](https://img.shields.io/badge/Midnight-Network-purple?style=flat-square)](https://midnight.network)

> **"Mathematical proof of eligibility. Absolute privacy of identity."**

VoxChain is a production-grade civic intelligence platform that bridges the gap between institutional transparency and individual privacy. By leveraging **Midnight Network's Zero-Knowledge Proofs** and **Google Gemini's Generative AI**, VoxChain empowers citizens to participate in democracy without compromising their personal data.

---

## 🎨 Visual Identity: "The Grey & Yellow Standard"

VoxChain utilizes a premium **Web3 Institutional Aesthetic**:
- **Palette**: Deep Zinc backgrounds (#09090b), functional Greys, and high-visibility Yellow accents (#fde047).
- **Experience**: Cinematic entrance animations, scroll-triggered reveals (GSAP), and a non-obtrusive reactive navbar.
- **Accessibility**: High-contrast ratios, semantic HTML, and multi-language support (English, Spanish, French, German, Japanese, Hindi).

---

## 🏗️ Core Pillars

### 🔐 Private Verification (Midnight ZK)
Citizens prove their voting eligibility (age, residency) locally. Only a cryptographic proof crosses the wire—your raw data never leaves your device.
- **Nullifiers**: Prevent double-voting while maintaining anonymity.
- **Witnesses**: Private inputs processed on-device via local proof servers.

### 🤖 Civic Intelligence (Google Gemini)
A streaming AI assistant powered by **Gemini 2.0 Flash** provides context-aware answers to complex election queries, backed by a curated civic knowledge base.
- **Adaptive Learning**: AI-generated quiz questions that scale in difficulty based on user performance.

### 📊 Immutable Timeline
Real-time tracking of election phases as immutable milestones, providing a single source of truth for the civic lifecycle.

---

## 🛠️ Technology Stack

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | Next.js 15+ (App Router) | React Framework |
| **Styling** | Tailwind CSS + GSAP | Animations & Visual Design |
| **ZK Core** | Midnight Network (Compact) | Privacy-preserving Logic |
| **AI/ML** | Google Gemini 2.0 | Generative Q&A & Adaptive Quizzing |
| **Infrastructure** | Google Cloud Run | Serverless Deployment |
| **Persistence** | Firebase Firestore | Anonymized Analytics & Remote Config |
| **Authentication** | Firebase + Lace Wallet | Hybrid Auth (Web2 Social + Web3 Wallet) |

---

## 🧪 Quality & Validation

VoxChain maintains a 100% pass rate across its dual-layer testing suite:
- **Unit (Vitest)**: 30+ tests covering quiz logic, AI fallback, and state machines.
- **E2E (Playwright)**: 20+ scenarios validating ZK proof flows, AI chat interaction, and responsive navigation.

### Run Tests
```bash
npm run test:unit    # Unit tests
npm run test:e2e     # E2E scenarios
```

---

## 🔧 Local Setup

1. **Clone & Install**:
   ```bash
   git clone https://github.com/malc3om/vox-chain.git
   npm install
   ```

2. **Environment**:
   Configure `.env.local` with your Google Cloud and Firebase credentials (see `.env.local.example`).

3. **Midnight Proof Server**:
   ```bash
   docker run -p 6300:6300 midnightntwrk/proof-server:8.0.3
   ```

4. **Dev**:
   ```bash
   npm run dev
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

---

## 📄 Compliance & Privacy
- **Zero PII**: No Names, Emails, or Addresses are stored in Firestore.
- **Anonymized Events**: Verification logs track only `eligible: true/false` outcomes for statistical analysis.
- **Open Source**: Built with transparency at its core.

*Built for the Google Antigravity Hackathon 2026 — Civic Intelligence Vertical.*
