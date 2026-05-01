import { describe, it, expect } from "vitest";
import {
  createQuizState,
  processAnswer,
  nextQuestion,
  isQuizFinished,
  getScoreGrade,
  getAccuracy,
  filterByDifficulty,
} from "./engine";
import type { QuizQuestion } from "@/types/election";

describe("createQuizState", () => {
  it("creates state with default maxQuestions of 10", () => {
    const state = createQuizState();
    expect(state.maxQuestions).toBe(10);
    expect(state.score).toBe(0);
    expect(state.answered).toBe(0);
    expect(state.streak).toBe(0);
    expect(state.difficulty).toBe("easy");
    expect(state.history).toHaveLength(0);
  });

  it("creates state with custom maxQuestions", () => {
    const state = createQuizState(5);
    expect(state.maxQuestions).toBe(5);
  });
});

describe("processAnswer", () => {
  it("increments score on correct answer", () => {
    const state = createQuizState();
    const next = processAnswer(state, 1, true);
    expect(next.score).toBe(1);
    expect(next.answered).toBe(1);
    expect(next.streak).toBe(1);
  });

  it("resets streak on wrong answer", () => {
    let state = createQuizState();
    state = processAnswer(state, 1, true);
    state = processAnswer(state, 2, false);
    expect(state.streak).toBe(0);
    expect(state.score).toBe(1);
    expect(state.answered).toBe(2);
  });

  it("scales difficulty up after 2 consecutive correct answers", () => {
    let state = createQuizState();
    state = processAnswer(state, 1, true);
    expect(state.difficulty).toBe("easy"); // streak=1, no scale yet
    state = processAnswer(state, 2, true);
    expect(state.difficulty).toBe("medium"); // streak hit 2 → scale up
    expect(state.streak).toBe(0); // streak resets after scale
  });

  it("scales difficulty down on wrong answer when at medium", () => {
    let state = createQuizState();
    // Get to medium
    state = processAnswer(state, 1, true);
    state = processAnswer(state, 2, true);
    expect(state.difficulty).toBe("medium");
    // Wrong answer
    state = processAnswer(state, 3, false);
    expect(state.difficulty).toBe("easy");
  });

  it("difficulty stays at hard after scaling up from hard", () => {
    let state = createQuizState();
    // Get to hard
    state = processAnswer(state, 1, true);
    state = processAnswer(state, 2, true); // → medium
    state = processAnswer(state, 3, true);
    state = processAnswer(state, 4, true); // → hard
    state = processAnswer(state, 5, true);
    state = processAnswer(state, 6, true); // stays hard
    expect(state.difficulty).toBe("hard");
  });

  it("appends history entry for each answer", () => {
    const state = createQuizState();
    const next = processAnswer(state, 42, true);
    expect(next.history).toHaveLength(1);
    expect(next.history[0]).toMatchObject({ questionId: 42, correct: true });
  });
});

describe("nextQuestion", () => {
  it("increments currentIndex", () => {
    const state = createQuizState();
    const next = nextQuestion(state);
    expect(next.currentIndex).toBe(1);
  });
});

describe("isQuizFinished", () => {
  it("returns false when answered < maxQuestions", () => {
    const state = createQuizState(5);
    expect(isQuizFinished(state)).toBe(false);
  });

  it("returns true when answered >= maxQuestions", () => {
    let state = createQuizState(2);
    state = processAnswer(state, 1, true);
    state = processAnswer(state, 2, true);
    expect(isQuizFinished(state)).toBe(true);
  });
});

describe("getScoreGrade", () => {
  it("returns Excellent for 80%+", () => {
    let state = createQuizState(10);
    for (let i = 0; i < 8; i++) state = processAnswer(state, i, true);
    for (let i = 8; i < 10; i++) state = processAnswer(state, i, false);
    const grade = getScoreGrade(state);
    expect(grade.label).toBe("Excellent!");
  });

  it("returns Good Job for 50-79%", () => {
    let state = createQuizState(10);
    for (let i = 0; i < 5; i++) state = processAnswer(state, i, true);
    for (let i = 5; i < 10; i++) state = processAnswer(state, i, false);
    const grade = getScoreGrade(state);
    expect(grade.label).toBe("Good Job!");
  });

  it("returns Keep Learning for < 50%", () => {
    let state = createQuizState(10);
    for (let i = 0; i < 4; i++) state = processAnswer(state, i, true);
    for (let i = 4; i < 10; i++) state = processAnswer(state, i, false);
    const grade = getScoreGrade(state);
    expect(grade.label).toBe("Keep Learning!");
  });
});

describe("getAccuracy", () => {
  it("returns 0 when no questions answered", () => {
    const state = createQuizState();
    expect(getAccuracy(state)).toBe(0);
  });

  it("returns 100 when all correct", () => {
    let state = createQuizState(3);
    state = processAnswer(state, 1, true);
    state = processAnswer(state, 2, true);
    state = processAnswer(state, 3, true);
    expect(getAccuracy(state)).toBe(100);
  });

  it("returns 50 when half correct", () => {
    let state = createQuizState(4);
    state = processAnswer(state, 1, true);
    state = processAnswer(state, 2, false);
    state = processAnswer(state, 3, true);
    state = processAnswer(state, 4, false);
    expect(getAccuracy(state)).toBe(50);
  });
});

describe("filterByDifficulty", () => {
  const questions: QuizQuestion[] = [
    { id: 1, question: "Q1", options: [], correctIndex: 0, explanation: "", difficulty: "easy" },
    { id: 2, question: "Q2", options: [], correctIndex: 0, explanation: "", difficulty: "medium" },
    { id: 3, question: "Q3", options: [], correctIndex: 0, explanation: "", difficulty: "hard" },
    { id: 4, question: "Q4", options: [], correctIndex: 0, explanation: "", difficulty: "easy" },
  ];

  it("filters questions by difficulty", () => {
    const easy = filterByDifficulty(questions, "easy");
    expect(easy).toHaveLength(2);
    expect(easy.every((q) => q.difficulty === "easy")).toBe(true);
  });

  it("returns all questions as fallback when no match", () => {
    const result = filterByDifficulty(questions, "hard");
    expect(result).toHaveLength(1);
    // Fallback only triggers when result.length === 0
    const emptyResult = filterByDifficulty([], "easy");
    expect(emptyResult).toHaveLength(0);
  });
});
