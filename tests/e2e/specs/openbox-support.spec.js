const { test, expect } = require('../fixtures');

test.describe('TC-OBX Open Box', () => {
  test.beforeEach(async ({ login }) => {
    await login();
  });

  test('TC-OBX-01 portal loads with gateway status @smoke', async ({ page }) => {
    await page.goto('/#!/openbox');
    await expect(page.getByRole('heading', { name: /Open Box/i })).toBeVisible();
    await expect(page.locator('.obx-status, .apex-card').first()).toBeVisible();
  });

  test('TC-OBX-02 bus health tile', async ({ page }) => {
    await page.goto('/#!/openbox');
    await expect(page.locator('.obx-status')).toContainText(/Integration bus|RabbitMQ|InMemory|Broker|exchange/i);
  });

  test('TC-OBX-03 publish insured from external form', async ({ page }) => {
    await page.goto('/#!/openbox');
    const name = 'E2E Party ' + Date.now();
    await page.locator('input[ng-model="vm.party.name"]').fill(name);
    await page.locator('input[ng-model="vm.party.city"]').fill('London');
    await page.locator('input[ng-model="vm.party.postCode"]').fill('EC1A 1BB');
    await page.locator('input[ng-model="vm.party.tradeCode"]').fill('OFFICE');
    await page.getByRole('button', { name: /Publish to bus/i }).click();
    await expect(page.locator('.apex-alert--success, .apex-alert--danger').first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('.apex-alert--success')).toBeVisible();
  });

  test('TC-OBX-04 bus messages list visible', async ({ page }) => {
    await page.goto('/#!/openbox');
    await page.getByRole('button', { name: /^Refresh$/i }).first().click();
    await expect(page.locator('body')).toContainText(/Bus messages|No bus events|InsuredCreated|RiskCreated|UwFieldsUpdated|event/i);
  });
});

test.describe('TC-SUP Support', () => {
  test.beforeEach(async ({ login }) => {
    await login();
  });

  test('TC-SUP-01 system health probes @smoke', async ({ page }) => {
    await page.goto('/#!/support');
    await expect(page.getByRole('heading', { name: /Support/i })).toBeVisible();
    await page.getByRole('button', { name: /System Health Check/i }).click();
    await page.getByRole('button', { name: /Refresh/i }).click();
    await expect(page.locator('.apex-health-grid, .apex-health-card').first()).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('body')).toContainText(/Apex DB|Documents|OpenBox|RabbitMQ|Rating|Success|Failed|Warning/i);
  });

  test('TC-SUP-02 integration activity tab', async ({ page }) => {
    await page.goto('/#!/support');
    await page.getByRole('button', { name: /Integration Activity/i }).click();
    await expect(page.locator('body')).toContainText(/Integration Activity|No integration events|RabbitMQ|OBX|System|Action/i);
  });
});
