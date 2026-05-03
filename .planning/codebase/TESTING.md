# TESTING

## Frameworks
- **E2E Testing**: Playwright (configured in `playwright.config.ts`).
- **Unit/Integration Testing**: Vitest (configured in `vitest.config.ts`, `vitest.setup.ts`).

## Structure
- Tests reside in the `tests/` folder or alongside components depending on the specific target.
- Results output to `test-results/` and `playwright-report/`.

## Coverage
- Expected to cover Core UI flows, API route logic, and fallback logic for environments where wallet simulation is active.
