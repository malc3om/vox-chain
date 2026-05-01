# VoxChain — AI-Powered Civic Education on Web3

> _"Understand your vote. Prove your eligibility. Trust nothing revealed."_

**VoxChain** is a privacy-first civic education assistant built on the **Midnight Network**. It uses zero-knowledge proofs to let users verify their voter eligibility without exposing personal data — no identity, no age, no address leaves your device.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:3000`

## ✨ Features

| Feature | Route | Description |
|---------|-------|-------------|
| **Hero Landing** | `/` | AI search bar, feature cards, ZK proof explainer |
| **Election Timeline** | `/timeline` | Interactive on-chain election phase tracker |
| **Ask AI** | `/ask` | AI-powered civic Q&A (Gemini API + fallback) |
| **ZK Eligibility** | `/eligibility` | Prove voter eligibility via zero-knowledge proofs |
| **Adaptive Quiz** | `/quiz` | AI-scaled civic knowledge quiz with explanations |

## 🔐 Environment Variables

Create `.env.local`:

```env
# Optional — enables Gemini-powered AI responses
# Without this, the app uses comprehensive built-in civic responses
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🏗️ Tech Stack

- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS
- **Fonts:** Space Grotesk (headings) · Inter (body) · JetBrains Mono (code)
- **AI Engine:** Gemini 2.5 Flash (with fallback civic knowledge base)
- **Blockchain:** Midnight Network (Compact smart contracts)
- **Wallet:** Lace Wallet via DApp Connector API
- **Proofs:** Zero-knowledge proofs for eligibility verification

## 📁 Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts     # AI chat API endpoint
│   ├── ask/page.tsx           # Chat interface
│   ├── eligibility/page.tsx   # ZK proof flow
│   ├── quiz/page.tsx          # Adaptive quiz
│   └── timeline/page.tsx      # Election tracker
├── components/
│   └── layout/Navbar.tsx      # Navigation
├── lib/
│   ├── ai/                    # Gemini client + system prompts
│   ├── midnight/              # Wallet, contracts, ZK proofs
│   └── quiz/                  # Adaptive difficulty engine
├── types/                     # TypeScript definitions
contracts/
├── ElectionTimeline.compact   # Phase tracking contract
└── EligibilityVerifier.compact # ZK eligibility contract
```

## 🎨 Design System

- **Dark mode only** — deep space palette (#0A0A1A)
- **Glassmorphism** — blur + translucent surfaces
- **Glow effects** — Electric Violet (#6C5CE7) + Cyan (#00D2FF)
- **Gradient borders** — Primary → Secondary diagonal

## 🔗 Built For

**PromptWars: Virtual 2026** — Midnight Network Track

Built with the Midnight Network Compact language for privacy-preserving civic education.

## 📜 License

MIT
