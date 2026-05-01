"use client";

import { useState, useRef, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Shield, Cpu, HelpCircle, Activity, type LucideIcon } from "lucide-react";

// ── Dynamic GSAP import — keeps initial JS bundle smaller ──
const GSAPAnimations = dynamic(
  () => import("@/components/home/GSAPAnimations"),
  { ssr: false }
);

// ── Static feature data (const assertion for type narrowing) ──

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
    description: "Get answers to any election question in plain language",
    href: "/ask",
  },
  {
    icon: Activity,
    title: "Timeline",
    description: "Track election phases as immutable on-chain milestones",
    href: "/timeline",
  },
  {
    icon: Shield,
    title: "Eligibility",
    description: "Prove you can vote without revealing who you are",
    href: "/eligibility",
  },
  {
    icon: Cpu,
    title: "Quiz",
    description: "Test your civic knowledge with AI-adaptive questions",
    href: "/quiz",
  },
] as const;

const QUICK_PROMPTS = [
  "How is my vote counted?",
  "What happens after polls close?",
  "Am I eligible to vote?",
] as const;

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Input Privately",
    desc: "Enter your age and constituency. This data never leaves your device and is kept entirely local.",
  },
  {
    step: "02",
    title: "Generate Proof",
    desc: "A ZK proof is created locally that proves your eligibility mathematically, without revealing details.",
  },
  {
    step: "03",
    title: "Verify On-Chain",
    desc: "The proof is verified on the Midnight Network. You're marked eligible — cryptographically and privately.",
  },
] as const;

// ── Memoized sub-components for render efficiency ──

const FeatureCard = memo(function FeatureCard({ feature }: { feature: FeatureItem }) {
  const Icon = feature.icon;
  return (
    <Link href={feature.href} className="feature-card block">
      <div className="premium-card p-8 h-full flex flex-col justify-between group">
        <div>
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-primary mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-white/10">
            <Icon className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-heading font-medium text-xl text-text-primary mb-3">
            {feature.title}
          </h3>
          <p className="text-sm text-text-muted leading-relaxed">
            {feature.description}
          </p>
        </div>
        <div className="mt-8 flex items-center text-text-secondary text-sm font-medium group-hover:text-white transition-colors">
          Explore
          <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </div>
      </div>
    </Link>
  );
});

const StepCard = memo(function StepCard({
  step,
  title,
  desc,
}: {
  step: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="step-card premium-card p-10 relative overflow-hidden group">
      <div className="text-6xl font-heading font-light text-white/5 absolute top-4 right-4 group-hover:scale-110 transition-transform duration-700">
        {step}
      </div>
      <h3 className="font-heading font-medium text-2xl mb-4 text-text-primary mt-12 relative z-10">
        {title}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed relative z-10">
        {desc}
      </p>
    </div>
  );
});

// ── Main Page Component ──

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);

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

  const handleQuickPrompt = useCallback(
    (prompt: string) => {
      setQuery(prompt);
      router.push(`/ask?q=${encodeURIComponent(prompt)}`);
    },
    [router]
  );

  return (
    <div className="flex flex-col items-center min-h-screen" ref={container}>
      {/* Dynamically loaded GSAP animations — only on client */}
      <GSAPAnimations containerRef={container} />

      {/* ── Hero Section ─────────────────── */}
      <section className="relative w-full flex flex-col items-center justify-center pt-40 pb-32 px-[var(--spacing-page)] overflow-hidden">
        {/* Badge */}
        <div className="hero-elem mb-8 z-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-medium tracking-wide text-text-secondary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            POWERED BY MIDNIGHT NETWORK ZK PROOFS
          </div>
        </div>

        {/* Headline */}
        <h1 className="hero-elem font-heading text-5xl md:text-7xl lg:text-8xl font-medium text-center leading-[1.1] max-w-5xl tracking-tight z-10 relative text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
          Understand your vote.
          <br />
          Trust nothing revealed.
        </h1>

        {/* Subtitle */}
        <p className="hero-elem mt-8 text-lg md:text-xl text-text-secondary max-w-2xl text-center font-normal leading-relaxed z-10 relative">
          Civic transparency and personal privacy are not opposites. Prove your
          eligibility to vote without revealing who you are, where you live, or
          how old you are.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleAsk}
          className="hero-elem mt-12 w-full max-w-2xl z-10 relative"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-bg-surface border border-white/10 rounded-full flex items-center p-2 backdrop-blur-md transition-all duration-300 focus-within:border-white/30 focus-within:bg-bg-elevated shadow-2xl">
              <input
                id="hero-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What is the electoral college?"
                className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-base md:text-lg px-6 w-full"
              />
              <button
                type="submit"
                className="bg-white text-black px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:scale-105 transition-transform duration-300"
                id="hero-ask-btn"
              >
                Ask VoxChain
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Quick prompts */}
        <div className="hero-elem mt-10 flex flex-wrap justify-center gap-3 z-10 relative opacity-80">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleQuickPrompt(prompt)}
              className="text-sm text-text-secondary bg-white/5 border border-white/5 hover:border-white/20 hover:text-white px-4 py-2 rounded-full transition-all cursor-pointer backdrop-blur-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      {/* ── Features Grid ────────────────── */}
      <section className="features-section w-full relative z-10">
        <div className="max-w-7xl mx-auto px-[var(--spacing-page)] py-24 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.href} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────── */}
      <section className="how-it-works-section w-full relative z-10 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center">
          <div className="floating-orb w-96 h-96 bg-accent rounded-full blur-[100px] absolute -top-20 -left-20" />
          <div className="floating-orb w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] absolute top-40 right-10" />
        </div>

        <div className="max-w-7xl mx-auto px-[var(--spacing-page)] py-32 border-t border-white/5 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-heading text-4xl md:text-5xl font-medium mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
              How Zero-Knowledge Works
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Prove facts about yourself without revealing the facts themselves.
              Powered by Midnight Network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS_STEPS.map((item) => (
              <StepCard
                key={item.step}
                step={item.step}
                title={item.title}
                desc={item.desc}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
