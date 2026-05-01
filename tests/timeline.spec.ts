import { test, expect } from "@playwright/test";

test.describe("Election Timeline", () => {
  test("shows header and timeline phases", async ({ page }) => {
    await page.goto("/timeline");
    await expect(page.getByRole("heading", { name: /election timeline/i })).toBeVisible();
  });

  test("displays all 6 election phases", async ({ page }) => {
    await page.goto("/timeline");
    await expect(page.locator("[id^='timeline-phase-']")).toHaveCount(6);
  });

  test("clicking a phase reveals details", async ({ page }) => {
    await page.goto("/timeline");
    // Click the first phase button
    await page.click("[id='timeline-phase-1']");
    // Details should expand
    await expect(page.getByText(/online registration opens/i)).toBeVisible();
  });

  test("shows progress bar", async ({ page }) => {
    await page.goto("/timeline");
    await expect(page.locator(".progress-bar")).toBeVisible();
    await expect(page.getByText(/% complete/i)).toBeVisible();
  });

  test("shows on-chain transaction for completed phases", async ({ page }) => {
    await page.goto("/timeline");
    await page.click("[id='timeline-phase-1']");
    await expect(page.getByText(/on-chain tx/i)).toBeVisible();
  });
});
