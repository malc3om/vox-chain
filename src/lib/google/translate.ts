/**
 * Google Cloud Translation API v2 Wrapper
 *
 * Provides translation capabilities with Firestore caching.
 * Silently degrades to returning original text when API key is missing.
 */

import { getDb, isFirebaseConfigured } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { askGemini, isGeminiConfigured } from "@/lib/ai/gemini";

const TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY ?? "";
const TRANSLATE_ENDPOINT =
  "https://translation.googleapis.com/language/translate/v2";

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
  cached: boolean;
}

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "fr", label: "French", native: "Français" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "pt", label: "Portuguese", native: "Português" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

/** Returns true when a Translation API key is configured. */
export function isTranslateConfigured(): boolean {
  return TRANSLATE_API_KEY.length > 0;
}

/**
 * Generate a simple hash for cache keys.
 * Uses a basic FNV-1a-inspired hash — no crypto needed for cache keys.
 */
function hashText(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

/**
 * Look up a cached translation in Firestore.
 * Returns null on cache miss or if Firebase is not configured.
 */
export async function getCachedTranslation(
  text: string,
  lang: string
): Promise<string | null> {
  if (!isFirebaseConfigured()) return null;
  try {
    const db = getDb();
    const hash = hashText(text);
    const docRef = doc(collection(db, "translations", lang, "entries"), hash);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return (data.translated as string) ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Store a translation in the Firestore cache.
 * Silently no-ops if Firebase is not configured.
 */
export async function cacheTranslation(
  text: string,
  lang: string,
  result: string
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  try {
    const db = getDb();
    const hash = hashText(text);
    const docRef = doc(collection(db, "translations", lang, "entries"), hash);
    await setDoc(docRef, {
      original: text.slice(0, 500), // Truncate long texts for storage
      translated: result,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("[VoxChain] Failed to cache translation:", err);
  }
}

/**
 * Translate text using Google Cloud Translation API v2.
 *
 * Checks Firestore cache first. Falls back to original text
 * if the API key is missing or an error occurs.
 */
export async function translateText(
  text: string,
  targetLang: string
): Promise<TranslationResult> {
  // No-op for English
  if (targetLang === "en") {
    return { translatedText: text, cached: false };
  }

  // Check cache first
  const cached = await getCachedTranslation(text, targetLang);
  if (cached) {
    return { translatedText: cached, cached: true };
  }

  // No API key — fallback to Gemini or return original
  if (!isTranslateConfigured()) {
    if (isGeminiConfigured()) {
      try {
        const prompt = `Translate the following text to language code "${targetLang}". Return ONLY the raw translated text, no markdown, no quotes, no conversational filler:\n\n${text}`;
        const translated = await askGemini(prompt);
        // Cache the result (non-blocking)
        cacheTranslation(text, targetLang, translated);
        return { translatedText: translated, cached: false };
      } catch (err) {
        console.warn("[VoxChain] Gemini translation fallback failed:", err);
      }
    }
    return { translatedText: text, cached: false };
  }

  try {
    const response = await fetch(
      `${TRANSLATE_ENDPOINT}?key=${TRANSLATE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          source: "en",
          format: "text",
        }),
      }
    );

    if (!response.ok) {
      console.warn("[VoxChain] Translation API error:", response.status);
      return { translatedText: text, cached: false };
    }

    const data = await response.json();
    const translated: string =
      data?.data?.translations?.[0]?.translatedText ?? text;

    // Cache the result (non-blocking)
    cacheTranslation(text, targetLang, translated);

    return {
      translatedText: translated,
      detectedSourceLanguage:
        data?.data?.translations?.[0]?.detectedSourceLanguage,
      cached: false,
    };
  } catch (err) {
    console.warn("[VoxChain] Translation failed:", err);
    return { translatedText: text, cached: false };
  }
}
