import { describe, it, expect, vi, beforeEach } from "vitest";
import { isGeminiConfigured } from "./gemini";
import { getFallbackResponse } from "./prompts";

describe("isGeminiConfigured", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns false when GEMINI_API_KEY is empty", () => {
    expect(isGeminiConfigured()).toBe(false);
  });
});

describe("getFallbackResponse", () => {
  it("covers electoral college topic", () => {
    const response = getFallbackResponse("What is the electoral college?");
    expect(response).toContain("Electoral College");
    expect(response).toContain("538");
    expect(response).toContain("archives.gov");
  });

  it("covers voter registration topic", () => {
    const response = getFallbackResponse("How do I register to vote?");
    expect(response).toContain("Voter Registration");
    expect(response).toContain("vote.org");
  });

  it("covers zero knowledge proof topic", () => {
    const response = getFallbackResponse("What is a zero knowledge proof?");
    expect(response).toContain("ZK proof");
    expect(response).toContain("midnight.network");
  });

  it("covers vote counting topic", () => {
    const response = getFallbackResponse("How is my vote counted?");
    expect(response).toContain("Polls Close");
    expect(response).toContain("eac.gov");
  });

  it("returns generic civic response for unknown topics", () => {
    const response = getFallbackResponse("Tell me about gerrymandering");
    expect(response).toContain("Transparency");
    expect(response).toContain("usa.gov");
  });

  it("is case-insensitive", () => {
    const response = getFallbackResponse("ELECTORAL COLLEGE");
    expect(response).toContain("Electoral College");
  });
});
