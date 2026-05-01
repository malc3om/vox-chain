/**
 * Election Data Types
 */

export type PhaseStatus = "completed" | "active" | "upcoming";

export interface ElectionPhase {
  id: number;
  name: string;
  status: PhaseStatus;
  dateRange: string;
  description: string;
  details: string[];
  icon: string;
  onChainTx?: string;
}

export interface EligibilityResult {
  eligible: boolean;
  proofHash: string;
  network: string;
  timestamp: Date;
  dataExposed: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correct: number;
  difficulty: "easy" | "medium" | "hard";
  explanation: string;
  source: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}
