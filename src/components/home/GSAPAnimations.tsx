"use client";

import { type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * GSAP Animations Component (dynamically imported).
 *
 * Loaded via `next/dynamic` with `ssr: false` so the GSAP bundle
 * (ScrollTrigger + useGSAP) is only shipped to the client and
 * doesn't block the initial HTML/CSS render.
 */
export default function GSAPAnimations({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  useGSAP(
    () => {
      // Hero Animation
      gsap.from(".hero-elem", {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      });

      // Features Scroll Animation
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: ".features-section",
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
      });

      // How it works Scroll Animation
      gsap.from(".step-card", {
        scrollTrigger: {
          trigger: ".how-it-works-section",
          start: "top 90%",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power2.out",
      });

      // Floating animation for background elements
      gsap.to(".floating-orb", {
        y: "random(-30, 30)",
        x: "random(-30, 30)",
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 1,
      });
    },
    { scope: containerRef }
  );

  // Render nothing — this is a side-effect-only component
  return null;
}
