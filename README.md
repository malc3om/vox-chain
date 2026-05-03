# <p align="center"><img src="public/logo.png" width="120" alt="VoxChain Logo" /><br>VoxChain</p>

<p align="center">
  <strong>Institutional Web3 Civic Intelligence Platform</strong><br>
  <em>Mathematical proof of eligibility. Absolute privacy of identity.</em>
</p>

<p align="center">
  <a href="https://voxchain-224920294393.us-central1.run.app">
    <img src="https://img.shields.io/badge/Live-Cloud%20Run-4285F4?style=for-the-badge&logo=google-cloud" alt="Live Demo" />
  </a>
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  </a>
  <a href="https://midnight.network">
    <img src="https://img.shields.io/badge/Midnight-Network-purple?style=for-the-badge" alt="Midnight Network" />
  </a>
</p>

---

## 🏛️ The Vision

VoxChain is a production-grade civic intelligence platform that bridges the gap between institutional transparency and individual privacy. By leveraging **Midnight Network's Zero-Knowledge Proofs** and **Google Gemini's Generative AI**, VoxChain empowers citizens to participate in democracy without compromising their personal data.

### 🎨 Visual Identity: "The Grey & Yellow Standard"
- **Palette**: Deep Zinc backgrounds (`#09090b`), functional Greys, and high-visibility Yellow accents (`#fde047`).
- **Experience**: Cinematic entrance animations, scroll-triggered reveals (GSAP), and a minimalist "V-box" branding.
- **Symmetry**: Absolute viewport alignment for navigation and hero elements, optimized for professional civic standards.

---

## 🏗️ Core Pillars

| Feature | Description | Technology |
| :--- | :--- | :--- |
| **🔐 Private Verification** | Citizens prove voting eligibility locally. Only a cryptographic proof crosses the wire. | **Midnight ZK** |
| **🤖 Civic Intelligence** | A streaming AI assistant providing context-aware answers to complex election queries. | **Google Gemini 2.0** |
| **📊 Immutable Timeline** | Real-time tracking of election phases as immutable milestones for institutional trust. | **Google Cloud Run** |
| **🌐 Global Access** | Multi-language support (EN, ES, FR, DE, JP, HI) with cloud translation. | **Google Translate API** |

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, GSAP
- **AI/ML**: Gemini 2.0 Flash (Streaming Q&A, Adaptive Quizzing)
- **Privacy Core**: Midnight Network (ZK Proofs, Nullifiers, Witnesses)
- **Infrastructure**: Google Cloud Run, Firebase Firestore, Cloud Translation, Cloud TTS
- **Authentication**: Firebase Social Auth + Lace Wallet (SIWE-style)

---

## 📁 Project Architecture

```bash
src/
├── app/
│   ├── ask/          # AI Civic Chat + TTS + Translation
│   ├── eligibility/  # ZK Proof + Google Maps Integration
│   ├── quiz/         # Adaptive AI Quizzing + Remote Config
│   └── timeline/     # Immutable Election Lifecycle
├── lib/
│   ├── ai/           # Gemini SDK + Civic System Prompts
│   ├── google/       # Cloud Translate, TTS, Calendar Wrappers
│   └── midnight/     # ZK Proof Logic & Wallet Integration
└── components/
    └── layout/       # Symmetric Navbar & Responsive Shell
```

---

## 🔧 Rapid Deployment

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Copy `.env.local.example` to `.env.local` and populate with Google Cloud & Firebase keys.

3. **Midnight Proof Server (Required for ZK)**:
   ```bash
   docker run -p 6300:6300 midnightntwrk/proof-server:8.0.3
   ```

4. **Launch Development**:
   ```bash
   npm run dev
   ```

---

## 🧪 Quality & Compliance

VoxChain maintains a 100% pass rate across its dual-layer testing suite:
- **Unit (Vitest)**: Validating quiz logic, state machines, and AI fallbacks.
- **E2E (Playwright)**: Verifying ZK flows, AI interaction, and cross-device symmetry.

**Privacy Standards**:
- **Zero PII**: No Names, Emails, or Addresses stored in Firestore.
- **Anonymized Events**: Verification logs track only eligibility outcomes.

---

<p align="center">
  <em>Built for the Google Antigravity Hackathon 2026 — Civic Intelligence Vertical.</em><br>
  <strong>Empowering the Citizen. Protecting the Soul.</strong>
</p>
