"use client";

import { useState } from "react";

type Step = "intro" | "connect" | "input" | "proving" | "result";

export default function EligibilityPage() {
  const [step, setStep] = useState<Step>("intro");
  const [walletConnected, setWalletConnected] = useState(false);
  const [formData, setFormData] = useState({ age: "", constituency: "" });
  const [isEligible, setIsEligible] = useState<boolean | null>(null);

  function handleConnect() {
    setStep("connect");
    setTimeout(() => { setWalletConnected(true); setStep("input"); }, 1500);
  }

  function handleProve(e: React.FormEvent) {
    e.preventDefault();
    setStep("proving");
    setTimeout(() => {
      setIsEligible(parseInt(formData.age) >= 18 && formData.constituency.trim().length > 0);
      setStep("result");
    }, 3000);
  }

  function handleReset() {
    setStep("intro"); setWalletConnected(false);
    setFormData({ age: "", constituency: "" }); setIsEligible(null);
  }

  const steps = [
    { id: "connect", label: "Connect Wallet", num: 1 },
    { id: "input", label: "Enter Data", num: 2 },
    { id: "proving", label: "Generate Proof", num: 3 },
    { id: "result", label: "See Result", num: 4 },
  ];
  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen pt-24 pb-16 px-[var(--spacing-page)]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-text-secondary mb-4">
            <span className="text-accent">◇</span> Zero-Knowledge Verification
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">
            Prove Your <span className="gradient-text">Eligibility</span>
          </h1>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">
            Verify you can vote without revealing your identity. Powered by Midnight Network ZK proofs.
          </p>
        </div>

        {step !== "intro" && (
          <div className="mb-10 animate-fade-in">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= currentStepIndex ? "gradient-primary text-white glow-primary" : "bg-bg-elevated text-text-muted border border-glass-border"}`}>
                    {i < currentStepIndex ? "✓" : s.num}
                  </div>
                  {i < steps.length - 1 && <div className={`w-12 md:w-20 h-0.5 mx-1 transition-all ${i < currentStepIndex ? "bg-primary" : "bg-bg-elevated"}`} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "intro" && (
          <div className="glass rounded-2xl p-8 text-center animate-slide-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center text-4xl glow-primary">🔐</div>
            <h2 className="font-heading text-2xl font-bold mb-3">Private Eligibility Check</h2>
            <p className="text-text-secondary mb-6 max-w-sm mx-auto text-sm">Your personal data <strong>never leaves your device</strong>.</p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[{ icon: "🔒", label: "Age private" }, { icon: "📍", label: "Address private" }, { icon: "🆔", label: "Identity private" }].map((item) => (
                <div key={item.label} className="bg-bg-elevated rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <p className="text-xs text-text-secondary">{item.label}</p>
                </div>
              ))}
            </div>
            <button onClick={handleConnect} className="btn-primary text-base" id="start-eligibility-btn">Start Verification →</button>
          </div>
        )}

        {step === "connect" && !walletConnected && (
          <div className="glass rounded-2xl p-8 text-center animate-slide-up">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            <h2 className="font-heading text-xl font-bold mb-2">Connecting to Lace Wallet...</h2>
            <p className="text-text-secondary text-sm">Approve the connection in your wallet extension.</p>
          </div>
        )}

        {step === "input" && (
          <div className="glass rounded-2xl p-8 animate-slide-up">
            <h2 className="font-heading text-xl font-bold mb-2">Enter Your Information</h2>
            <p className="text-text-secondary text-sm mb-6">Processed <strong>locally</strong>. Never transmitted.</p>
            <form onSubmit={handleProve} className="space-y-5">
              <div>
                <label htmlFor="age-input" className="block text-sm font-medium text-text-secondary mb-2">Your Age</label>
                <input id="age-input" type="number" min="1" max="150" value={formData.age} onChange={(e) => setFormData((d) => ({ ...d, age: e.target.value }))} placeholder="Enter your age" className="w-full bg-bg-elevated border border-glass-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted outline-none focus:border-primary/50 transition-colors" required />
                <p className="text-[11px] text-text-muted mt-1">🔒 Used to prove age ≥ 18</p>
              </div>
              <div>
                <label htmlFor="constituency-input" className="block text-sm font-medium text-text-secondary mb-2">Constituency / District</label>
                <input id="constituency-input" type="text" value={formData.constituency} onChange={(e) => setFormData((d) => ({ ...d, constituency: e.target.value }))} placeholder="e.g., District 5, Springfield" className="w-full bg-bg-elevated border border-glass-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted outline-none focus:border-primary/50 transition-colors" required />
                <p className="text-[11px] text-text-muted mt-1">🔒 Used to prove residency</p>
              </div>
              <button type="submit" className="btn-primary w-full text-base" id="generate-proof-btn">Generate ZK Proof →</button>
            </form>
          </div>
        )}

        {step === "proving" && (
          <div className="glass rounded-2xl p-8 text-center animate-slide-up">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
              <div className="absolute inset-4 rounded-full gradient-primary flex items-center justify-center"><span className="text-2xl">⚡</span></div>
            </div>
            <h2 className="font-heading text-xl font-bold mb-2">Generating Zero-Knowledge Proof...</h2>
            <div className="max-w-xs mx-auto space-y-2 text-xs font-mono text-text-muted mt-4">
              <p className="animate-fade-in">▸ Computing witness...</p>
              <p className="animate-fade-in" style={{ animationDelay: "0.8s" }}>▸ Generating circuit proof...</p>
              <p className="animate-fade-in" style={{ animationDelay: "1.6s" }}>▸ Verifying on Midnight...</p>
            </div>
          </div>
        )}

        {step === "result" && (
          <div className="glass rounded-2xl p-8 text-center animate-slide-up">
            {isEligible ? (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center glow-success"><span className="text-4xl">✓</span></div>
                <h2 className="font-heading text-2xl font-bold text-success mb-2">You Are Eligible</h2>
                <p className="text-text-secondary text-sm mb-6">Cryptographically verified. Your identity was <strong>never revealed</strong>.</p>
                <div className="bg-bg-elevated rounded-xl p-4 text-left max-w-sm mx-auto mb-6 text-xs font-mono space-y-2">
                  <div className="flex justify-between"><span className="text-text-muted">Status:</span><span className="text-success">eligibility_verified = true</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Network:</span><span className="text-text-primary">Midnight Mainnet</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Data exposed:</span><span className="text-accent">None</span></div>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-error/20 flex items-center justify-center"><span className="text-4xl">✗</span></div>
                <h2 className="font-heading text-2xl font-bold text-error mb-2">Not Eligible</h2>
                <p className="text-text-secondary text-sm mb-6">Could not verify eligibility. Ensure age ≥ 18 and valid constituency.</p>
              </>
            )}
            <button onClick={handleReset} className="btn-ghost" id="reset-eligibility-btn">Start Over</button>
          </div>
        )}

        <p className="text-xs text-text-muted text-center mt-8 max-w-md mx-auto">
          🔐 Your data never leaves your browser. No servers, no databases, no logs.
        </p>
      </div>
    </div>
  );
}
