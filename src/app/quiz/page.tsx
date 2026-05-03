"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Check, X, ArrowRight, Award, RotateCcw, ShieldCheck } from "lucide-react";
import { callCircuit, findDeployedContract } from "@/lib/midnight/contracts";
import { isWalletAvailable, connectWallet } from "@/lib/midnight/wallet";


interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "What is the deadline for voter registration in the 2026 General Election?",
    options: ["October 5, 2026", "November 3, 2026", "October 31, 2026", "September 1, 2026"],
    correct: 0,
    explanation: "Voter registration usually ends 30 days before the election. For 2026, it is October 5."
  },
  {
    id: 2,
    text: "How many Electoral College votes are needed to win the US Presidency?",
    options: ["538", "270", "100", "435"],
    correct: 1,
    explanation: "A majority of the 538 electoral votes (270) is required to win."
  },
  {
    id: 3,
    text: "What technology does VoxChain use to protect voter privacy?",
    options: ["Public Databases", "Zero-Knowledge Proofs", "Facial Recognition", "Email Verification"],
    correct: 1,
    explanation: "VoxChain uses ZK proofs to verify eligibility without revealing personal data."
  },
  {
    id: 4,
    text: "When does Early Voting end for the 2026 election cycle?",
    options: ["November 3", "October 27", "October 31", "November 1"],
    correct: 2,
    explanation: "Early voting runs until October 31, allowing citizens to vote before Election Day."
  }
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isProving, setIsProving] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(containerRef.current, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }
    );
  }, []);

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    const correct = index === QUIZ_QUESTIONS[currentQuestion].correct;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);

    gsap.fromTo(".explanation-box", 
      { opacity: 0, height: 0 }, 
      { opacity: 1, height: "auto", duration: 0.5, ease: "power2.out" }
    );
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      gsap.to(cardRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.3,
        onComplete: () => {
          setCurrentQuestion(prev => prev + 1);
          setSelectedOption(null);
          setIsCorrect(null);
          gsap.fromTo(cardRef.current, 
            { opacity: 0, x: 20 }, 
            { opacity: 1, x: 0, duration: 0.4, ease: "back.out(1.2)" }
          );
        }
      });
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setIsFinished(false);
  };

  const handleZKVerify = async () => {
    setIsProving(true);
    try {
      if (!isWalletAvailable()) {
        alert("Lace Midnight wallet not found. Please install it to verify scores.");
        setIsProving(false);
        return;
      }
      
      await connectWallet();
      const contractAddress = await findDeployedContract("QuizVerifier") || "mid1_quiz_sim";
      
      const result = await callCircuit(contractAddress, "verifyScore", [score]);
      
      if (result.success) {
        alert(`ZK Proof Generated! Your score of ${score} has been verified.\nTX: ${result.transactionHash}`);
      } else {
        alert("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("ZK Verification error:", err);
      alert("Verification failed. The proof server might be offline.");
    } finally {

      setIsProving(false);
    }
  };


  return (
    <div className="min-h-screen pt-24 pb-16 px-[var(--spacing-page)]" ref={containerRef}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-text-secondary mb-4">
            <span className="text-accent">★</span> Civic Knowledge Challenge
          </div>
          <h1 className="font-heading text-4xl font-bold">
            Test Your <span className="gradient-text">Civic IQ</span>
          </h1>
        </div>

        {!isFinished ? (
          <div className="glass rounded-2xl p-8 relative overflow-hidden" ref={cardRef}>
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-mono text-text-muted">QUESTION {currentQuestion + 1} OF {QUIZ_QUESTIONS.length}</span>
              <div className="h-1 w-32 bg-bg-elevated rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-500" 
                  style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-xl font-medium mb-8 leading-relaxed">
              {QUIZ_QUESTIONS[currentQuestion].text}
            </h2>

            <div className="space-y-3">
              {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrectOption = index === QUIZ_QUESTIONS[currentQuestion].correct;
                
                let borderColor = "border-glass-border";
                let bgColor = "bg-bg-elevated";
                let icon = null;

                if (selectedOption !== null) {
                  if (isCorrectOption) {
                    borderColor = "border-success/50";
                    bgColor = "bg-success/5";
                    icon = <Check size={16} className="text-success" />;
                  } else if (isSelected) {
                    borderColor = "border-error/50";
                    bgColor = "bg-error/5";
                    icon = <X size={16} className="text-error" />;
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${borderColor} ${bgColor} ${selectedOption === null ? "hover:border-accent/30 hover:bg-white/[0.02]" : ""}`}
                  >
                    <span>{option}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className="explanation-box mt-8 p-4 bg-accent/5 border border-accent/20 rounded-xl animate-fade-in">
                <p className="text-sm text-text-secondary leading-relaxed">
                  <span className="font-bold text-accent mr-2">{isCorrect ? "Correct!" : "Actually..."}</span>
                  {QUIZ_QUESTIONS[currentQuestion].explanation}
                </p>
                <button 
                  onClick={handleNext}
                  className="mt-4 flex items-center gap-2 text-accent text-sm font-medium hover:gap-3 transition-all"
                >
                  {currentQuestion < QUIZ_QUESTIONS.length - 1 ? "Next Question" : "See Results"} <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="glass rounded-2xl p-10 text-center animate-slide-up">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center text-5xl glow-accent">
              <Award size={48} className="text-accent" />
            </div>
            <h2 className="font-heading text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-text-secondary mb-8">You scored <span className="text-accent font-bold">{score}</span> out of {QUIZ_QUESTIONS.length}</p>
            
            <div className="bg-bg-elevated rounded-2xl p-6 mb-8 text-left border border-glass-border">
              <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                <ShieldCheck size={16} className="text-accent" /> ZK-Verified High Score
              </h3>
              <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                Prove you achieved this score without revealing which questions you answered or your account identity. Only the ZK proof is recorded.
              </p>
              <button 
                onClick={handleZKVerify}
                disabled={isProving}
                className="w-full btn-primary py-3 text-sm"
              >
                {isProving ? "Generating Proof..." : "Verify Score on Midnight →"}
              </button>
            </div>

            <div className="flex gap-4">
              <button onClick={handleReset} className="flex-1 btn-ghost py-3 flex items-center justify-center gap-2">
                <RotateCcw size={16} /> Try Again
              </button>
              <button onClick={() => window.location.href = "/ask"} className="flex-1 btn-primary py-3">
                Ask VoxChain →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
