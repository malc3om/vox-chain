"use client";

import { type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function GSAPAnimations({
  containerRef,
  ribbonRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  ribbonRef: RefObject<HTMLDivElement | null>;
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
      gsap.to(".hero-elem", {
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
        y: (i) => (i + 1) * -50,
        ease: "none",
      });

      // 3. Features Staggered Reveal
      gsap.fromTo(
        ".feature-card",
        { y: 100, opacity: 0, scale: 0.9 },
        {
          scrollTrigger: {
            trigger: ".features-section",
            start: "top 80%",
            once: true,
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

      // 4. How It Works - Reveal (Architectural Fade Up)
      const steps = gsap.utils.toArray(".step-card");
      steps.forEach((step: any, i) => {
        gsap.fromTo(
          step,
          { y: 80, opacity: 0, filter: "blur(8px)" },
          {
            scrollTrigger: {
              trigger: step,
              start: "top 90%",
              once: true,
            },
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            delay: i * 0.1,
            ease: "expo.out",
          }
        );
      });

      // 5. Timeline Nodes Animation (Isometric Reveal)
      gsap.fromTo(
        ".isometric-node",
        { 
          y: 60, 
          opacity: 0, 
          rotateX: 45, 
          rotateZ: -45,
          scale: 0.8
        },
        {
          scrollTrigger: {
            trigger: ".timeline-section",
            start: "top 80%",
            once: true,
          },
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          stagger: {
            each: 0.2,
            from: "start"
          },
          ease: "power4.out",
        }
      );

      // 7. Ribbon Infinite Marquee - Fixed with Class targeting for reliability
      gsap.to(".ribbon-content", {
        xPercent: -50,
        ease: "none",
        duration: 20,
        repeat: -1,
      });


      // 8. Floating background orbs parallax + constant drift
      const orbs = document.querySelectorAll(".floating-orb");
      if (orbs.length > 0) {
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
            trigger: ".timeline-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
          y: -200,
          ease: "none",
        });
      }
    },
    { scope: containerRef, dependencies: [containerRef, ribbonRef] }
  );


  return null;
}
