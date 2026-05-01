import { NextRequest } from "next/server";
import { translateText } from "@/lib/google/translate";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLang } = body;

    if (!text || typeof text !== "string") {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }
    if (!targetLang || typeof targetLang !== "string") {
      return Response.json(
        { error: "Target language is required" },
        { status: 400 }
      );
    }

    const result = await translateText(text, targetLang);

    return Response.json({
      translatedText: result.translatedText,
      cached: result.cached,
      detectedSourceLanguage: result.detectedSourceLanguage,
    });
  } catch (err) {
    console.error("[VoxChain] Translate API error:", err);
    return Response.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
