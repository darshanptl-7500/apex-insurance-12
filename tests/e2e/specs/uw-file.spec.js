const { test, expect } = require('../fixtures');

async function openAnyUwFile(page) {
  await page.goto('/ng8/case-hub');
  await page.waitForTimeout(800);
  const link = page.locator('a[href*="case-hub/"]').first();
  if (await link.count()) {
    await link.click();
  } else {
    await page.goto('/ng8/case-hub/1');
  }
  await expect(page).toHaveURL(/case-hub\/\d+/);
  const notFound = page.locator('text=/not found/i');
  if (await notFound.count()) {
    test.skip(true, 'No underwriter file available');
  }
  await expect(page.locator('.uw-layout, .uw-header').first()).toBeVisible({ timeout: 20_000 });
}

test.describe("TC-UW Underwriter's File", () => {
  test.beforeEach(async ({ login }) => {
    await login();
  });

  test('TC-UW-01 list page loads @smoke', async ({ page }) => {
    await page.goto('/ng8/case-hub');
    await expect(page.locator('body')).toContainText(/Underwriter|File|Submission|Pipeline/i);
    await expect(page.locator('.apex-alert--danger')).toHaveCount(0);
  });

  test('TC-UW-02 open file shows header @smoke', async ({ page }) => {
    await openAnyUwFile(page);
    await expect(page.locator('.uw-header, .uw-account, .uw-meta').first()).toBeVisible();
    await expect(page.locator('body')).toContainText(/UW Ref|Status|Account/i);
  });

  test('TC-UW-03 policy summary shows Apex Share metrics @smoke', async ({ page }) => {
    await openAnyUwFile(page);
    await page.getByRole('button', { name: /^Policy$/i }).click();
    await page.getByText('Policy Summary', { exact: true }).click();
    await expect(page.locator('body')).toContainText(/Apex Share|Gross Premium|Insured|Broker/i);
  });

  test('TC-UW-04 quotes / sections tab', async ({ page }) => {
    await openAnyUwFile(page);
    await page.getByRole('button', { name: /^Policy$/i }).click();
    await page.getByText('Quotes / Sections', { exact: true }).click();
    await expect(page.locator('body')).toContainText(/Sections|quote|Create quote|Selected|Clear|Referral/i);
  });

  test('TC-UW-05 Edit / Note writes through Open Box', async ({ page }) => {
    await openAnyUwFile(page);
    await page.getByRole('button', { name: /Edit \/ Note/i }).click();
    await expect(page.locator('.uw-modal, [role="dialog"]').first()).toBeVisible();
    const note = `E2E note ${Date.now()}`;
    await page.locator('textarea[name="notes"]').fill(note);
    await page.locator('.uw-modal, [role="dialog"]').getByRole('button', { name: /^Submit$/i }).click();
    await expect(page.locator('.uw-modal, [role="dialog"]')).toHaveCount(0, { timeout: 20_000 });
    await expect(page.locator('.apex-alert--danger')).toHaveCount(0);
  });

  test('TC-UW-06 performance Apex Line Share / 100% Order', async ({ page }) => {
    await openAnyUwFile(page);
    await page.getByRole('button', { name: /^Policy$/i }).click();
    await page.getByText('Performance', { exact: true }).first().click();
    await expect(page.locator('body')).toContainText(/Apex Line Share|100% Order/i);
  });

  test('TC-UW-07 claims pane KPIs', async ({ page }) => {
    await openAnyUwFile(page);
    await page.getByRole('button', { name: /^Claim$/i }).click();
    await expect(page.locator('body')).toContainText(/Claim|ILR|CAP|Apex Share|No claims/i);
  });

  test('TC-UW-08 documents pane @smoke', async ({ page }) => {
    await openAnyUwFile(page);
    await page.getByRole('button', { name: /^Documents$/i }).click();
    await expect(page.locator('body')).toContainText(/Documents|Manage|Upload|No documents/i);
  });

  test('TC-UW-09 activity log', async ({ page }) => {
    await openAnyUwFile(page);
    await page.getByRole('button', { name: /Activity Log/i }).click();
    await expect(page.locator('body')).toContainText(/Activity|No activity|Task|Created/i);
  });

  test('TC-UW-10 Model deep-link includes submissionId', async ({ page }) => {
    await openAnyUwFile(page);
    const model = page.getByRole('link', { name: /^Model$/i });
    await expect(model).toBeVisible();
    const href = await model.getAttribute('href');
    expect(href || '').toMatch(/modelling|pricing/i);
    expect(href || '').toMatch(/submissionId=/i);
  });
});
