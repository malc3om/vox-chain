import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock firebase module
vi.mock("@/lib/firebase", () => ({
  isFirebaseConfigured: () => false,
  getDb: () => ({}),
}));

describe("translate", () => {
  beforeEach(() => {
    vi.resetModules();
    mockFetch.mockReset();
  });

  it("returns original text when target language is English", async () => {
    const { translateText } = await import("@/lib/google/translate");
    const result = await translateText("Hello world", "en");
    expect(result.translatedText).toBe("Hello world");
    expect(result.cached).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns original text when API key is missing", async () => {
    const { translateText } = await import("@/lib/google/translate");
    const result = await translateText("Hello world", "es");
    expect(result.translatedText).toBe("Hello world");
    expect(result.cached).toBe(false);
  });

  it("exports SUPPORTED_LANGUAGES with correct structure", async () => {
    const { SUPPORTED_LANGUAGES } = await import("@/lib/google/translate");
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThanOrEqual(6);
    expect(SUPPORTED_LANGUAGES[0]).toHaveProperty("code");
    expect(SUPPORTED_LANGUAGES[0]).toHaveProperty("label");
    expect(SUPPORTED_LANGUAGES[0]).toHaveProperty("native");
  });

  it("isTranslateConfigured returns false when no key is set", async () => {
    const { isTranslateConfigured } = await import("@/lib/google/translate");
    expect(isTranslateConfigured()).toBe(false);
  });
});
