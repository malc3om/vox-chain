# 🌌 VoxChain

### **The Privacy-First Civic Oracle**
> _"Where absolute privacy meets radical civic transparency."_

[![Midnight Network](https://img.shields.io/badge/Blockchain-Midnight-black?style=for-the-badge&logo=target)](https://midnight.network)
[![Next.js 15](https://img.shields.io/badge/Framework-Next.js%2015-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Design-Tailwind%20CSS-black?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

---

## 💡 The Problem: The Civic Transparency Paradox
In modern democracy, we face a fundamental conflict:
1. **Public Accountability**: We need proof that voters are eligible and processes are fair.
2. **Personal Privacy**: Revealing identity, age, or residence to prove eligibility exposes citizens to surveillance, profiling, and data breaches.

Most "digital identity" solutions fail by forcing a choice between the two. **VoxChain eliminates the compromise.**

## 🚀 The Innovation: Zero-Knowledge Civic Intelligence
VoxChain is a decentralized platform that leverages the **Midnight Network** to bridge the gap between AI-driven civic education and blockchain-secured privacy.

### **Our Three-Pillar Approach**
1.  **Midnight ZK-Proofs**: Instead of uploading documents, users generate local Zero-Knowledge proofs (using the Compact language) that verify eligibility criteria (age, residency) mathematically. The network confirms the *fact* of eligibility without ever seeing the *data*.
2.  **AI Civic Oracle**: Integrated with Gemini 1.5 Flash, VoxChain provides real-time, context-aware answers to complex electoral questions—from the Electoral College to local ballot measures—grounded in verified civic data.
3.  **Premium Minimalist UX**: Inspired by the LayerZero aesthetic, VoxChain utilizes GSAP-driven scroll orchestration and glassmorphism to transform "boring" civic data into a stunning, professional Web3 experience.

---

## ✨ Core Features

| Feature | Innovation | Approach |
|:---|:---|:---|
| **ZK Eligibility** | `Midnight Network` | Local proof generation ensures PII (Personally Identifiable Information) never leaves the user's device. |
| **Ask VoxChain** | `Gemini 1.5 Flash` | Hybrid AI engine that falls back to a curated civic knowledge base when keys are missing. |
| **Phase Tracker** | `On-Chain Timeline` | Real-time tracking of election cycles powered by Midnight smart contracts. |
| **Adaptive Learning** | `Neural Quiz` | A knowledge-assessment engine that scales difficulty based on user interaction patterns. |

---

## 🛠️ Tech Stack & Architecture

- **Blockchain Layer**: Midnight Network (Compact Smart Contracts)
- **Zero-Knowledge**: Local proof generation via Midnight DApp Connector
- **Intelligence Layer**: Google Gemini 1.5 Flash
- **Frontend Layer**: Next.js 15 (App Router) + TypeScript
- **Animations**: GSAP (ScrollTrigger + Physics-based easing)
- **Styling**: Tailwind CSS + Custom Glassmorphism System

```bash
# 📁 Architecture Overview
src/
├── app/
│   ├── eligibility/   # ZK-Proof Generation Logic
│   ├── ask/           # Gemini-Powered Civic Chat
│   └── timeline/      # On-Chain State Visualization
├── lib/
│   ├── midnight/      # Compact Contract Abstractions
│   └── ai/            # Prompt Engineering & Gemini Client
└── contracts/         # .compact Smart Contract Source
```

---

## 🏁 Getting Started

### 1. Environment Configuration
Create a `.env.local` file in the root directory:
```env
# Optional — enables premium AI responses
GEMINI_API_KEY=your_key_here

# Midnight Network Configuration
MIDNIGHT_NETWORK_ID=testnet
```

### 2. Local Development
```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

---

## 🎨 Design Philosophy: LayerZero Minimalist
VoxChain isn't just a tool; it's an experience. We moved away from "Brutalist" chaos to a **Minimalist Premium** aesthetic:
- **Deep Blacks (#000000)**: Focuses the user's attention on data and insights.
- **Glassmorphism**: High-blur backdrops create a sense of depth and security.
- **GSAP Orchestration**: Every interaction—from cards sliding in to floating background orbs—is calculated to feel fluid and alive.

---

## 📜 Recognition
Built for **PromptWars: Virtual 2026** - *Midnight Network Track*.

---

## ⚖️ License
MIT © [malc3om](https://github.com/malc3om)
