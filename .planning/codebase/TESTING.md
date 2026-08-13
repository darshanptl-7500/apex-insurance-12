# Testing Patterns

**Analysis Date:** 2026-08-13

## Test Framework

**Runner:**
- xUnit 2.9.3 (`Microsoft.NET.Test.Sdk` 17.14.1, `xunit.runner.visualstudio` 3.1.4) for `.NET 10` backend tests.
- Config: no central `xunit.runner.json`; settings come entirely from each test project's `.csproj` — `tests/ApexInsurance.Api.Tests/ApexInsurance.Api.Tests.csproj` and `tests/ApexInsurance.Services.Tests/ApexInsurance.Services.Tests.csproj`. Both set `<TargetFramework>net10.0</TargetFramework>`, `<Nullable>enable</Nullable>`, `<ImplicitUsings>enable</ImplicitUsings>` and add a global `<Using Include="Xunit" />` so test files don't need `using Xunit;` (note: current test files still include it explicitly, e.g. `tests/ApexInsurance.Api.Tests/UwStructureSmokeTests.cs:9`).
- Playwright `^1.49.1` for E2E, config at `tests/e2e/playwright.config.js`.

**Assertion Library:**
- xUnit's built-in `Assert` class (`Assert.Equal`, `Assert.True`, `Assert.Contains`, `Assert.Throws<T>`, `Assert.NotNull`) — no FluentAssertions or Shouldly referenced.
- Playwright's built-in `expect` from `@playwright/test`, re-exported through `tests/e2e/fixtures.js:2-3`.

**Run Commands:**
```bash
dotnet test                                              # Run all xUnit tests (both test projects, from repo root)
dotnet test tests/ApexInsurance.Api.Tests                # Run one test project
dotnet test --collect:"XPlat Code Coverage"              # Coverage via coverlet.collector (already referenced in both .csproj files)
cd tests/e2e && npm test                                 # Run all Playwright E2E specs (playwright test)
cd tests/e2e && npm run test:smoke                       # Run only @smoke-tagged E2E tests (playwright test --grep @smoke)
cd tests/e2e && npm run test:ui                          # Playwright UI mode (interactive/watch-like)
cd tests/e2e && npm run report                           # Open the last HTML report
```
No `dotnet watch test` script or npm watch-mode script is defined for the backend; watch mode is only available ad hoc via `dotnet watch test`.

## Test File Organization

**Location:**
- Backend: fully separate test projects under `tests/`, not co-located with `src/` — `tests/ApexInsurance.Api.Tests/` (references `ApexInsurance.Api`, `ApexInsurance.Services.Contracts`, `ApexInsurance.Dto`, `ApexInsurance.UI`, `ApexInsurance.Data.OpenBox`) and `tests/ApexInsurance.Services.Tests/` (references `ApexInsurance.Services`, `ApexInsurance.Security`, `ApexInsurance.Shared`, `ApexInsurance.Dto`, `ApexInsurance.Domain`).
- E2E: `tests/e2e/specs/*.spec.js`, with shared fixtures in `tests/e2e/fixtures.js` one level up from `specs/`.

**Naming:**
- Backend test classes are suffixed `Tests` or `SmokeTests`: `UwStructureSmokeTests`, `SecuritySmokeTests`, `SharedSmokeTests` — the latter two both live in one file, `tests/ApexInsurance.Services.Tests/SecurityAndSharedSmokeTests.cs`, grouped by the layer they smoke-test rather than 1:1 with a source class.
- Test methods use descriptive PascalCase sentences with underscores separating subject from behavior: `ApiAssembly_ExposesPipelineAndSupportControllers`, `DemoTokenService_IssuesAndValidatesToken`, `Guard_NotNull_ThrowsOnNull`.
- E2E spec files are kebab-case matching the feature area: `auth.spec.js`, `pipeline-and-risk.spec.js`, `mi-policies-claims.spec.js`, `openbox-support.spec.js`. Inside each spec, `test.describe('TC-<AREA> <Name>', ...)` groups tests under a traceable test-case-ID prefix (`TC-AUTH`), and individual tests are named `'TC-AUTH-01 valid login as uw1 @smoke'` — ID + description + optional `@smoke` tag.

