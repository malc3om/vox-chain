/**
 * Firebase Integration for VoxChain
 *
 * Provides Firestore persistence for:
 * - Quiz scores and session history
 * - Anonymized eligibility verification events
 * - Analytics tracking for civic engagement metrics
 * - Firebase Auth (Google Sign-In) for Calendar API access
 * - Firebase Remote Config for adaptive quiz parameters
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  type Auth,
  type UserCredential,
} from "firebase/auth";
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
  type RemoteConfig,
} from "firebase/remote-config";

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

// ── Firebase Authentication (Google Sign-In) ────────────

const googleProvider = new GoogleAuthProvider();
// Request Calendar API scope for adding election reminders
// googleProvider.addScope("https://www.googleapis.com/auth/calendar.events");

/** Get the Firebase Auth instance. */
export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

/**
 * Sign in with Google using Firebase Auth popup.
 * Returns the UserCredential on success, null on failure.
 */
export async function signInWithGoogle(): Promise<UserCredential | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const auth = getFirebaseAuth();
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (err) {
    console.warn("[VoxChain] Google Sign-In failed:", err);
    return null;
  }
}

/**
 * Sign out the currently authenticated user.
 */
export async function signOutUser(): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    await signOut(auth);
  } catch (err) {
    console.warn("[VoxChain] Sign-out failed:", err);
  }
}

/**
 * Get the Google OAuth access token from the current user's credential.
 * Returns null if no user is signed in.
 */
export async function getGoogleAccessToken(): Promise<string | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (!user) return null;
    const token = await user.getIdToken();
    return token;
  } catch {
    return null;
  }
}

// ── Firebase Remote Config ──────────────────────────────

let remoteConfigInstance: RemoteConfig | null = null;
let remoteConfigInitialized = false;

const REMOTE_CONFIG_DEFAULTS: Record<string, string> = {
  quiz_max_questions: "10",
  quiz_difficulty_ceiling: "5",
};

/**
 * Initialize Firebase Remote Config with defaults.
 * Only fetches once per session; subsequent calls return the cached instance.
 */
async function initRemoteConfig(): Promise<RemoteConfig | null> {
  if (typeof window === "undefined") return null;
  if (!isFirebaseConfigured()) return null;
  if (remoteConfigInitialized && remoteConfigInstance) return remoteConfigInstance;

  try {
    const app = getFirebaseApp();
    remoteConfigInstance = getRemoteConfig(app);
    remoteConfigInstance.settings.minimumFetchIntervalMillis = 3600000; // 1 hour
    remoteConfigInstance.defaultConfig = REMOTE_CONFIG_DEFAULTS;
    await fetchAndActivate(remoteConfigInstance);
    remoteConfigInitialized = true;
    return remoteConfigInstance;
  } catch (err) {
    console.warn("[VoxChain] Remote Config initialization failed:", err);
    return null;
  }
}

/**
 * Get a Remote Config value. Returns the fallback if Remote Config
 * is unavailable or the key doesn't exist.
 */
export async function getRemoteConfigValue(
  key: string,
  fallback: string
): Promise<string> {
  try {
    const config = await initRemoteConfig();
    if (!config) return fallback;
    const value = getValue(config, key);
    return value.asString() || fallback;
  } catch {
    return fallback;
  }
}

