const { test, expect, USERS } = require('../fixtures');

test.describe('TC-CONN Connect / brokers', () => {
  test('TC-CONN-01 Connect overview @smoke', async ({ page, login }) => {
    await login();
    await page.goto('/#!/connect');
    await expect(page.locator('body')).toContainText(/Connect|Broker|Insured/i);
  });

  test('TC-CONN-02 Brokers list', async ({ page, login }) => {
    await login();
    await page.goto('/#!/brokers');
    await expect(page.getByRole('heading', { name: /Brokers/i })).toBeVisible();
    await expect(page.locator('.apex-table, body')).toContainText(/Broker|Name|code|Active|Acme|Marsh|Aon|NB/i);
  });

  test('TC-CONN-03 create broker as Admin', async ({ page, login }) => {
    await login(USERS.admin);
    await page.goto('/#!/brokers');
    await page.getByRole('button', { name: /\+ New broker/i }).click();
    const code = 'E2E' + String(Date.now()).slice(-6);
    await page.locator('input[ng-model="vm.draft.name"]').fill('E2E Broker ' + code);
    await page.locator('input[ng-model="vm.draft.brokerCode"]').fill(code);
    await page.getByRole('button', { name: /Create broker/i }).click();
    await expect(page).toHaveURL(/brokers\/\d+/, { timeout: 15_000 });
    await expect(page.locator('body')).toContainText(/E2E Broker|Broker/i);
  });

  test('TC-CONN-04 UW cannot create broker', async ({ page, login, request, apiURL, apiLogin }) => {
    await login(USERS.uw1);
    await page.goto('/#!/brokers');
    await expect(page.getByRole('button', { name: /\+ New broker/i })).toHaveCount(0);

    const token = await apiLogin(USERS.uw1);
    const res = await request.post(`${apiURL}/api/brokers`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: 'Should Fail',
        brokerCode: 'FAIL' + Date.now()
      }
    });
    expect([401, 403]).toContain(res.status());
  });
});