**Structure:**
```
tests/
  ApexInsurance.Api.Tests/
    UwStructureSmokeTests.cs
    ApexInsurance.Api.Tests.csproj
  ApexInsurance.Services.Tests/
    SecurityAndSharedSmokeTests.cs   (contains SecuritySmokeTests + SharedSmokeTests classes)
    ApexInsurance.Services.Tests.csproj
  e2e/
    fixtures.js
    playwright.config.js
    package.json
    specs/
      auth.spec.js
      connect.spec.js
      documents.spec.js
      mi-policies-claims.spec.js
      nav.spec.js
      openbox-support.spec.js
      pipeline-and-risk.spec.js
      search.spec.js
      tasks.spec.js
      uw-file.spec.js
```

## Test Structure

**Suite Organization:**
```csharp
// tests/ApexInsurance.Services.Tests/SecurityAndSharedSmokeTests.cs
namespace ApexInsurance.Services.Tests
{
    public class SecuritySmokeTests
    {
        [Fact]
        public void DemoTokenService_IssuesAndValidatesToken()
        {
            var svc = new DemoTokenService();
            var user = new User { Id = 42, Username = "uw1", Role = UserRole.Underwriter, Email = "uw1@apex.test", FullName = "Uma Underwriter", IsActive = true };

            var token = svc.IssueToken(user);
            Assert.False(string.IsNullOrWhiteSpace(token));
            Assert.True(svc.IsValid(token));

            var payload = svc.DecodeToken(token);
            Assert.NotNull(payload);
            Assert.Equal(42, payload.UserId);
        }
    }
}
```

**Patterns:**
- Setup: no `[Fact]`-level fixtures, `IClassFixture<T>`, constructor-based setup, or in-memory DbContext found — every test constructs its own plain-object subject directly inside the test method (`new DemoTokenService()`, `new User { ... }`). No test currently touches EF Core or a database.
- Teardown: none needed/observed — no `IDisposable` test classes, no `IAsyncLifetime`.
- Assertion: single logical behavior per test, arrange/act/assert inline without explicit comment headers; multiple related `Assert` calls per test are normal (e.g. 4 asserts in `DemoTokenService_IssuesAndValidatesToken`).
- No `[Theory]`/`[InlineData]` usage anywhere in the current suite — every test is a `[Fact]`. All 8 backend test cases are `[Fact]`s split across the two smoke-test files.

## Mocking

**Framework:** None detected — no Moq, NSubstitute, or FakeItEasy package reference in either test `.csproj`.

**Patterns:**
```csharp
// None found. Current tests exercise concrete classes directly
// (e.g. new DemoTokenService(), typeof(...).Assembly reflection checks)
// rather than mocking dependencies.
```

**What to Mock:**
- Not yet established by precedent — no service-layer test mocks `IUnitOfWork` or any repository today. If adding tests for `PolicyService`/`RatingService`, introducing Moq for `IUnitOfWork` (and its per-entity repository properties) would be the natural next step, matching the constructor-injection style already used throughout `src/ApexInsurance.Services`.

**What NOT to Mock:**
- Pure/stateless helpers like `Guard` (`src/ApexInsurance.Shared/Guard.cs`) and `DemoTokenService` (`src/ApexInsurance.Security/DemoTokenService.cs`) are tested directly, unmocked — they have no external dependencies, so real instances are used as-is.

## Fixtures and Factories

**Test Data:**
```javascript
// tests/e2e/fixtures.js
const USERS = {
  uw1: { username: 'uw1', password: 'Password1!' },
  admin: { username: 'admin', password: 'Password1!' },
  mgr1: { username: 'mgr1', password: 'Password1!' },
  bro1: { username: 'bro1', password: 'Password1!' },
  cl1: { username: 'cl1', password: 'Password1!' }
};

const test = base.extend({
  demo: async ({}, use) => { await use(USERS.uw1); },
  users: async ({}, use) => { await use(USERS); },
  apiURL: async ({}, use) => { await use(API); },
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
  apiLogin: async ({ request, apiURL }, use) => { /* logs in via POST /api/auth/login, returns token */ }
});
```
Playwright's `test.extend()` fixture pattern provides reusable `login`, `clearSession`, and `apiLogin` fixtures plus a shared `USERS` map of demo credentials (all `Password1!`, matching the demo-password fallback in `src/ApexInsurance.Services/Auth/AuthService.cs`). A helper `fillNewRiskViaAngular(page)` (`tests/e2e/fixtures.js:61-87`) reaches into the AngularJS `$scope`/`vm` directly via `page.evaluate` to fill a form the hybrid shell renders — needed because the legacy AngularJS submission form isn't easily drivable through plain DOM locators.

