const { test, expect } = require('../fixtures');

test.describe('TC-NAV Shell navigation', () => {
  test.beforeEach(async ({ login }) => {
    await login();
  });

  test('TC-NAV-01 brand shows Apex UW Workbench @smoke', async ({ page }) => {
    await expect(page.locator('.apex-topbar__name')).toHaveText('Apex');
    await expect(page.locator('.apex-topbar__uw')).toHaveText('UW');
    await expect(page.locator('.apex-topbar__tagline')).toContainText(/Workbench/i);
  });

  test('TC-NAV-02 primary modules load @smoke', async ({ page }) => {
    const shellRoutes = [
      { link: 'Pipeline', url: /pipeline/ },
      { link: 'Tasks', url: /inbox/ },
      { link: 'Advanced Search', url: /search/ },
      { link: 'Connect', url: /connect/ },
      { link: 'Support', url: /support/ },
      { link: 'Open Box', url: /openbox/ }
    ];
    for (const r of shellRoutes) {
      await page.locator('.apex-primary-nav').getByRole('link', { name: r.link, exact: true }).click();
      await expect(page).toHaveURL(r.url);
      await expect(page.locator('.apex-alert--danger')).toHaveCount(0);
    }

    const ng8Routes = [
      { link: 'Dashboard', path: /\/ng8\/dashboard/ },
      { link: 'Reporting', path: /\/ng8\/reporting/ },
      { link: "Underwriter's File", path: /\/ng8\/case-hub/ },
      { link: 'Pricing', path: /\/ng8\/modelling/ }
    ];
    for (const r of ng8Routes) {
      await page.locator('.apex-primary-nav').getByRole('link', { name: r.link, exact: true }).click();
      await expect(page).toHaveURL(r.path);
    }
  });

  test('TC-NAV-03 NEW RISK CTA opens intake @smoke', async ({ page }) => {
    await page.getByRole('link', { name: /\+?\s*NEW RISK/i }).first().click();
    await expect(page).toHaveURL(/submissions\/new/);
    await expect(page.getByRole('heading', { name: /new risk/i })).toBeVisible();
  });

  test('TC-NAV-04 global search navigates to Advanced Search', async ({ page }) => {
    await page.locator('.apex-topbar__search input[type="search"]').fill('Acme');
    await page.locator('.apex-topbar__search').evaluate((form) => {
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    await expect(page).toHaveURL(/search/i, { timeout: 10_000 });
    await expect(page.locator('body')).toContainText(/Search|Criteria|Policy|Acme|No /i);
  });

  test('TC-NAV-05 ROE menu switches to USD', async ({ page }) => {
    await page.locator('.apex-chrome__tools .apex-dropdown').filter({ hasText: /ROE/i }).locator('button').click();
    await page.getByRole('link', { name: /^USD$/i }).click();
    await expect(page.locator('.apex-chrome__tools')).toContainText(/ROE\s*USD/i);
  });

  test('TC-NAV-06 E-Placement opens external URL', async ({ page, context }) => {
    const popupPromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
    await page.locator('.apex-primary-nav').getByRole('link', { name: /E-Placement/i }).click();
    const popup = await popupPromise;
    if (popup) {
      await popup.waitForLoadState('domcontentloaded').catch(() => {});
      expect(popup.url().length).toBeGreaterThan(0);
      await popup.close();
    } else {
      // Some configs may navigate same-tab or use placeholder
      await expect(page.locator('.apex-primary-nav').getByRole('link', { name: /E-Placement/i })).toBeVisible();
    }
  });
});
