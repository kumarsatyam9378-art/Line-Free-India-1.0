import { test, expect } from '@playwright/test';

test('app loads and shows splash screen', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Wait for the splash screen text
  await expect(page.locator('text=Koi Line Nahi!')).toBeVisible();
  await expect(page.locator('text=Skip the queue, save your time')).toBeVisible();
});