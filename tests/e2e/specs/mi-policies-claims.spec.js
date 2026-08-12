const { test, expect } = require('../fixtures');

test.describe('TC-MI Dashboard / Reporting / Pricing', () => {
  test.beforeEach(async ({ login }) => {
    await login();
  });

  test('TC-MI-01 dashboard loads @smoke', async ({ page }) => {
    await page.goto('/ng8/dashboard');
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('body')).toContainText(/Dashboard|Premium|Pipeline|Exposure|Quick/i);
    await expect(page.locator('.apex-alert--danger')).toHaveCount(0);
  });

  test('TC-MI-02 reporting loads @smoke', async ({ page }) => {
    await page.goto('/ng8/reporting');
    await expect(page).toHaveURL(/reporting/);
    await expect(page.locator('body')).toContainText(/Report|Premium|Broker|Pipeline|Loss/i);
  });

  test('TC-MI-03 pricing hub loads', async ({ page }) => {
    await page.goto('/ng8/modelling');
    await expect(page).toHaveURL(/modelling/);
    await expect(page.locator('body')).toContainText(/Pricing|Model|Technical|Prem|Queue|Exposure/i);
  });
});

test.describe('TC-POL / TC-CLM Policies & claims', () => {
  test.beforeEach(async ({ login }) => {
    await login();
  });

  test('TC-POL-01 policies list', async ({ page }) => {
    await page.goto('/#!/policies');
    await expect(page.getByRole('heading', { name: /Polic/i })).toBeVisible();
    await expect(page.locator('body')).toContainText(/Policy|Number|Status|Insured|Broker|No /i);
  });

  test('TC-POL-02 policy detail', async ({ page }) => {
    await page.goto('/#!/policies');
    await page.waitForTimeout(600);
    const link = page.locator('a[href*="#!/policies/"], a[href*="/policies/"]').first();
    if ((await link.count()) === 0) {
      test.skip(true, 'No policies in list');
    }
    await link.click();
    await expect(page).toHaveURL(/policies\/\d+/);
    await expect(page.locator('body')).toContainText(/Policy|Premium|Insured|Effective|Expiry|Status/i);
  });

  test('TC-CLM-01 claims list', async ({ page }) => {
    await page.goto('/#!/claims');
    await expect(page.getByRole('heading', { name: /Claim/i })).toBeVisible();
    await expect(page.locator('body')).toContainText(/Claim|Status|Reserve|No /i);
  });

  test('TC-CLM-02 claim detail', async ({ page }) => {
    await page.goto('/#!/claims');
    await page.waitForTimeout(600);
    const link = page.locator('a[href*="#!/claims/"], a[href*="/claims/"]').first();
    if ((await link.count()) === 0) {
      test.skip(true, 'No claims in list');
    }
    await link.click();
    await expect(page).toHaveURL(/claims\/\d+/);
    await expect(page.locator('body')).toContainText(/Claim|Reserve|Paid|Status|Loss|Description/i);
  });
});
