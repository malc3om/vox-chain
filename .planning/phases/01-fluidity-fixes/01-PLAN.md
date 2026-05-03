---
phase: 1
name: Fluidity & Fixes
slug: fluidity-fixes
padded_phase: "01"
wave: 1
depends_on: []
files_modified:
  - src/app/page.tsx
  - src/components/layout/Navbar.tsx
  - src/lib/firebase.ts
  - src/components/providers/lenis-provider.tsx
  - src/app/layout.tsx
  - src/components/home/GSAPAnimations.tsx
autonomous: true
---

# Plan: Phase 1 - Fluidity & Fixes

## Goal
Improve visual quality by removing regressions, fixing authentication domain issues, and implementing a smooth scrolling experience.

## Wave 1: Core Fixes & Setup

<task>
<id>01-01-01</id>
<read_first>
- src/app/page.tsx
- src/components/home/GSAPAnimations.tsx
</read_first>
<action>
Remove the "scribble" animation from the hero heading in `src/app/page.tsx`. Specifically, remove the class names and the inline SVG if present. Ensure the heading "The Future of Civic Trust." uses clean, premium typography.
</action>
<acceptance_criteria>
- `src/app/page.tsx` no longer contains the string "scribble" or the associated hand-drawn SVG.
- The hero heading is centered and styled with standard premium CSS.
</acceptance_criteria>
</task>

<task>
<id>01-01-02</id>
<read_first>
- src/components/layout/Navbar.tsx
- src/lib/firebase.ts
</read_first>
<action>
Improve Google Auth feedback. In `src/components/layout/Navbar.tsx`, replace the `alert()` for `auth/unauthorized-domain` with a console error and a non-blocking UI message (e.g., a state variable `authError` that displays a small message below the button). 
Ensure the `signInWithGoogle` in `src/lib/firebase.ts` handles errors correctly.
</action>
<acceptance_criteria>
- `Navbar.tsx` no longer uses `alert()`.
- Failed login due to unauthorized domain shows a message in the UI or console as a primary feedback mechanism.
</acceptance_criteria>
</task>

## Wave 2: Smooth Scrolling

<task>
<id>01-01-03</id>
<read_first>
- package.json
</read_first>
<action>
Install the `lenis` package.
`npm install lenis`
</action>
<acceptance_criteria>
- `package.json` contains `lenis` in dependencies.
</acceptance_criteria>
</task>

<task>
<id>01-01-04</id>
<read_first>
- src/app/layout.tsx
</read_first>
<action>
Create `src/components/providers/LenisProvider.tsx` as a client component that wraps `ReactLenis`. 
Then, wrap the `children` in `src/app/layout.tsx` with this provider.
</action>
<acceptance_criteria>
- `src/components/providers/LenisProvider.tsx` exists and uses `"use client"`.
- `src/app/layout.tsx` imports and uses `LenisProvider`.
</acceptance_criteria>
</task>

## Wave 3: Animation Refinement

<task>
<id>01-01-05</id>
<read_first>
- src/components/home/GSAPAnimations.tsx
- src/app/page.tsx
</read_first>
<action>
Refactor `GSAPAnimations.tsx` to include "Architectural Reveals". Implement a staggered fade-in/up effect for sections as they enter the viewport using `ScrollTrigger`.
Target the "Step" cards and the "Timeline" sections.
</action>
<acceptance_criteria>
- `GSAPAnimations.tsx` contains `gsap.from` calls with `scrollTrigger` for specific section selectors or refs.
- Elements have an initial state of `opacity: 0, y: 30` or similar.
</acceptance_criteria>
</task>

## Verification Criteria
- [ ] No more "scribble" animation in the hero.
- [ ] Google Auth handles domain errors without alerts.
- [ ] Lenis smooth scroll is active on the page.
- [ ] Section transitions feel intentional and "architectural".

## Must Haves
- Clean hero typography.
- Smooth scrolling.
- Functional auth (with domain error feedback).
