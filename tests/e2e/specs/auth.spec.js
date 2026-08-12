const { test, expect, USERS } = require('../fixtures');

test.describe('TC-AUTH Authentication', () => {
  test('TC-AUTH-01 valid login as uw1 @smoke', async ({ page, login }) => {
    await login(USERS.uw1);
    await expect(page.locator('.apex-topbar__username')).toBeVisible();
    await expect(page.locator('.apex-topbar__role')).toContainText(/Underwriter/i);
    await expect(page.locator('.apex-topbar__uw')).toHaveText('UW');
    await expect(page).toHaveURL(/pipeline/i);
  });

  test('TC-AUTH-02 invalid password stays on login @smoke', async ({ page }) => {
    await page.goto('/#!/login');
    await page.locator('#username').fill('uw1');
    await page.locator('#password').fill('WrongPassword!');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.locator('.apex-alert--danger')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.apex-chrome')).toHaveCount(0);
  });

  test('TC-AUTH-03 unauthenticated pipeline redirects to login @smoke', async ({ page, clearSession }) => {
    await clearSession();
    await page.goto('/#!/pipeline/upcoming');
    await expect(page).toHaveURL(/login/i);
  });

  test('TC-AUTH-04 demo role picker signs in', async ({ page }) => {
    await page.goto('/#!/login');
    await page.locator('.apex-login__demo-btn').filter({ hasText: /Underwriter/i }).first().click();
    await expect(page.locator('.apex-chrome')).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('.apex-topbar__role')).toContainText(/Underwriter/i);
  });

  test('TC-AUTH-05 logout returns to login @smoke', async ({ page, login }) => {
    await login();
    await page.getByRole('button', { name: /log out/i }).click();
    await expect(page).toHaveURL(/login/i);
    await expect(page.locator('#username')).toBeVisible();
  });

  test('TC-AUTH-06 Admin sees Admin nav', async ({ page, login }) => {
    await login(USERS.admin);
    await expect(page.locator('.apex-primary-nav').getByRole('link', { name: /^Admin$/i })).toBeVisible();
  });

  test('TC-AUTH-07 UW does not see Admin', async ({ page, login }) => {
    await login(USERS.uw1);
    await expect(page.locator('.apex-primary-nav').getByRole('link', { name: /^Admin$/i })).toHaveCount(0);
  });
});
