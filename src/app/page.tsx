"use client";

import { useState, useRef, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowRight, Shield, Cpu, HelpCircle, Activity, type LucideIcon } from "lucide-react";

const GSAPAnimations = dynamic(
  () => import("@/components/home/GSAPAnimations"),
  { ssr: false }
);


interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

const FEATURES: readonly FeatureItem[] = [
  {
    icon: HelpCircle,
    title: "Ask AI",
    description: "Deep-dive into election mechanics with Gemini",
    href: "/ask",
  },
  {
    icon: Activity,
    title: "Timeline",
    description: "3D visualization of the election cycle",
    href: "/timeline",
  },
  {
    icon: Shield,
    title: "Eligibility",
    description: "Verify your vote with Zero-Knowledge proofs",
    href: "/eligibility",
  },
  {
    icon: Cpu,
    title: "Quiz",
    description: "Interactive civic knowledge assessment",
    href: "/quiz",
  },
] as const;

const TIMELINE_PHASES = [
  {
    title: "Registration",
    desc: "Voter roll verification via ZK-Eligibility.",
    detailedDesc: "The protocol uses Zero-Knowledge proofs to verify your identity against the official voter database without ever exposing your private data. This ensures only eligible citizens can participate while maintaining absolute anonymity.",
    color: "var(--color-accent)",
  },
  {
    title: "Primaries",
    desc: "Selecting party representatives privately.",
    detailedDesc: "In this phase, individual party members cast their ballots using private state transactions. The network aggregates these results to select candidates while keeping individual preferences completely hidden from public view.",
    color: "#a1a1aa",
  },
  {
    title: "General Election",
    desc: "The final ballot on the secure network.",
    detailedDesc: "The main event where all verified voters cast their final choice. Every vote is an immutable ZK-proof, ensuring the result is mathematically verifiable by anyone while keeping the specific choice of each voter private.",
    color: "var(--color-accent)",
  },
  {
    title: "Certification",
    desc: "Immutable results verification and audit.",
    detailedDesc: "After the voting period ends, the network automatically certifies the results. Using public ZK-summaries, citizens can verify the final tally's integrity without needing a central authority to 'trust'.",
    color: "#a1a1aa",
  },
] as const;


// ── Memoized sub-components ──

const FeatureCard = memo(function FeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = feature.icon;
  return (
    <Link href={feature.href} className="feature-card block h-full">
      <div className="glass-pane premium-card p-8 h-full flex flex-col items-center text-center justify-between group">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform duration-700 group-hover:bg-accent/10 group-hover:border-accent/30 shadow-inner">
            <Icon className="w-7 h-7 opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-heading font-bold text-2xl text-text-primary mb-4 tracking-tight">
            {feature.title}
          </h3>
          <p className="text-base text-text-secondary leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
            {feature.description}
          </p>
        </div>
        <div className="mt-10 flex items-center justify-center text-accent text-[10px] font-mono font-bold uppercase tracking-[0.2em] group-hover:translate-y-[-4px] transition-transform duration-500">
          Access Module
          <ArrowRight className="w-3 h-3 ml-3" />
        </div>
      </div>
    </Link>
  );
});

