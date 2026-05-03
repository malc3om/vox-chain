# INTEGRATIONS

## Midnight Network (Web3 / ZK)
- **Network**: Preprod / Mainnet
- **Wallet**: Lace Wallet (Chrome extension required)
- **Local Service**: `midnight-proof-server` running on Docker port 6300
- **SDK**: Currently using local fallbacks via `// @ts-ignore` due to private registry restrictions, but core integration logic relies on `@midnight-ntwrk/midnight-js-network-id`, `@midnight-ntwrk/midnight-js-dapp-connector-api`, etc.

## Google Cloud & Firebase
- **Firebase Auth**: Used for traditional identity authentication (domain: voxchain-*.us-central1.run.app).
- **Google Gemini**: Integrated via `@google/genai` to power the Civic Assistant chatbot for providing unbiased, accurate voting information.

## CI/CD
- **GitHub Actions**: (Implied via .github structure) Automated testing and deployment pipeline to Google Cloud Run.
