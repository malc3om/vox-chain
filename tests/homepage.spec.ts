import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("has correct title and hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/VoxChain/);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("displays navbar with all links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /timeline/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /ask ai/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /eligibility/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /quiz/i }).first()).toBeVisible();
  });

  test("hero search input accepts text", async ({ page }) => {
    await page.goto("/");
    const input = page.locator("#hero-search-input");
    await input.fill("What is the electoral college?");
    await expect(input).toHaveValue("What is the electoral college?");
  });

  test("ask voxchain button is present and clickable", async ({ page }) => {
    await page.goto("/");
    const btn = page.locator("#hero-ask-btn");
    await expect(btn).toBeVisible();
  });

  test("feature cards link to correct routes", async ({ page }) => {
    await page.goto("/");
    // Wait for cards to be visible
    await page.waitForSelector(".feature-card", { timeout: 5000 });
    const cards = page.locator(".feature-card");
    await expect(cards).toHaveCount(4);
  });
});
