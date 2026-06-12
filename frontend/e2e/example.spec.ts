import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toContainText('Trend Tracking System');
});

test('can register, login and access protected dashboard', async ({ page }) => {
  const uniqueEmail = `test_${Date.now()}@example.com`;

  // 1. Đi tới trang đăng ký
  await page.goto('/register');
  await page.waitForTimeout(500);
  await page.fill('input[placeholder="Nguyễn Văn A"]', 'Automation User');
  await page.fill('input[type="email"]', uniqueEmail);
  await page.fill('input[placeholder="••••••••"]', 'Password123!');
  await page.click('button[type="submit"]');

  // Sau khi đăng ký thành công, chuyển sang login
  await expect(page).toHaveURL(/.*login/, { timeout: 15000 });

  // 2. Đăng nhập
  await page.waitForTimeout(500);
  await page.fill('input[type="email"]', uniqueEmail);
  await page.fill('input[placeholder="••••••••"]', 'Password123!');
  await page.click('button[type="submit"]');

  // Sau đăng nhập, chờ chuyển về trang chủ
  await page.waitForTimeout(2000);

  // Truy cập Dashboard
  await page.goto('/dashboard');
  await page.waitForTimeout(2000);

  // Kiểm tra đã vào được Dashboard (không bị redirect về login)
  const currentUrl = page.url();
  expect(currentUrl).toContain('dashboard');

  // Chụp lại màn hình trang Dashboard
  await page.screenshot({ path: 'e2e/screenshots/04-dashboard.png', fullPage: true });
});
