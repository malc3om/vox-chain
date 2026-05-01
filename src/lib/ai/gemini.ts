/**
 * Gemini AI Client for VoxChain
 * 
 * Streaming interface for the Gemini API.
 * Handles civic Q&A with the configured system prompt.
 * Falls back to simulated responses when no API key is set.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=`;

import { CIVIC_SYSTEM_PROMPT } from "./prompts";

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

/**
 * Check if Gemini API is configured.
 */
export function isGeminiConfigured(): boolean {
  return GEMINI_API_KEY.length > 0;
}

/**
 * Send a message to Gemini and get a streaming response.
 * Returns a ReadableStream of text chunks.
 */
export async function streamGeminiResponse(
  userMessage: string,
  history: GeminiMessage[] = []
): Promise<ReadableStream<string>> {
  if (!isGeminiConfigured()) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const contents: GeminiMessage[] = [
    ...history,
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const response = await fetch(`${GEMINI_ENDPOINT}${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: CIVIC_SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.9,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  // Parse SSE stream into text chunks
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream<string>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6).trim();
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const text =
              parsed?.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (text) {
              controller.enqueue(text);
            }
          } catch {
            // Skip malformed JSON chunks
          }
        }
      }
    },
  });
}

/**
 * Send a non-streaming message to Gemini.
 * Returns the full text response.
 */
export async function askGemini(
  userMessage: string,
  history: GeminiMessage[] = []
): Promise<string> {
  if (!isGeminiConfigured()) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const contents: GeminiMessage[] = [
    ...history,
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: CIVIC_SYSTEM_PROMPT }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
