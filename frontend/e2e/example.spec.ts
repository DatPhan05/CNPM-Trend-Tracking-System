import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toContainText('Trend Tracking System');
});

test('protected dashboard redirects to login when not authenticated', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/.*login/);
});

test('protected admin redirects to login when not authenticated', async ({ page }) => {
  await page.goto('/admin');
  await expect(page).toHaveURL(/.*login/);
});

test('login page loads correctly', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('body')).toContainText('Đăng nhập');
});

test('register page loads correctly', async ({ page }) => {
  await page.goto('/register');
  await expect(page.locator('body')).toContainText('Đăng ký');
});
