# Phase 1: Fluidity & Fixes - Research

## Domain: Visual Refinement & Auth Stabilization

### 1. Smooth Scrolling (Lenis)
- **Library**: Use `lenis` package (latest).
- **Implementation**: Create a `LenisProvider` using `ReactLenis` from `lenis/react`. Wrap the root layout.
- **GSAP Integration**: Lenis works out-of-the-box with GSAP. Ensure `ScrollTrigger.update()` is called if manual RAF is used, but `lenis/react` handles most cases.
- **Dependencies**: `npm install lenis`.

### 2. Google Authentication (Authorized Domains)
- **Problem**: `auth/unauthorized-domain` error on `localhost`.
- **Solution**: 
  - Add `localhost` to the Authorized Domains list in Firebase Console (Authentication > Settings > Authorized Domains).
  - Add the production Cloud Run URL (voxchain-224920294393.us-central1.run.app) to the list.
- **UI Improvement**: Replace `alert()` with a subtle toast or banner that suggests checking the Firebase configuration.

### 3. GSAP ScrollTrigger Reveals
- **Current State**: `GSAPAnimations.tsx` has some logic for the marquee and ribbon.
- **Goal**: Implement "Architectural Reveal" patterns. This involves using `ScrollTrigger` with `start: "top 80%"` and staggering elements using `opacity: 0, y: 50` style transitions.
- **Key Sections**: Hero, Timeline, 3D Interactive knowledge section.

### 4. Aesthetic Cleanup
- **Scribble Animation**: Remove the `scribble` class and associated SVG from `page.tsx`.
- **Protocol Ribbon**: Ensure the marquee in `GSAPAnimations.tsx` is properly centered and has the correct Lite Yellow (`#ffff00` or similar) background as per user instructions.

## Validation Architecture
- **Auth**: Verify that clicking "Sign in" on localhost triggers the popup and doesn't show the domain error if properly configured.
- **Scroll**: Check that the scroll is smooth and doesn't "snap" or jump.
- **Animations**: Verify that section content fades in/up as it enters the viewport.

---
*Phase: 01-fluidity-fixes*
*Research date: 2026-05-03*