**Location:**
- All shared E2E fixtures/helpers live in the single `tests/e2e/fixtures.js` file, imported by every spec (`const { test, expect, USERS } = require('../fixtures');`). No per-spec fixture files or `test-data/` directory. No backend equivalent (no `TestDataBuilder`/`ObjectMother` classes found in either xUnit project).

## Coverage

**Requirements:** None enforced — no coverage threshold configured in any `.csproj`, `.runsettings`, or CI config (there is no CI at all; see `.planning/RISKS.md` item 5). `coverlet.collector` is referenced in both test projects but only to make `--collect:"XPlat Code Coverage"` possible, not to gate a minimum percentage.

**View Coverage:**
```bash
dotnet test --collect:"XPlat Code Coverage"    # produces coverage.cobertura.xml under TestResults/<guid>/
```

## Test Types

**Unit Tests:**
- Currently smoke-level only, ~8 test cases total across `tests/ApexInsurance.Api.Tests/UwStructureSmokeTests.cs` (4 tests — reflection/assembly-shape checks confirming controllers, contracts, view models, and the OpenBox gateway are wired up) and `tests/ApexInsurance.Services.Tests/SecurityAndSharedSmokeTests.cs` (4 tests — `DemoTokenService` issue/validate/reject, `Guard.NotNull`/`Guard.NotBlank`). No business-logic unit tests exist yet for `PolicyService`, `RatingService`, authority/referral rules, pipeline, or workflow state machines — per `.planning/RISKS.md` item 7, correctness there currently relies entirely on the Playwright E2E suite.

**Integration Tests:**
- None found — no `WebApplicationFactory<TStartup>`-based tests, no test that spins up the ASP.NET Core pipeline or hits a real/in-memory database. The "integration" surface today is effectively covered by E2E tests running against a live API + UI instead.

**E2E Tests:**
- Playwright, ~60 tests across the 10 spec files listed above under `tests/e2e/specs/`. Tests target a hybrid AngularJS(legacy)/Angular 8 UI via `baseURL` (default `http://localhost:4200`) and, for `apiLogin`, the API directly via `apiURL` (default `http://localhost:52840`) — both overridable via `APEX_UI_URL`/`APEX_API_URL` env vars in `tests/e2e/playwright.config.js`. Tests are tagged `@smoke` for the subset run by `npm run test:smoke`. Config runs `fullyParallel: false` with `workers: 1` — the suite is intentionally sequential, not parallelized, likely because specs share the same seeded demo data/state.

## Common Patterns

**Async Testing:**
```javascript
// tests/e2e/specs/auth.spec.js
test('TC-AUTH-01 valid login as uw1 @smoke', async ({ page, login }) => {
  await login(USERS.uw1);
  await expect(page.locator('.apex-topbar__username')).toBeVisible();
  await expect(page.locator('.apex-topbar__role')).toContainText(/Underwriter/i);
  await expect(page).toHaveURL(/pipeline/i);
});
```
Every Playwright test is `async ({ page, ... fixtures }) => { ... }`, awaiting each `page` action/assertion; fixtures like `login` and `clearSession` are themselves `async` functions injected by `test.extend()`.

**Error Testing:**
```csharp
// tests/ApexInsurance.Services.Tests/SecurityAndSharedSmokeTests.cs
[Fact]
public void Guard_NotNull_ThrowsOnNull()
{
    Assert.Throws<ArgumentNullException>(() => Guard.NotNull<object>(null!, "x"));
    Assert.Equal("ok", Guard.NotNull("ok", "x"));
}
```
```javascript
// tests/e2e/specs/auth.spec.js
test('TC-AUTH-02 invalid password stays on login @smoke', async ({ page }) => {
  await page.goto('/#!/login');
  await page.locator('#username').fill('uw1');
  await page.locator('#password').fill('WrongPassword!');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page.locator('.apex-alert--danger')).toBeVisible({ timeout: 10_000 });
  await expect(page.locator('.apex-chrome')).toHaveCount(0);
});
```
Backend error tests use `Assert.Throws<TException>(() => ...)` directly against the exception type; there is no test yet that exercises `ApiExceptionFilterAttribute`'s HTTP-status mapping end-to-end (no controller-level exception test found). E2E error tests assert on the resulting UI state (an error banner appears, navigation doesn't happen) rather than inspecting raw HTTP responses.

---

*Testing analysis: 2026-08-13*