const TimelineNode = memo(function TimelineNode({ 
  title, 
  desc, 
  detailedDesc,
  index 
}: { 
  title: string; 
  desc: string; 
  detailedDesc: string;
  index: number 
}) {
  return (
    <div className="timeline-node-container perspective-container flex-1 h-[450px] group relative hover:z-50 transition-all duration-300">
      {/* The Main Isometric Card */}
      <div className="isometric-node glass-pane p-10 h-full flex flex-col justify-end relative overflow-hidden border-r border-b border-accent/10 hover:border-accent/60 z-20 transition-all duration-700">
        <div className="absolute top-6 right-6 text-6xl font-heading font-black text-accent/5 group-hover:text-accent/10 transition-colors pointer-events-none">
          0{index + 1}
        </div>
        
        <div className="relative z-10 transition-transform duration-700 group-hover:-translate-y-4">
          <h4 className="font-heading text-2xl font-black text-accent mb-4 uppercase tracking-tighter leading-none">{title}</h4>
          <p className="text-sm text-text-secondary leading-relaxed font-medium opacity-70 group-hover:opacity-100 transition-opacity">{desc}</p>
        </div>
 
        {/* The "Timeline Reveal" - Detailed Info Pane */}
        <div className="absolute inset-0 bg-bg-matte/95 p-8 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) z-20 border border-accent/20">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] font-sans">Protocol Deep-Dive</span>
          </div>
          
          <p className="text-[13px] text-text-primary leading-[1.8] font-mono opacity-90 max-w-[95%]">
            {detailedDesc}
          </p>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        {/* Depth shadow for 3D feel */}
        <div className="absolute inset-0 bg-accent/5 -z-10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* The Connecting "Timeline" String */}
      <div className="absolute top-1/2 -left-4 w-8 h-[2px] bg-gradient-to-r from-transparent to-accent/20 -translate-y-1/2 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden lg:block" />
    </div>
  );
});

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);

  const handleAsk = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        router.push(`/ask?q=${encodeURIComponent(trimmed)}`);
      }
    },
    [query, router]
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-bg-deep text-text-primary selection:bg-accent selection:text-bg-deep" ref={container}>
      <GSAPAnimations containerRef={container} ribbonRef={ribbonRef} />

      {/* ── 3D Hero Section ────────────────── */}
      <section className="hero-section relative w-full h-screen flex flex-col items-center justify-center pt-16 pb-6 px-8 overflow-hidden">
        {/* Background Depth Elements */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="floating-orb w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] absolute -top-60 -left-60" />
          <div className="floating-orb w-[800px] h-[800px] bg-white/5 rounded-full blur-[180px] absolute top-60 -right-60" />
        </div>

        {/* Hero Content */}
        <div className="hero-elem mb-2">
          <span className="px-4 py-1 rounded-full bg-accent/5 border border-accent/20 text-[10px] font-bold uppercase tracking-[0.2em] text-accent flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            VoxChain Protocol v2.0
          </span>
        </div>

        <h1 className="hero-elem flex flex-col items-center text-center font-[family-name:var(--font-syne)] font-black tracking-tighter z-10 my-6 select-none">
          <span className="text-5xl md:text-8xl lg:text-9xl leading-[0.8] uppercase flex items-baseline gap-1">
            The Future <span className="lowercase font-light opacity-40 text-[0.35em] tracking-normal translate-y-[-0.1em]">of</span>
          </span>
          <span className="text-5xl md:text-8xl lg:text-9xl leading-[0.8] uppercase text-white">
            Civic Trust.
          </span>
        </h1>


        <p className="hero-elem mt-1 text-sm md:text-base text-text-secondary max-w-xl text-center font-medium leading-relaxed z-10 relative">
          Zero-Knowledge educational platform. Understand the timeline, trust the process.
        </p>

        {/* ── Search Bar ── */}
        <div className="hero-elem mt-2 w-full max-w-2xl z-10 relative perspective-container">

          <form
            onSubmit={handleAsk}
            className="relative group transition-transform duration-500 hover:scale-[1.02]"
          >
            <div className="absolute -inset-1 bg-accent/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="glass-pane relative rounded-2xl flex items-center p-2 transition-all duration-300 focus-within:ring-1 focus-within:ring-accent/50">
              <input
                id="hero-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="How does voting verification work?"
                className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-lg px-8 py-4 w-full font-medium"
              />
              <button
                type="submit"
                className="bg-accent text-bg-matte px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all hover:bg-[#fff7ad] hover:shadow-[0_0_30px_var(--color-accent-glow)]"
                id="hero-ask-btn"
              >
                Ask AI
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── 3D Interactive Timeline ────────── */}
      <section className="timeline-section w-full relative z-10 py-40 overflow-hidden bg-bg-matte">
        {/* 3D Perspective Grid Background */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="bg-grid-premium w-[200%] h-[200%] absolute -top-1/2 -left-1/2 rotate-12" />
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="mb-32 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-[1px] bg-accent" />
                <span className="text-accent text-xs font-bold uppercase tracking-[0.3em]">Protocol Roadmap</span>
              </div>
              <h2 className="font-heading text-5xl md:text-7xl font-bold tracking-tighter mb-8">
                Election <span className="text-accent">Timeline</span>
              </h2>
              <p className="text-text-secondary text-xl font-medium max-w-xl leading-relaxed">
                A non-linear, 3D visualization of the electoral cycle. Each node represents a secure ZK-proof gate.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-4">
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-text-muted">
                <span>Navigate</span>
                <div className="w-24 h-[1px] bg-white/10" />
                <Activity className="w-4 h-4 text-accent" />
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 perspective-container py-20">
            {/* The 3D Timeline Rail */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2 z-0 hidden lg:block overflow-hidden">
              <div className="absolute inset-0 bg-accent/20 translate-x-[-100%] animate-[shimmer_3s_infinite]" />
            </div>

            {TIMELINE_PHASES.map((phase, i) => (
              <TimelineNode 
                key={phase.title} 
                title={phase.title} 
                desc={phase.desc} 
                detailedDesc={phase.detailedDesc}
                index={i} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Matrix ────────────────── */}
      <section className="features-section w-full relative z-10 py-40 border-t border-white/5 bg-bg-deep">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col items-center mb-24 text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tighter mb-6">
              Core <span className="text-accent">Infrastructure</span>
            </h2>
            <p className="text-text-muted max-w-2xl">
              Modular components designed for maximum security and privacy in a decentralized civic landscape.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.href} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Animated Ribbon ────────────────── */}
      <div className="ribbon-container relative w-full overflow-hidden bg-accent text-bg-matte py-6 z-20 -rotate-1 border-y border-white/10 shadow-2xl">
        <div ref={ribbonRef} className="ribbon-content whitespace-nowrap flex font-heading text-2xl font-black uppercase tracking-tighter items-center">
          {[...Array(20)].map((_, i) => (

            <span key={i} className="mx-12 flex items-center gap-6">
              <Shield className="w-6 h-6" />
              Privacy First
              <span className="w-2 h-2 rounded-full bg-bg-matte" />
              Zero-Knowledge
              <span className="w-2 h-2 rounded-full bg-bg-matte" />
              Immutable Results
            </span>
          ))}
        </div>
      </div>

      <footer className="w-full py-20 px-8 text-center text-text-muted text-xs font-bold uppercase tracking-widest border-t border-white/5">
        &copy; 2026 VoxChain Protocol • Secure Civic Network
      </footer>

    </div>
  );
}

