import { test, expect } from '@playwright/test';

test.describe('Trend Tracking System - Full System E2E Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
    });
  });

  test('TASK 3.1 - Layout & Navigation', async ({ page }) => {
    // Test 1: Homepage hiển thị
    await page.goto('/');
    await expect(page.locator('text="Trend Tracking System"')).toBeVisible();
    await expect(page.locator('nav').locator('text="Khám phá"')).toBeVisible();
    await expect(page.locator('nav').locator('text="Xu hướng"')).toBeVisible();
    await expect(page.locator('text="Đăng nhập"')).toBeVisible();
    await expect(page.locator('text="Đăng ký"')).toBeVisible();

    // Test 2: Routing điều hướng
    await page.click('text="Khám phá"');
    await expect(page).toHaveURL(/.*login/);
    
    await page.goto('/');
    await page.click('text="Xu hướng"');
    await expect(page).toHaveURL(/.*login/);
    
    await page.click('text="Trend Tracking System"');
    await expect(page).toHaveURL('http://localhost:3000/');

    // Test 3: Protected Route Redirect
    await page.goto('/dashboard');
    // Should be redirected to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('TASK 3.2 - Authentication', async ({ page }) => {
    // Test 4: Trang Login hiển thị
    await page.goto('/login');
    await expect(page.locator('input[placeholder="nhunghocgia@example.com"]')).toBeVisible();
    await expect(page.locator('input[placeholder="••••••••"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]:has-text("Đăng nhập")')).toBeVisible();
    await expect(page.locator('text="Quên mật khẩu?"')).toBeVisible();
    await expect(page.locator('text="Đăng ký ngay"')).toBeVisible();
    // Verify no orange debug button
    await expect(page.locator('text="Test Refresh Token Interceptor"')).toBeHidden();

    // Test 5: Đăng nhập sai credential
    await page.fill('input[placeholder="nhunghocgia@example.com"]', 'wrong@test.com');
    await page.fill('input[placeholder="••••••••"]', 'wrongpass');
    await page.click('button[type="submit"]:has-text("Đăng nhập")', { force: true });
    // Wait for error toast
    await expect(page.locator('div[role="status"]').filter({ hasText: /Đăng nhập thất bại|Invalid email/ })).toBeVisible();

    // Test 6: Đăng nhập thành công với Admin
    await page.fill('input[placeholder="nhunghocgia@example.com"]', 'admin@admin.com');
    await page.fill('input[placeholder="••••••••"]', 'admin123');
    await page.click('button[type="submit"]:has-text("Đăng nhập")', { force: true });
    // Verify redirect to homepage
    await expect(page).toHaveURL('http://localhost:3000/');
    // Verify Navbar shows "Chào, Admin" and "Bảng điều khiển Admin"
    await expect(page.locator('text=/Chào,\\s*.*Admin/')).toBeVisible();
    await expect(page.locator('text="Bảng điều khiển Admin"')).toBeVisible();

    // Logout
    await page.click('text="Đăng xuất"', { force: true });

    // Test 7: Trang Quên mật khẩu
    await page.goto('/forgot-password');
    await expect(page.locator('input[id="forgot-email"]')).toBeVisible();
    await page.fill('input[id="forgot-email"]', 'test@example.com');
    await page.click('button[type="submit"]:has-text("Gửi liên kết đặt lại")', { force: true });
    // Expect success screen
    await expect(page.locator('text="Kiểm tra email của bạn!"')).toBeVisible();
    
    // Test 8: Trang Đăng ký
    await page.goto('/register');
    // Short password
    await page.fill('input[placeholder="Nguyễn Văn A"]', 'Test User');
    await page.fill('input[placeholder="name@university.edu"]', `test_${Date.now()}@test.com`);
    await page.fill('input[placeholder="••••••••"]', '123'); // < 8
    await page.click('button[type="submit"]:has-text("Tạo tài khoản")', { force: true });
    // Expect validation error
    await expect(page.locator('div[role="status"]')).toBeVisible();

    // Success registration
    await page.fill('input[placeholder="••••••••"]', 'Password123!');
    await page.click('button[type="submit"]:has-text("Tạo tài khoản")', { force: true });
    await expect(page).toHaveURL(/.*login/);
  });

  test('TASK 3.3 & 3.4 - Admin Dashboard & Profile', async ({ page }) => {
    // 1. Đăng nhập Admin
    await page.goto('/login');
    await page.fill('input[placeholder="nhunghocgia@example.com"]', 'admin@admin.com');
    await page.fill('input[placeholder="••••••••"]', 'admin123');
    await page.click('button[type="submit"]:has-text("Đăng nhập")');
    await expect(page).toHaveURL('http://localhost:3000/');
    // Wait for success toast to disappear
    await expect(page.locator('div[role="status"]')).toBeHidden({ timeout: 15000 });

    // 2. Truy cập Admin Dashboard (Task 3.3)
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*admin/);
    await expect(page.locator('h1:has-text("Bảng điều khiển Quản trị")')).toBeVisible();
    
    // Check table and rows
    const adminRows = page.locator('tr:has(span:has-text("ADMIN"))');
    if (await adminRows.count() > 0) {
      const adminDeleteBtn = adminRows.first().locator('button[title="Xóa tài khoản"]');
      await expect(adminDeleteBtn).toBeDisabled();
    }

    const studentRows = page.locator('tr:has(span:has-text("STUDENT"))');
    if (await studentRows.count() > 0) {
      const studentDeleteBtn = studentRows.first().locator('button[title="Xóa tài khoản"]');
      await expect(studentDeleteBtn).not.toBeDisabled();
    }

    // 3. Truy cập Profile Page (Task 3.4)
    await page.goto('/profile');
    await expect(page).toHaveURL(/.*profile/);
    await expect(page.locator('label:has-text("Họ và tên")')).toBeVisible();

    // Cập nhật tên
    await page.fill('input[name="fullName"]', 'Admin Updated');
    await page.click('button:has-text("Lưu thay đổi")');
    await expect(page.locator('text="Cập nhật thông tin cá nhân thành công!"').first()).toBeVisible();
    await expect(page.locator('div[role="status"]').first()).toBeHidden({ timeout: 15000 });
    
    // Change it back to avoid messing up other tests
    await page.fill('input[name="fullName"]', 'Admin Test');
    await page.click('button:has-text("Lưu thay đổi")');
    await expect(page.locator('text="Cập nhật thông tin cá nhân thành công!"').first()).toBeVisible();
    await expect(page.locator('div[role="status"]').first()).toBeHidden({ timeout: 15000 });

    // Đổi mật khẩu - sai mật khẩu hiện tại
    await page.fill('input[name="currentPassword"]', 'WrongPass123');
    await page.fill('input[name="newPassword"]', 'NewAdmin123');
    await page.fill('input[name="confirmPassword"]', 'NewAdmin123');
    await page.click('button:has-text("Cập nhật mật khẩu")');
    await expect(page.locator('text="Invalid current password"').or(page.locator('text="Mật khẩu hiện tại không đúng"')).first()).toBeVisible();
  });
});
