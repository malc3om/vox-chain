"use client";

import { useState, useCallback, useEffect } from "react";
import { saveQuizResult } from "@/lib/firebase";

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
  source: string;
}

const questionBank: Question[] = [
  { id: 1, text: "How many electoral votes are needed to win the US presidency?", options: ["218", "270", "300", "538"], correct: 1, difficulty: "easy", explanation: "A candidate needs 270 out of 538 total electoral votes to win. The number 538 = 435 House members + 100 Senators + 3 for D.C.", source: "archives.gov" },
  { id: 2, text: "What is the minimum voting age in the United States?", options: ["16", "17", "18", "21"], correct: 2, difficulty: "easy", explanation: "The 26th Amendment, ratified in 1971, lowered the voting age from 21 to 18 for all federal and state elections.", source: "constitution.congress.gov" },
  { id: 3, text: "Which amendment granted women the right to vote?", options: ["15th", "19th", "21st", "26th"], correct: 1, difficulty: "easy", explanation: "The 19th Amendment was ratified on August 18, 1920, prohibiting the denial of the right to vote based on sex.", source: "archives.gov" },
  { id: 4, text: "What does a zero-knowledge proof allow you to do?", options: ["Encrypt your vote", "Prove a fact without revealing the underlying data", "Hide your IP address", "Create anonymous accounts"], correct: 1, difficulty: "medium", explanation: "ZK proofs let you prove something is true (e.g., 'I am 18+') without revealing the actual data (your birthdate). This is the foundation of privacy-preserving verification.", source: "midnight.network" },
  { id: 5, text: "How often are US presidential elections held?", options: ["Every 2 years", "Every 4 years", "Every 5 years", "Every 6 years"], correct: 1, difficulty: "easy", explanation: "Presidential elections are held every four years, on the first Tuesday after the first Monday in November.", source: "usa.gov" },
  { id: 6, text: "What is a 'nullifier' in blockchain voting?", options: ["A vote cancellation tool", "A cryptographic value that prevents double-voting", "A type of ballot", "A voter ID number"], correct: 1, difficulty: "hard", explanation: "A nullifier is a unique cryptographic value derived from a voter's private key. Once published on-chain, it prevents that voter from voting again — without revealing who they are.", source: "midnight.network" },
  { id: 7, text: "Which branch of government is responsible for counting electoral votes?", options: ["Executive", "Judicial", "Legislative (Congress)", "Federal Election Commission"], correct: 2, difficulty: "medium", explanation: "Congress counts electoral votes in a joint session on January 6th following the presidential election.", source: "archives.gov" },
  { id: 8, text: "What is the Compact language used for on Midnight Network?", options: ["Writing emails", "Creating websites", "Writing ZK smart contracts", "Database queries"], correct: 2, difficulty: "medium", explanation: "Compact is Midnight's TypeScript-based DSL for writing smart contracts that compile to zero-knowledge circuits.", source: "docs.midnight.network" },
  { id: 9, text: "What does 'selective disclosure' mean in privacy tech?", options: ["Choosing which social media to use", "Revealing only specific attributes without exposing full identity", "Selecting which news to read", "Choosing privacy settings"], correct: 1, difficulty: "hard", explanation: "Selective disclosure allows you to share only the minimum necessary information. For example, proving you're over 18 without revealing your exact age or birthdate.", source: "midnight.network" },
  { id: 10, text: "How many US Senators does each state have?", options: ["1", "2", "Varies by population", "4"], correct: 1, difficulty: "easy", explanation: "Each state has exactly 2 Senators, regardless of population. This was established by the Great Compromise at the Constitutional Convention.", source: "senate.gov" },
  { id: 11, text: "What is the role of poll watchers?", options: ["Count votes", "Observe the voting process for fairness", "Help voters fill ballots", "Guard polling stations"], correct: 1, difficulty: "medium", explanation: "Poll watchers are authorized representatives who observe the voting and counting process to ensure it is conducted fairly and according to law.", source: "eac.gov" },
  { id: 12, text: "What token does Midnight Network use for transaction fees?", options: ["ETH", "NIGHT/DUST", "ADA", "SOL"], correct: 1, difficulty: "hard", explanation: "Midnight uses NIGHT as its utility token, which generates DUST — the gas token used to pay for transactions on the network.", source: "midnight.network" },
];

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);

  const getFilteredQuestions = useCallback(() => {
    return questionBank.filter((q) => q.difficulty === difficulty);
  }, [difficulty]);

  const currentQuestion = started ? getFilteredQuestions()[currentIndex % getFilteredQuestions().length] : null;

  function handleAnswer(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    setShowExplanation(true);
    setAnswered((a) => a + 1);

    if (currentQuestion && optionIndex === currentQuestion.correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      if (streak >= 2 && difficulty === "easy") setDifficulty("medium");
      if (streak >= 2 && difficulty === "medium") setDifficulty("hard");
    } else {
      setStreak(0);
      if (difficulty === "hard") setDifficulty("medium");
      if (difficulty === "medium") setDifficulty("easy");
    }
  }

  function handleNext() {
    if (answered >= 10) { setFinished(true); return; }
    setSelected(null);
    setShowExplanation(false);
    setCurrentIndex((i) => i + 1);
  }

  function handleRestart() {
    setStarted(false); setCurrentIndex(0); setSelected(null);
    setShowExplanation(false); setScore(0); setAnswered(0);
    setDifficulty("easy"); setFinished(false); setStreak(0);
  }

  const difficultyColor = { easy: "text-success", medium: "text-accent-warm", hard: "text-accent" };

  // Persist final result to Firebase when quiz completes
  useEffect(() => {
    if (finished) {
      const grade = score >= 8 ? "Excellent!" : score >= 5 ? "Good Job!" : "Keep Learning!";
      saveQuizResult({
        score,
        totalQuestions: 10,
        accuracy: Math.round((score / 10) * 100),
        grade,
        sessionId: crypto.randomUUID(),
      });
    }
  }, [finished, score]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-[var(--spacing-page)]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-text-secondary mb-4">
            <span className="text-accent-warm">△</span> AI-Adaptive Quiz
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold">
            Civic <span className="gradient-text">Knowledge</span> Quiz
          </h1>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">
            Test what you know. Difficulty adapts based on your answers.
          </p>
        </div>

        {!started && !finished && (
          <div className="glass rounded-2xl p-8 text-center animate-slide-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent-warm to-accent flex items-center justify-center text-4xl">🎓</div>
            <h2 className="font-heading text-2xl font-bold mb-3">Ready to Test Your Knowledge?</h2>
            <p className="text-text-secondary text-sm mb-2">10 questions • Adaptive difficulty • Instant explanations</p>
            <p className="text-text-muted text-xs mb-6">Wrong answers trigger AI explanations to help you learn.</p>
            <button onClick={() => setStarted(true)} className="btn-primary text-base" id="start-quiz-btn">Start Quiz →</button>
          </div>
        )}

        {started && !finished && currentQuestion && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-text-muted">Question {answered + 1} of 10</span>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium ${difficultyColor[difficulty]}`}>{difficulty.toUpperCase()}</span>
                <span className="text-sm font-mono text-primary">{score}/{answered}</span>
              </div>
            </div>
            <div className="progress-bar mb-6"><div className="progress-bar-fill" style={{ width: `${(answered / 10) * 100}%` }} /></div>

            <div className="glass rounded-2xl p-6 mb-4">
              <h2 className="font-heading text-xl font-semibold mb-6">{currentQuestion.text}</h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option, i) => {
                  const isCorrect = i === currentQuestion.correct;
                  const isSelected = i === selected;
                  let borderClass = "border-glass-border hover:border-primary/40";
                  if (selected !== null) {
                    if (isCorrect) borderClass = "border-success bg-success/10";
                    else if (isSelected) borderClass = "border-error bg-error/10";
                    else borderClass = "border-glass-border opacity-50";
                  }
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={selected !== null}
                      className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${borderClass} ${selected === null ? "cursor-pointer card-hover" : "cursor-default"}`}
                      id={`quiz-option-${i}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${isCorrect && selected !== null ? "bg-success border-success text-white" : isSelected && !isCorrect ? "bg-error border-error text-white" : "border-text-muted text-text-muted"}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {showExplanation && (
              <div className="glass rounded-2xl p-5 animate-slide-up mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-sm shrink-0">V</div>
                  <div>
                    <p className="text-sm text-text-primary leading-relaxed">{currentQuestion.explanation}</p>
                    <p className="text-[11px] text-text-muted mt-2">📚 Source: {currentQuestion.source}</p>
                  </div>
                </div>
              </div>
            )}

            {selected !== null && (
              <button onClick={handleNext} className="btn-primary w-full" id="quiz-next-btn">
                {answered >= 10 ? "See Results" : "Next Question →"}
              </button>
            )}
          </div>
        )}

        {finished && (
          <div className="glass rounded-2xl p-8 text-center animate-slide-up">
            <div className="text-6xl mb-4">{score >= 8 ? "🏆" : score >= 5 ? "⭐" : "📚"}</div>
            <h2 className="font-heading text-3xl font-bold mb-2">
              {score >= 8 ? "Excellent!" : score >= 5 ? "Good Job!" : "Keep Learning!"}
            </h2>
            <p className="text-4xl font-heading font-bold gradient-text mb-2">{score}/10</p>
            <p className="text-text-secondary text-sm mb-6">
              {score >= 8 ? "You have a strong understanding of civic processes." : score >= 5 ? "Solid foundation — review the explanations to improve." : "Try the AI chat to learn more about the topics you missed."}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleRestart} className="btn-primary" id="quiz-restart-btn">Try Again</button>
              <a href="/ask" className="btn-ghost">Ask AI to Explain</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
