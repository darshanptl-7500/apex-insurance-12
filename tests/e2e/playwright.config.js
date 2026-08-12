// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const baseURL = process.env.APEX_UI_URL || 'http://localhost:4200';
const apiURL = process.env.APEX_API_URL || 'http://localhost:52840';

module.exports = defineConfig({
  testDir: './specs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    extraHTTPHeaders: {
      // Used by API helper requests from fixtures
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  metadata: { apiURL }
});
