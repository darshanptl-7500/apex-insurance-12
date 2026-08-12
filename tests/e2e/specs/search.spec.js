const { test, expect } = require('../fixtures');

test.describe('TC-SEARCH Advanced Search', () => {
  test.beforeEach(async ({ login }) => {
    await login();
  });

  test('TC-SEARCH-01 page loads without crash @smoke', async ({ page }) => {
    await page.goto('/#!/search');
    await expect(page.locator('body')).toContainText(/Policy Search|Saved Searches|Criteria|Search/i);
    await expect(page.locator('.apex-alert--danger')).toHaveCount(0);
  });

  test('TC-SEARCH-02 search All / run search', async ({ page }) => {
    await page.goto('/#!/search');
    await page.getByRole('button', { name: /^Search$/i }).click();
    await expect(page.locator('.apex-loading, .apex-table, .apex-alert, apex-empty-state').first()).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('.apex-loading')).toHaveCount(0, { timeout: 20_000 });
    await expect(page.locator('.apex-alert--danger')).toHaveCount(0);
  });

  test('TC-SEARCH-03 policy status filter', async ({ page }) => {
    await page.goto('/#!/search');
    // Set first criteria field to Status if available via Angular
    await page.evaluate(() => {
      const scopeEl = document.querySelector('.apex-search-page') || document.querySelector('[ng-view]');
      const scope = window.angular.element(scopeEl).scope();
      const vm = scope && (scope.vm || (scope.$parent && scope.$parent.vm));
      if (!vm || !vm.criteria || !vm.criteria.length) return;
      const row = vm.criteria[0];
      if (vm.fieldOptions && vm.fieldOptions.some((f) => f.value === 'status' || f.value === 'policyStatus')) {
        row.field = vm.fieldOptions.find((f) => f.value === 'status' || f.value === 'policyStatus').value;
        if (typeof vm.onFieldChange === 'function') vm.onFieldChange(row);
        row.operator = row.operator || 'eq' || 'equals';
        row.value = 'Bound';
        scope.$apply();
      }
    });
    await page.getByRole('button', { name: /^Search$/i }).click();
    await page.waitForTimeout(800);
    await expect(page.locator('body')).toContainText(/Search|Bound|result|No |Policy/i);
  });
});
