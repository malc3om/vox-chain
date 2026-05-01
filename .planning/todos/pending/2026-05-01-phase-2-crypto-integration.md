---
created: 1714561000
title: Phase 2 Cryptographic Integration
area: auth
files:
  - src/app/api/auth/verify/route.ts
---

## Problem
Currently using mocked signature verification (`signature.length > 10`) for the SIWE Midnight wallet auth.

## Solution
Replace with official Midnight DApp Connector logic. Integrate `@midnight-ntwrk/dapp-connector-api` or equivalent to validate Ed25519 signature payload. Improve `WalletModal.tsx` for client-side edge cases.
