/**
 * Firebase Integration for VoxChain
 *
 * Provides Firestore persistence for:
 * - Quiz scores and session history
 * - Anonymized eligibility verification events
 * - Analytics tracking for civic engagement metrics
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "voxchain-civic",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

/** Lazily initialize Firebase app (safe for Next.js hot reload). */
function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) return getApps()[0]!;
  return initializeApp(firebaseConfig);
}

/** Get the Firestore database instance. */
export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

/** Returns true when Firebase credentials are configured. */
export function isFirebaseConfigured(): boolean {
  return firebaseConfig.apiKey.length > 0;
}

// ── Data models ─────────────────────────────────────────────

export interface QuizResult {
  score: number;
  totalQuestions: number;
  accuracy: number;
  grade: string;
  sessionId: string;
  completedAt: ReturnType<typeof serverTimestamp>;
}

export interface VerificationEvent {
  /** Anonymized — no PII stored. */
  eligible: boolean;
  proofGenerated: boolean;
  sessionId: string;
  timestamp: ReturnType<typeof serverTimestamp>;
}

export interface ChatSession {
  questionsAsked: number;
  source: "gemini" | "fallback";
  sessionId: string;
  timestamp: ReturnType<typeof serverTimestamp>;
}

// ── Write helpers ─────────────────────────────────────────────

/**
 * Persist a completed quiz result to Firestore.
 * Silently no-ops if Firebase is not configured.
 */
export async function saveQuizResult(
  result: Omit<QuizResult, "completedAt">
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  try {
    const db = getDb();
    await addDoc(collection(db, "quiz_results"), {
      ...result,
      completedAt: serverTimestamp(),
    });
  } catch (err) {
    // Non-fatal: analytics failure should not break the quiz experience
    console.warn("[VoxChain] Failed to save quiz result:", err);
  }
}

/**
 * Log an anonymized eligibility verification event.
 * No PII is ever stored — only boolean outcome + session ID.
 */
export async function logVerificationEvent(
  event: Omit<VerificationEvent, "timestamp">
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  try {
    const db = getDb();
    await addDoc(collection(db, "verifications"), {
      ...event,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn("[VoxChain] Failed to log verification event:", err);
  }
}

/**
 * Log a chat session summary for engagement analytics.
 */
export async function logChatSession(
  session: Omit<ChatSession, "timestamp">
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  try {
    const db = getDb();
    await addDoc(collection(db, "chat_sessions"), {
      ...session,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn("[VoxChain] Failed to log chat session:", err);
  }
}
