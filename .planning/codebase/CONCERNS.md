# CONCERNS

## Technical Debt & Workarounds
- **Private Registry Access**: The `@midnight-ntwrk` SDK packages require access to a private registry. The `package.json` currently omits these to allow CI builds to pass, and `src/lib/midnight/` logic is shielded with `// @ts-ignore`. This must be updated once registry access is secured.
- **Mock Implementations**: Non-Windows or development environments currently fall back to mock connection and proof simulation. The goal is to fully transition to real SDK calls everywhere once possible.

## Platform Limitations
- **Windows OS**: Midnight Network Proof Server runs via Docker on Windows (WSL required). The application currently warns Windows users that a local Docker instance is mandatory to perform ZK verifications.

## Authentication
- **Firebase Auth Domains**: Recently encountered "auth/unauthorized-domain" errors for Google Auth in production (`voxchain-224920294393.us-central1.run.app`). The domain needs to be correctly whitelisted in the Firebase console.
