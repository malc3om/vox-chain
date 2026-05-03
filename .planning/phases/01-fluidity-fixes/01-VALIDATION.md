---
phase: 1
slug: fluidity-fixes
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-05-03
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright / Lint |
| **Config file** | `playwright.config.ts` |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npx playwright test tests/eligibility.spec.ts` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npx playwright test tests/eligibility.spec.ts`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | Aesthetics | — | N/A | lint | `npm run lint` | ✅ | ⬜ pending |
| 01-01-02 | 01 | 2 | Auth Fix | — | N/A | e2e | `npx playwright test tests/eligibility.spec.ts` | ✅ | ⬜ pending |
| 01-01-03 | 01 | 3 | Smooth Scroll | — | N/A | manual | N/A | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure (Playwright) covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Smooth Scroll Feel | Smooth Scroll | Subjective UX | Scroll the landing page and verify "buttery" feel. |
| GSAP Reveal Timing | Architectural Transitions | Visual timing | Scroll slowly and verify elements reveal at the correct distance from viewport. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 20s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending 2026-05-03
