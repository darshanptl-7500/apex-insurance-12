const playwright = require('@playwright/test');
const base = playwright.test;
const expect = playwright.expect;
const path = require('path');
const fs = require('fs');
const os = require('os');

const API = process.env.APEX_API_URL || 'http://localhost:52840';
const USERS = {
  uw1: { username: 'uw1', password: 'Password1!' },
  admin: { username: 'admin', password: 'Password1!' },
  mgr1: { username: 'mgr1', password: 'Password1!' },
  bro1: { username: 'bro1', password: 'Password1!' },
  cl1: { username: 'cl1', password: 'Password1!' }
};

const test = base.extend({
  demo: async ({}, use) => {
    await use(USERS.uw1);
  },
  users: async ({}, use) => {
    await use(USERS);
  },
  apiURL: async ({}, use) => {
    await use(API);
  },
  login: async ({ page }, use) => {
    async function login(user = USERS.uw1) {
      await page.goto('/#!/login');
      await page.locator('#username').fill(user.username);
      await page.locator('#password').fill(user.password);
      await page.getByRole('button', { name: /sign in/i }).click();
      await expect(page.locator('.apex-chrome')).toBeVisible({ timeout: 20_000 });
    }
    await use(login);
  },
  clearSession: async ({ page, context }, use) => {
    async function clearSession() {
      await context.clearCookies();
      await page.goto('/#!/login');
      await page.evaluate(() => {
        localStorage.removeItem('apex_token');
        localStorage.removeItem('apex_user');
      });
    }
    await use(clearSession);
  },
  apiLogin: async ({ request, apiURL }, use) => {
    async function apiLogin(user = USERS.uw1) {
      const res = await request.post(`${apiURL}/api/auth/login`, {
        data: { username: user.username, password: user.password }
      });
      expect(res.ok()).toBeTruthy();
      const body = await res.json();
      return body.token;
    }
    await use(apiLogin);
  }
});

async function fillNewRiskViaAngular(page) {
  await page.goto('/#!/submissions/new');
  await expect(page.getByRole('heading', { name: /new risk/i })).toBeVisible();
  await expect(page.locator('text=Loading brokers and insureds')).toHaveCount(0, { timeout: 20_000 });
  await page.evaluate(() => {
    const scopeEl = document.querySelector('form[ng-submit="vm.submit()"]') || document.querySelector('[ng-view]');
    const scope = window.angular.element(scopeEl).scope();
    const vm = scope && (scope.vm || (scope.$parent && scope.$parent.vm));
    if (!vm) throw new Error('SubmissionCreateController scope not found');
    if (!vm.insureds || !vm.insureds.length) throw new Error('No insureds loaded');
    if (!vm.brokers || !vm.brokers.length) throw new Error('No brokers loaded');
    vm.draft.insuredId = vm.insureds[0].id;
    vm.draft.brokerId = vm.brokers[0].id;
    vm.draft.businessArea = 'LIAB';
    vm.draft.lineOfBusiness = 'Liability';
    if (!vm.draft.requestedEffectiveDate) {
      vm.draft.requestedEffectiveDate = new Date();
      vm.onInception();
    }
    if (!vm.draft.expiryDate) {
      const exp = new Date();
      exp.setFullYear(exp.getFullYear() + 1);
      vm.draft.expiryDate = exp;
    }
    scope.$apply();
  });
}

function makeTempUploadFile(ext, contents) {
  const filePath = path.join(os.tmpdir(), `apex-e2e-${Date.now()}.${ext}`);
  fs.writeFileSync(filePath, contents);
  return filePath;
}

module.exports = {
  test,
  expect,
  USERS,
  API,
  fillNewRiskViaAngular,
  makeTempUploadFile
};
