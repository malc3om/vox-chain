# Phase 1: Fluidity & Fixes - Context

**Gathered**: 2026-05-03
**Status**: Ready for planning

<domain>
## Phase Boundary
This phase focuses on visual and interactive refinement. We are removing aesthetic regressions (scribble animation), fixing production blockers (Google Authentication authorized domains), and implementing a high-end smooth scrolling experience.

</domain>

<decisions>
## Implementation Decisions

### Aesthetics
- **Remove Scribble Animation**: The hand-drawn SVG animation in the hero heading is too informal for the premium minimalist vibe. Remove it and restore clean typography.
- **Architectural Transitions**: All section transitions should feel like an architectural reveal. Use GSAP ScrollTrigger to stagger entry animations.

### Interactions
- **Smooth Scrolling**: Integrate Lenis (or similar) to provide a buttery smooth scroll feel that complements the GSAP animations.
- **Protocol Ribbon**: Ensure the protocol ribbon (infinite marquee) initializes reliably and matches the visual theme (Grey and Lite Yellow).

### Security
- **Google Auth**: Fix the `auth/unauthorized-domain` error. Ensure `localhost` and the production URL are correctly handled. Provide clear user feedback if the domain is still blocked.

### the agent's Discretion
- Specific GSAP easing functions and stagger values to achieve the "premium" feel.
- Placement of the Lenis initialization (likely in a root layout provider or high-level component).

</decisions>

<canonical_refs>
## Canonical References

### Animation
- `src/components/home/GSAPAnimations.tsx` — Current animation logic.
- `src/app/page.tsx` — Main landing page structure.

### Auth
- `src/lib/firebase.ts` — Firebase configuration and auth helper.
- `src/components/layout/Navbar.tsx` — Auth UI and trigger.

</canonical_refs>

---
*Phase: 01-fluidity-fixes*
*Context gathered: 2026-05-03*
