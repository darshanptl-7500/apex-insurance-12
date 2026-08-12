const { test, expect } = require('../fixtures');

test.describe('TC-TASK Tasks & inbox', () => {
  test.beforeEach(async ({ login }) => {
    await login();
  });

  test('TC-TASK-01 inbox loads @smoke', async ({ page }) => {
    await page.goto('/#!/inbox');
    await expect(page.getByRole('heading', { name: /Inbox/i })).toBeVisible();
    await expect(page.locator('body')).toContainText(/task|No open tasks|My open/i);
  });

  test('TC-TASK-02 open task detail when available', async ({ page }) => {
    await page.goto('/#!/inbox');
    await page.waitForTimeout(600);
    const link = page.locator('a[href*="#!/tasks/"], a[href*="/tasks/"]').first();
    if ((await link.count()) === 0) {
      test.skip(true, 'No open tasks in inbox');
    }
    await link.click();
    await expect(page).toHaveURL(/tasks\/\d+/);
    await expect(page.locator('body')).toContainText(/Task|Status|Comment|Complete|Detail/i);
  });

  test('TC-TASK-03 line slip questionnaire when present', async ({ page }) => {
    await page.goto('/#!/inbox');
    await page.waitForTimeout(600);
    const link = page.locator('a[href*="tasks/"]').first();
    if ((await link.count()) === 0) {
      test.skip(true, 'No tasks to inspect for line slip');
    }
    await link.click();
    const apex100 = page.locator('input[ng-model*="apex100"], label:has-text("100% Apex") input');
    if ((await apex100.count()) === 0) {
      test.skip(true, 'Not a line-slip questionnaire task');
    }
    await apex100.first().check();
    await expect(apex100.first()).toBeChecked();
  });
});
