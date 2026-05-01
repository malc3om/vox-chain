"use client";

import { useState, useEffect, memo } from "react";
import { buildElectionEvent, getCalendarUrl, createCalendarEvent } from "@/lib/google/calendar";
import { getFirebaseAuth } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import type { ElectionPhase } from "@/types/election";

const electionPhases: ElectionPhase[] = [
  {
    id: 1,
    name: "Voter Registration",
    status: "completed",
    dateRange: "Jan 15 — Mar 1, 2026",
    description:
      "Citizens register to vote. Deadline enforcement is immutable on-chain.",
    details: [
      "Online registration opens via state portals",
      "Mail-in registration forms accepted",
      "Deadline stored as Compact contract state",
      "Registration status verifiable via ZK proof",
    ],
    icon: "📝",
    onChainTx: "0x7a3f...e91b",
  },
  {
    id: 2,
    name: "Campaign Period",
    status: "completed",
    dateRange: "Mar 2 — Oct 15, 2026",
    description:
      "Candidates campaign. Spending records are anchored on Midnight for transparency.",
    details: [
      "Candidate declarations filed on-chain",
      "Campaign finance reports anchored weekly",
      "Debate schedules published as contract events",
      "Public endorsements tracked transparently",
    ],
    icon: "📢",
    onChainTx: "0x4b2e...c83d",
  },
  {
    id: 3,
    name: "Early Voting",
    status: "active",
    dateRange: "Oct 16 — Nov 2, 2026",
    description:
      "Early voting window. Each ballot is privately verified — no double-voting possible.",
    details: [
      "In-person early voting at designated centers",
      "Mail-in ballots accepted and tracked",
      "Nullifiers prevent double-voting on-chain",
      "Voter privacy protected by ZK proofs",
    ],
    icon: "🗳️",
    onChainTx: "0x9c1d...f47a",
  },
  {
    id: 4,
    name: "Election Day",
    status: "upcoming",
    dateRange: "Nov 3, 2026",
    description:
      "Polls open nationwide. Final votes cast and verified in real-time.",
    details: [
      "Polls open 7:00 AM — 8:00 PM local time",
      "Real-time vote verification on Midnight",
      "Exit poll data anchored for auditability",
      "Emergency procedures documented on-chain",
    ],
    icon: "🏛️",
  },
  {
    id: 5,
    name: "Vote Counting",
    status: "upcoming",
    dateRange: "Nov 3 — Nov 10, 2026",
    description:
      "Tallies computed and verified. Cryptographic proofs ensure integrity.",
    details: [
      "Precinct-level counting begins",
      "Running tallies published as contract state",
      "Audit trails verifiable by any observer",
      "Mathematical proof of correct aggregation",
    ],
    icon: "📊",
  },
  {
    id: 6,
    name: "Results Certification",
    status: "upcoming",
    dateRange: "Nov 11 — Dec 1, 2026",
    description:
      "Final results certified. Immutable record stored on Midnight forever.",
    details: [
      "State-by-state certification process",
      "Final tallies anchored on Midnight ledger",
      "Contestation window documented on-chain",
      "Certified results become permanent record",
    ],
    icon: "✅",
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-success/20 text-success border-success/30";
    case "active":
      return "bg-primary/20 text-primary-light border-primary/30";
    case "upcoming":
      return "bg-bg-elevated text-text-muted border-glass-border";
    default:
      return "";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "completed":
      return "Completed ✓";
    case "active":
      return "In Progress";
    case "upcoming":
      return "Upcoming";
    default:
      return "";
  }
}

/** Calendar button for each phase */
function AddToCalendarButton({ phase }: { phase: ElectionPhase }) {
  const [status, setStatus] = useState<"idle" | "loading" | "added">("idle");
  const [googleUser, setGoogleUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setGoogleUser(user);
      });
      return () => unsubscribe();
    } catch {
      // Firebase not configured
    }
  }, []);

  async function handleAddToCalendar() {
    const event = buildElectionEvent({
      name: phase.name,
      dateRange: phase.dateRange,
      description: phase.description,
      details: phase.details,
    });

    // If signed in with Google, use Calendar API
    if (googleUser) {
      setStatus("loading");
      try {
        const token = await googleUser.getIdToken();
        const eventId = await createCalendarEvent(token, event);
        if (eventId) {
          setStatus("added");
          return;
        }
      } catch {
        // Fall through to URL method
      }
    }

    // Fallback: open Google Calendar URL in new tab
    const url = getCalendarUrl(event);
    window.open(url, "_blank", "noopener,noreferrer");
    setStatus("added");
  }

  if (status === "added") {
    return (
      <span className="text-xs text-success flex items-center gap-1">
        ✓ Added to Calendar
      </span>
    );
  }

  return (
    <button
      onClick={handleAddToCalendar}
      disabled={status === "loading"}
      className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all disabled:opacity-50"
      aria-label={`Add ${phase.name} to Google Calendar`}
    >
      📅 {status === "loading" ? "Adding..." : "Add to Calendar"}
    </button>
  );
}

