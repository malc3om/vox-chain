import { test, expect } from "@playwright/test";

test.describe("Quiz", () => {
  test("shows quiz start screen", async ({ page }) => {
    await page.goto("/quiz");
    await expect(page.getByRole("heading", { name: /civic knowledge quiz/i })).toBeVisible();
  });

  test("start quiz button is present", async ({ page }) => {
    await page.goto("/quiz");
    const startBtn = page.locator("button", { hasText: /start quiz/i });
    await expect(startBtn).toBeVisible();
  });

  test("starts quiz and shows first question", async ({ page }) => {
    await page.goto("/quiz");
    await page.click("button:has-text('Start Quiz')");
    // First question should appear
    await expect(page.locator("[id^='quiz-option-']").first()).toBeVisible({ timeout: 5000 });
  });

  test("can answer a question and advance", async ({ page }) => {
    await page.goto("/quiz");
    await page.click("button:has-text('Start Quiz')");
    // Click the first answer option
    const firstOption = page.locator("[id^='quiz-option-']").first();
    await firstOption.waitFor({ timeout: 5000 });
    await firstOption.click();
    // Explanation or next button should appear
    await expect(page.locator("button:has-text('Next Question'), [id='quiz-next-btn']")).toBeVisible({ timeout: 3000 });
  });
});
