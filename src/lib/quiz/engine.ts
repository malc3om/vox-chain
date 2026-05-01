/**
 * Adaptive Quiz Engine
 * 
 * Manages quiz state, difficulty scaling, and score tracking.
 * Difficulty adjusts based on streak and overall accuracy.
 */

import type { QuizQuestion } from "@/types/election";

export type Difficulty = "easy" | "medium" | "hard";

export interface QuizState {
  currentIndex: number;
  score: number;
  answered: number;
  streak: number;
  difficulty: Difficulty;
  maxQuestions: number;
  history: {
    questionId: number;
    correct: boolean;
    difficulty: Difficulty;
  }[];
}

/**
 * Create a new quiz state.
 */
export function createQuizState(maxQuestions = 10): QuizState {
  return {
    currentIndex: 0,
    score: 0,
    answered: 0,
    streak: 0,
    difficulty: "easy",
    maxQuestions,
    history: [],
  };
}

/**
 * Process an answer and update the quiz state.
 * Returns the updated state.
 */
export function processAnswer(
  state: QuizState,
  questionId: number,
  isCorrect: boolean
): QuizState {
  const newState = { ...state };

  newState.answered += 1;
  newState.history = [
    ...state.history,
    { questionId, correct: isCorrect, difficulty: state.difficulty },
  ];

  if (isCorrect) {
    newState.score += 1;
    newState.streak += 1;

    // Scale up difficulty after 2 consecutive correct answers
    if (newState.streak >= 2) {
      newState.difficulty = scaleDifficultyUp(state.difficulty);
      newState.streak = 0; // Reset streak after scaling
    }
  } else {
    newState.streak = 0;

    // Scale down difficulty on wrong answer
    newState.difficulty = scaleDifficultyDown(state.difficulty);
  }

  return newState;
}

/**
 * Advance to the next question.
 */
export function nextQuestion(state: QuizState): QuizState {
  return {
    ...state,
    currentIndex: state.currentIndex + 1,
  };
}

/**
 * Check if the quiz is finished.
 */
export function isQuizFinished(state: QuizState): boolean {
  return state.answered >= state.maxQuestions;
}

/**
 * Get the score grade.
 */
export function getScoreGrade(state: QuizState): {
  emoji: string;
  label: string;
  message: string;
} {
  const percentage = (state.score / state.maxQuestions) * 100;

  if (percentage >= 80) {
    return {
      emoji: "🏆",
      label: "Excellent!",
      message: "You have a strong understanding of civic processes.",
    };
  }
  if (percentage >= 50) {
    return {
      emoji: "⭐",
      label: "Good Job!",
      message: "Solid foundation — review the explanations to improve.",
    };
  }
  return {
    emoji: "📚",
    label: "Keep Learning!",
    message: "Try the AI chat to learn more about the topics you missed.",
  };
}

/**
 * Filter questions by current difficulty.
 */
export function filterByDifficulty(
  questions: QuizQuestion[],
  difficulty: Difficulty
): QuizQuestion[] {
  const filtered = questions.filter((q) => q.difficulty === difficulty);
  // Fallback to all questions if no match for current difficulty
  return filtered.length > 0 ? filtered : questions;
}

/**
 * Get quiz accuracy percentage.
 */
export function getAccuracy(state: QuizState): number {
  if (state.answered === 0) return 0;
  return Math.round((state.score / state.answered) * 100);
}

// ── Private helpers ──────────────────

function scaleDifficultyUp(current: Difficulty): Difficulty {
  switch (current) {
    case "easy":
      return "medium";
    case "medium":
      return "hard";
    case "hard":
      return "hard";
  }
}

function scaleDifficultyDown(current: Difficulty): Difficulty {
  switch (current) {
    case "hard":
      return "medium";
    case "medium":
      return "easy";
    case "easy":
      return "easy";
  }
}