export default function TimelinePage() {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(3);

  const activeIndex = electionPhases.findIndex((p) => p.status === "active");
  const progressPercent =
    ((activeIndex + 0.5) / electionPhases.length) * 100;

  return (
    <div className="min-h-screen pt-24 pb-16 px-[var(--spacing-page)]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-text-secondary mb-4">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse-glow" />
            On-Chain Election Tracker
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">
            Election <span className="gradient-text">Timeline</span>
          </h1>
          <p className="mt-3 text-text-secondary max-w-xl mx-auto">
            Each phase is stored as an immutable Compact smart contract state on
            Midnight. Click a phase to see details.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
              <span>Registration</span>
              <span>Certification</span>
            </div>
            <div className="progress-bar h-2 rounded-full">
              <div
                className="progress-bar-fill h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-text-muted">
                {activeIndex + 1} of {electionPhases.length} phases
              </span>
              <span className="text-xs text-primary font-medium">
                {Math.round(progressPercent)}% Complete
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-success via-primary to-bg-elevated" />

          <div className="flex flex-col gap-4">
            {electionPhases.map((phase, i) => {
              const isSelected = selectedPhase === phase.id;
              const isActive = phase.status === "active";

              return (
                <div
                  key={phase.id}
                  className="animate-slide-up relative"
                  style={{ animationDelay: `${0.15 + i * 0.08}s` }}
                >
                  {/* Node dot */}
                  <div
                    className={`absolute left-4 md:left-6 top-6 w-4 h-4 rounded-full border-2 z-10 transition-all
                      ${
                        phase.status === "completed"
                          ? "bg-success border-success"
                          : isActive
                            ? "bg-primary border-primary-light glow-primary"
                            : "bg-bg-deep border-text-muted"
                      }`}
                  />

                  {/* Card */}
                  <button
                    onClick={() =>
                      setSelectedPhase(isSelected ? null : phase.id)
                    }
                    className={`ml-14 md:ml-18 w-[calc(100%-3.5rem)] md:w-[calc(100%-4.5rem)] text-left glass rounded-2xl p-5 card-hover cursor-pointer transition-all
                      ${isSelected ? "glow-primary border-primary/30" : ""}
                      ${isActive ? "border-primary/20" : ""}
                    `}
                    id={`timeline-phase-${phase.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{phase.icon}</span>
                          <div>
                            <h3 className="font-heading font-semibold text-lg">
                              {phase.name}
                            </h3>
                            <p className="text-xs font-mono text-text-muted">
                              {phase.dateRange}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-text-secondary mt-1">
                          {phase.description}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(phase.status)}`}
                      >
                        {getStatusLabel(phase.status)}
                      </span>
                    </div>

                    {/* Expanded Details */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-glass-border animate-fade-in">
                        <ul className="space-y-2">
                          {phase.details.map((detail, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2 text-sm text-text-secondary"
                            >
                              <span className="text-primary mt-0.5">▸</span>
                              {detail}
                            </li>
                          ))}
                        </ul>

                        {/* Calendar + On-chain TX row */}
                        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                          <AddToCalendarButton phase={phase} />

                          {phase.onChainTx && (
                            <div className="flex items-center gap-2 text-xs font-mono">
                              <span className="text-text-muted">On-chain TX:</span>
                              <span className="text-secondary">
                                {phase.onChainTx}
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full bg-success" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contract Info */}
        <div
          className="mt-12 glass rounded-2xl p-6 animate-slide-up"
          style={{ animationDelay: "0.8s" }}
        >
          <h3 className="font-heading font-semibold text-sm text-text-muted uppercase tracking-wider mb-3">
            Smart Contract
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-text-muted">Contract:</span>
              <p className="font-mono text-secondary text-xs mt-1">
                ElectionTimeline.compact
              </p>
            </div>
            <div>
              <span className="text-text-muted">Network:</span>
              <p className="text-text-primary mt-1">Midnight Mainnet</p>
            </div>
            <div>
              <span className="text-text-muted">Last Updated:</span>
              <p className="text-text-primary mt-1">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
