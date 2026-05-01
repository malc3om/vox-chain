import { test, expect } from '@playwright/test';

test('has title and can open wallet modal', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/VoxChain/);

  // Click the connect wallet button
  await page.click('button:has-text("Connect Wallet")');

  // Modal should be visible
  await expect(page.locator('text=Connect your Midnight wallet')).toBeVisible();
});
