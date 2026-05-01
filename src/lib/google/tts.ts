/**
 * Google Cloud Text-to-Speech API Wrapper
 *
 * Converts text to speech using Neural2 voices.
 * Silently degrades when API key is missing.
 */

const TTS_API_KEY = process.env.GOOGLE_TTS_API_KEY ?? "";
const TTS_ENDPOINT = "https://texttospeech.googleapis.com/v1/text:synthesize";

export interface TTSRequest {
  text: string;
  languageCode?: string;
  voiceName?: string;
}

export interface TTSResult {
  audioContent: string; // base64-encoded MP3
  success: boolean;
}

/** Returns true when a TTS API key is configured. */
export function isTTSConfigured(): boolean {
  return TTS_API_KEY.length > 0;
}

/**
 * Synthesize speech from text using Google Cloud TTS.
 *
 * Returns base64-encoded MP3 audio.
 * Returns empty string + success=false if API key is missing or call fails.
 */
export async function synthesizeSpeech(
  request: TTSRequest
): Promise<TTSResult> {
  if (!isTTSConfigured()) {
    return { audioContent: "", success: false };
  }

  const {
    text,
    languageCode = "en-US",
    voiceName = "en-US-Neural2-F",
  } = request;

  // Cloud TTS has a 5000-byte limit per request; truncate if needed
  const truncatedText = text.slice(0, 4500);

  try {
    const response = await fetch(`${TTS_ENDPOINT}?key=${TTS_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text: truncatedText },
        voice: {
          languageCode,
          name: voiceName,
          ssmlGender: "FEMALE",
        },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: 1.0,
          pitch: 0,
        },
      }),
    });

    if (!response.ok) {
      console.warn("[VoxChain] TTS API error:", response.status);
      return { audioContent: "", success: false };
    }

    const data = await response.json();
    const audioContent: string = data?.audioContent ?? "";

    return { audioContent, success: audioContent.length > 0 };
  } catch (err) {
    console.warn("[VoxChain] TTS synthesis failed:", err);
    return { audioContent: "", success: false };
  }
}

/**
 * Play base64-encoded audio in the browser using Web Audio API.
 * Returns a cleanup function to stop playback.
 */
export function playAudioBase64(base64Audio: string): () => void {
  if (typeof window === "undefined" || !base64Audio) {
    return () => {};
  }

  const binaryString = atob(base64Audio);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);

  audio.play().catch((err) => {
    console.warn("[VoxChain] Audio playback failed:", err);
  });

  return () => {
    audio.pause();
    audio.currentTime = 0;
    URL.revokeObjectURL(url);
  };
}
