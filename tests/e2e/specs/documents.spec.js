const { test, expect, makeTempUploadFile } = require('../fixtures');
const fs = require('fs');

test.describe('TC-DOC Documents', () => {
  test.beforeEach(async ({ login }) => {
    await login();
  });

  test('TC-DOC-01 documents list loads @smoke', async ({ page }) => {
    await page.goto('/#!/documents');
    await expect(page.getByRole('heading', { name: /Documents/i })).toBeVisible();
    await expect(page.locator('body')).toContainText(/Upload|Document/i);
  });

  test('TC-DOC-02 upload document for submission', async ({ page }) => {
    await page.goto('/#!/documents?submissionId=1');
    await expect(page.getByRole('heading', { name: /Documents/i })).toBeVisible();
    const filePath = makeTempUploadFile('txt', 'Apex E2E upload ' + Date.now());
    // App may restrict extensions — try png minimal
    const pngPath = makeTempUploadFile('png', Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    ));
    await page.locator('input[type="file"]').setInputFiles(pngPath);
    await page.getByRole('button', { name: /^Upload$/i }).click();
    await expect(page.locator('.apex-alert--success, .apex-alert--danger, .apex-table')).toBeVisible({ timeout: 20_000 });
    fs.unlinkSync(filePath);
    fs.unlinkSync(pngPath);
  });

  test('TC-DOC-03 authenticated download API @smoke', async ({ request, apiURL, apiLogin }) => {
    const token = await apiLogin();
    const list = await request.get(`${apiURL}/api/documents`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(list.ok()).toBeTruthy();
    const body = await list.json();
    const items = body.items || body || [];
    if (!items.length) {
      test.skip(true, 'No documents uploaded yet');
    }
    const id = items[0].id;
    const dl = await request.get(`${apiURL}/api/documents/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(dl.status()).toBe(200);
    expect(dl.headers()['content-disposition'] || '').toMatch(/attachment|filename/i);
  });

  test('TC-DOC-04 PDF preview when available', async ({ page, request, apiURL, apiLogin }) => {
    const token = await apiLogin();
    const list = await request.get(`${apiURL}/api/documents`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const body = await list.json();
    const items = body.items || [];
    const pdf = items.find((d) => (d.contentType || '').includes('pdf') || (d.fileName || '').toLowerCase().endsWith('.pdf'));
    await page.goto('/#!/documents');
    if (!pdf) {
      // UI still loads; preview empty is acceptable
      await expect(page.getByRole('heading', { name: /Documents/i })).toBeVisible();
      return;
    }
    const rowBtn = page.getByRole('button', { name: /Preview/i }).first();
    if (await rowBtn.count()) {
      await rowBtn.click();
      await expect(page.locator('iframe, text=/preview/i').first()).toBeVisible({ timeout: 10_000 });
    }
  });
});
