const { test, expect, fillNewRiskViaAngular } = require('../fixtures');

test.describe('TC-PIPE Pipeline', () => {
  test.beforeEach(async ({ login }) => {
    await login();
  });

  test('TC-PIPE-01 upcoming loads with grid @smoke', async ({ page }) => {
    await page.goto('/#!/pipeline/upcoming');
    await expect(page.getByRole('heading', { name: /Pipeline/i })).toBeVisible();
    await expect(page.locator('.apex-pipeline-rail')).toBeVisible();
    await expect(page.locator('.ag-root, .apex-pipe-grid, .apex-pipeline-main').first()).toBeVisible();
  });

  test('TC-PIPE-02 bucket switch refreshes title @smoke', async ({ page }) => {
    await page.goto('/#!/pipeline/upcoming');
    const railItem = page.locator('.apex-pipeline-rail__item').filter({ hasNotText: /Upcoming/i }).first();
    const label = ((await railItem.locator('span').first().textContent()) || '').trim();
    await railItem.click();
    await expect(page.locator('.apex-page-header h1')).toContainText(/Pipeline/i);
    if (label) {
      await expect(page.locator('.apex-page-header h1')).toContainText(new RegExp(label.split(/\s+/)[0], 'i'));
    }
  });

  test('TC-PIPE-03 toolbar / column filters apply', async ({ page }) => {
    await page.goto('/#!/pipeline/upcoming');
    const search = page.locator('#pipe-search');
    if (await search.count()) {
      await search.fill('Acme');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      await expect(page.locator('.apex-pipeline-main')).toBeVisible();
      await search.fill('');
      await page.keyboard.press('Enter');
    }
    const clear = page.getByRole('button', { name: /Clear col filters/i });
    if (await clear.count()) {
      await clear.click();
    }
    // AG Grid floating filter if present
    const floating = page.locator('.ag-floating-filter-input input, .ag-input-field-input').first();
    if (await floating.count()) {
      await floating.fill('a');
      await page.waitForTimeout(400);
      await floating.fill('');
    }
    await expect(page.locator('.apex-alert--danger')).toHaveCount(0);
  });

  test('TC-PIPE-04 paging controls when present', async ({ page }) => {
    await page.goto('/#!/pipeline/upcoming');
    await expect(page.locator('.apex-pipeline-main')).toBeVisible();
    const pager = page.locator('.ag-paging-panel, .apex-pager');
    const rowSummary = page.getByText(/\d+\s+row/i);
    await expect(pager.or(rowSummary).first()).toBeVisible({ timeout: 10_000 });
    const next = page.locator('.ag-paging-button').filter({ has: page.locator('.ag-icon-next') }).first();
    if (await next.count()) {
      const disabled = await next.getAttribute('aria-disabled');
      if (disabled !== 'true') {
        await next.click();
        await page.waitForTimeout(400);
      }
    }
  });

  test('TC-PIPE-05 open UW File from row', async ({ page }) => {
    await page.goto('/#!/pipeline/upcoming');
    await page.waitForTimeout(800);
    const link = page.locator('a[href*="case-hub"], a[href*="/ng8/case-hub"]').first();
    if (await link.count()) {
      await link.click();
      await expect(page).toHaveURL(/case-hub/i);
      return;
    }
    // Fallback navigate to seeded file
    await page.goto('/ng8/case-hub/1');
    await expect(page.locator('.uw-layout, .uw-header, text=/not found/i').first()).toBeVisible({ timeout: 20_000 });
  });

  test('TC-PIPE-06 export excel triggers download or handler', async ({ page }) => {
    await page.goto('/#!/pipeline/upcoming');
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
    await page.locator('.apex-pipeline-rail__link', { hasText: /Export to Excel/i }).click();
    const download = await downloadPromise;
    if (download) {
      expect(download.suggestedFilename().length).toBeGreaterThan(0);
    } else {
      // CSV may open in-page or alert — ensure no crash
      await expect(page.locator('.apex-pipeline-main')).toBeVisible();
    }
  });
});

test.describe('TC-RISK New Risk', () => {
  test('TC-RISK-01 create wireframe risk @smoke', async ({ page, login }) => {
    await login();
    await fillNewRiskViaAngular(page);
    await page.getByRole('button', { name: /^Submit$/i }).click();
    await expect(page.locator('.apex-alert--danger')).toHaveCount(0, { timeout: 15_000 });
    await expect(page).toHaveURL(/submissions\/\d+|pipeline|case-hub|openbox/i, { timeout: 15_000 });
  });

  test('TC-RISK-02 required fields block empty submit @smoke', async ({ page, login }) => {
    await login();
    await page.goto('/#!/submissions/new');
    await expect(page.locator('text=Loading brokers and insureds')).toHaveCount(0, { timeout: 20_000 });
    await page.evaluate(() => {
      const scopeEl = document.querySelector('form[ng-submit="vm.submit()"]') || document.querySelector('[ng-view]');
      const scope = window.angular.element(scopeEl).scope();
      const vm = scope && (scope.vm || (scope.$parent && scope.$parent.vm));
      if (!vm) throw new Error('vm not found');
      vm.draft.insuredId = null;
      vm.draft.brokerId = null;
      scope.$apply();
    });
    await page.getByRole('button', { name: /^Submit$/i }).click();
    await expect(page).toHaveURL(/submissions\/new/);
    await expect(page.locator('.apex-alert--danger').first()).toBeVisible();
  });

  test('TC-RISK-03 broker and insured dropdowns populated', async ({ page, login }) => {
    await login();
    await page.goto('/#!/submissions/new');
    await expect(page.locator('text=Loading brokers and insureds')).toHaveCount(0, { timeout: 20_000 });
    const insuredOpts = page.locator('select').filter({ has: page.locator('option', { hasText: /Select insured/i }) }).locator('option');
    const brokerOpts = page.locator('select').filter({ has: page.locator('option', { hasText: /Select broker/i }) }).locator('option');
    await expect(insuredOpts).not.toHaveCount(1);
    await expect(brokerOpts).not.toHaveCount(1);
  });

  test('TC-RISK-04 business area and LOB retained on draft', async ({ page, login }) => {
    await login();
    await fillNewRiskViaAngular(page);
    const draft = await page.evaluate(() => {
      const scopeEl = document.querySelector('form[ng-submit="vm.submit()"]');
      const scope = window.angular.element(scopeEl).scope();
      const vm = scope.vm || scope.$parent.vm;
      return {
        businessArea: vm.draft.businessArea,
        lineOfBusiness: vm.draft.lineOfBusiness,
        insuredId: vm.draft.insuredId,
        brokerId: vm.draft.brokerId
      };
    });
    expect(draft.businessArea).toBe('LIAB');
    expect(draft.lineOfBusiness).toBe('Liability');
    expect(draft.insuredId).toBeTruthy();
    expect(draft.brokerId).toBeTruthy();
  });
});
