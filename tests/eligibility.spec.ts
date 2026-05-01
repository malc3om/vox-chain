import { test, expect } from "@playwright/test";

test.describe("Eligibility Flow", () => {
  test("shows intro step by default", async ({ page }) => {
    await page.goto("/eligibility");
    await expect(page.getByText("Private Eligibility Check")).toBeVisible();
    await expect(page.locator("#start-eligibility-btn")).toBeVisible();
  });

  test("advances to input step after clicking start", async ({ page }) => {
    await page.goto("/eligibility");
    await page.click("#start-eligibility-btn");
    // Wait for the wallet connecting state to pass
    await page.waitForSelector("#age-input", { timeout: 5000 });
    await expect(page.locator("#age-input")).toBeVisible();
    await expect(page.locator("#constituency-input")).toBeVisible();
  });

  test("full eligibility flow — eligible user", async ({ page }) => {
    await page.goto("/eligibility");
    await page.click("#start-eligibility-btn");
    await page.waitForSelector("#age-input", { timeout: 5000 });

    await page.fill("#age-input", "25");
    await page.fill("#constituency-input", "District 5");
    await page.click("#generate-proof-btn");

    // Wait for proof generation (3 second timeout in app)
    await page.waitForSelector("text=You Are Eligible", { timeout: 8000 });
    await expect(page.getByText("You Are Eligible")).toBeVisible();
    await expect(page.getByText(/cryptographically verified/i)).toBeVisible();
  });

  test("shows not eligible for under-18", async ({ page }) => {
    await page.goto("/eligibility");
    await page.click("#start-eligibility-btn");
    await page.waitForSelector("#age-input", { timeout: 5000 });

    await page.fill("#age-input", "16");
    await page.fill("#constituency-input", "District 1");
    await page.click("#generate-proof-btn");

    await page.waitForSelector("text=Not Eligible", { timeout: 8000 });
    await expect(page.getByText("Not Eligible")).toBeVisible();
  });

  test("reset button returns to intro", async ({ page }) => {
    await page.goto("/eligibility");
    await page.click("#start-eligibility-btn");
    await page.waitForSelector("#age-input", { timeout: 5000 });
    await page.fill("#age-input", "25");
    await page.fill("#constituency-input", "District 5");
    await page.click("#generate-proof-btn");
    await page.waitForSelector("#reset-eligibility-btn", { timeout: 8000 });
    await page.click("#reset-eligibility-btn");
    await expect(page.getByText("Private Eligibility Check")).toBeVisible();
  });
});
