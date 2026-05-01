import { test, expect } from "@playwright/test";

test.describe("Ask AI", () => {
  test("shows the Ask AI page", async ({ page }) => {
    await page.goto("/ask");
    await expect(page.getByRole("heading", { name: /ask voxchain/i })).toBeVisible();
  });

  test("search input shows and accepts text", async ({ page }) => {
    await page.goto("/ask");
    const input = page.locator("textarea, input[type='text']").first();
    await input.fill("What is the electoral college?");
    await expect(input).toHaveValue("What is the electoral college?");
  });

  test("navigating from hero search redirects to ask page with query", async ({ page }) => {
    await page.goto("/");
    await page.fill("#hero-search-input", "electoral college");
    await page.click("#hero-ask-btn");
    await expect(page).toHaveURL(/\/ask/);
  });
});
