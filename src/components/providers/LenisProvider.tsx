"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

/**
 * LenisProvider adds buttery smooth scrolling to the entire application.
 * It is integrated with GSAP ScrollTrigger by default in latest versions.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.1, 
        duration: 1.5, 
        smoothWheel: true,
        wheelMultiplier: 1.1,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
