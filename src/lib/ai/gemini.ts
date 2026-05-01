/**
 * Gemini AI Client for VoxChain
 *
 * Uses the official @google/generative-ai SDK for type-safe,
 * streaming AI responses. Falls back to a curated civic knowledge
 * base when no API key is configured.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { CIVIC_SYSTEM_PROMPT } from "./prompts";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
const GEMINI_MODEL = "gemini-2.0-flash";

/** Lazily initialized Gemini client (server-side only). */
function getClient(): GoogleGenerativeAI {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenerativeAI(GEMINI_API_KEY);
}

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

/** Safety settings applied to all requests. */
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/**
 * Returns true when the Gemini API key is present in the environment.
 */
export function isGeminiConfigured(): boolean {
  return GEMINI_API_KEY.length > 0;
}

/**
 * Send a message to Gemini and return a streaming ReadableStream<string>.
 * Each chunk yielded is a plain text delta (not raw JSON/SSE).
 */
export async function streamGeminiResponse(
  userMessage: string,
  history: GeminiMessage[] = []
): Promise<ReadableStream<string>> {
  const client = getClient();

  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: CIVIC_SYSTEM_PROMPT,
    safetySettings: SAFETY_SETTINGS,
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024, topP: 0.9 },
  });

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(userMessage);

  return new ReadableStream<string>({
    async pull(controller) {
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) controller.enqueue(text);
      }
      controller.close();
    },
  });
}

/**
 * Send a non-streaming message and return the full text response.
 */
export async function askGemini(
  userMessage: string,
  history: GeminiMessage[] = []
): Promise<string> {
  const client = getClient();

  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: CIVIC_SYSTEM_PROMPT,
    safetySettings: SAFETY_SETTINGS,
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
  });

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
