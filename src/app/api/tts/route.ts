import { NextRequest } from "next/server";
import { synthesizeSpeech } from "@/lib/google/tts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, languageCode, voiceName } = body;

    if (!text || typeof text !== "string") {
      return Response.json({ error: "Text is required" }, { status: 400 });
    }

    const result = await synthesizeSpeech({
      text,
      languageCode: languageCode ?? "en-US",
      voiceName: voiceName ?? "en-US-Neural2-F",
    });

    if (!result.success) {
      return Response.json(
        {
          error: "TTS not available",
          audioContent: "",
          success: false,
        },
        { status: 503 }
      );
    }

    return Response.json({
      audioContent: result.audioContent,
      success: true,
    });
  } catch (err) {
    console.error("[VoxChain] TTS API error:", err);
    return Response.json(
      { error: "Speech synthesis failed", audioContent: "", success: false },
      { status: 500 }
    );
  }
}
