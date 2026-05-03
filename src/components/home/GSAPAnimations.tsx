"use client";

import { type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function GSAPAnimations({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  useGSAP(
    () => {
      // 1. Hero Entrance Animation
      gsap.from(".hero-elem", {
        y: 60,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.1,
      });

      // 2. Hero Parallax Scroll Effect
      // Fixed: limit the trigger to the hero section to prevent opacity dropping to 0 for the whole page scroll
      gsap.to(".hero-elem", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: (i) => (i + 1) * -50,
        opacity: 0,
        ease: "none",
      });

      // 3. Features Staggered Reveal
      // Fixed: Use toggleActions instead of scrub so it stays visible when scrolling back up
      gsap.fromTo(
        ".feature-card",
        { y: 100, opacity: 0, scale: 0.9 },
        {
          scrollTrigger: {
            trigger: ".features-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

      // 4. How It Works - Reveal
      // Fixed: Use toggleActions to prevent disappearing on scroll up
      const steps = gsap.utils.toArray(".step-card");
      steps.forEach((step: any, i) => {
        gsap.fromTo(
          step,
          { x: i % 2 === 0 ? -100 : 100, opacity: 0 },
          {
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "back.out(1.2)",
          }
        );
      });

      // 5. Timeline Nodes Animation
      gsap.fromTo(
        ".timeline-node",
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".timeline-section",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
        }
      );

      // 6. Ribbon Infinite Marquee
      gsap.to(".ribbon-content", {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1,
      });

      // 7. Floating background orbs parallax + constant drift
      gsap.to(".floating-orb", {
        y: "random(-60, 60)",
        x: "random(-60, 60)",
        scale: "random(0.8, 1.2)",
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 1.5,
      });

      gsap.to(".floating-orb", {
        scrollTrigger: {
          trigger: ".how-it-works-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
        y: -200,
        ease: "none",
      });
    },
    { scope: containerRef }
  );

  return null;
}
