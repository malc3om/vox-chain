/**
 * Chat API Route — Gemini 2.0 Flash Civic Q&A
 *
 * Uses the shared Gemini client from `lib/ai/gemini.ts`.
 * Falls back to curated civic knowledge when the API key is missing.
 *
 * @route POST /api/chat
 * @body { message: string, history?: { role: string, content: string }[] }
 * @returns { response: string, source: "gemini" | "fallback" }
 */

import { NextRequest } from "next/server";
import { isGeminiConfigured, askGemini, type GeminiMessage } from "@/lib/ai/gemini";
import { getFallbackResponse } from "@/lib/ai/prompts";
import { logChatSession } from "@/lib/firebase";
import { rateLimit } from "@/lib/rateLimit";

interface ChatRequestBody {
  message: string;
  history?: { role: string; content: string }[];
}

/** Max 20 requests per minute per IP */
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

export async function POST(request: NextRequest) {
  let message = "";
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
    const { allowed, remaining } = rateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
    if (!allowed) {
      return Response.json(
        { error: "Too many requests. Please wait before sending another message." },
        { status: 429, headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" } }
      );
    }

    const body: ChatRequestBody = await request.json();
    message = body.message;
    const history = body.history ?? [];

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Fallback path — no API key configured
    if (!isGeminiConfigured()) {
      const fallback = getFallbackResponse(message);
      logChatSession({ questionsAsked: 1, source: "fallback", sessionId: crypto.randomUUID() });
      return Response.json(
        { response: fallback, source: "fallback" },
        { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
      );
    }

    // Format history for Gemini SDK
    const formattedHistory: GeminiMessage[] = history.map((h) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.content }],
    }));

    const text = await askGemini(message, formattedHistory);
    const responseText = text || getFallbackResponse(message);

    // Log session analytics to Firebase (non-blocking)
    logChatSession({ questionsAsked: 1, source: "gemini", sessionId: crypto.randomUUID() });

    return Response.json({ response: responseText, source: "gemini" });
  } catch (err) {
    console.error("[VoxChain] Chat API error:", err);
    const fallback = getFallbackResponse(message);
    return Response.json(
      { response: fallback, source: "fallback" },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
    );
  }
}
