import { test, expect } from '@playwright/test';

test('can add and list items end-to-end', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Items' })).toBeVisible();

  const input = page.getByRole('textbox', { name: 'item-name' });
  const name = `Playwright Item ${Date.now()}`;
  await input.fill(name);
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.getByText(name)).toBeVisible();
});

