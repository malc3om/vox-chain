import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit } from "./rateLimit";

describe("rateLimit", () => {
  beforeEach(() => {
    // Reset state by advancing time past window
    for (let i = 0; i < 100; i++) {
      rateLimit(`cleanup-${i}`, 1, 1);
    }
  });

  it("allows requests within the limit", () => {
    const key = `test-allow-${Date.now()}`;
    const result = rateLimit(key, 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests exceeding the limit", () => {
    const key = `test-block-${Date.now()}`;
    for (let i = 0; i < 3; i++) {
      rateLimit(key, 3, 60_000);
    }
    const result = rateLimit(key, 3, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks different keys independently", () => {
    const key1 = `test-key1-${Date.now()}`;
    const key2 = `test-key2-${Date.now()}`;

    for (let i = 0; i < 3; i++) {
      rateLimit(key1, 3, 60_000);
    }

    const result1 = rateLimit(key1, 3, 60_000);
    const result2 = rateLimit(key2, 3, 60_000);

    expect(result1.allowed).toBe(false);
    expect(result2.allowed).toBe(true);
  });

  it("allows requests after window expires", async () => {
    const key = `test-expire-${Date.now()}`;
    // Use a tiny window
    rateLimit(key, 1, 10);
    // Wait for window to expire
    await new Promise((r) => setTimeout(r, 15));
    const result = rateLimit(key, 1, 10);
    expect(result.allowed).toBe(true);
  });
});
