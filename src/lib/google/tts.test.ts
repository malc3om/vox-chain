import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("tts", () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockReset();
  });

  it("returns empty audioContent when API key is missing", async () => {
    const { synthesizeSpeech } = await import("@/lib/google/tts");
    const result = await synthesizeSpeech({ text: "Hello world" });
    expect(result.audioContent).toBe("");
    expect(result.success).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("isTTSConfigured returns false when no key is set", async () => {
    const { isTTSConfigured } = await import("@/lib/google/tts");
    expect(isTTSConfigured()).toBe(false);
  });

  it("playAudioBase64 returns a cleanup function", async () => {
    const { playAudioBase64 } = await import("@/lib/google/tts");
    // Should return a no-op function when called with empty string
    const cleanup = playAudioBase64("");
    expect(typeof cleanup).toBe("function");
    cleanup(); // Should not throw
  });
});
