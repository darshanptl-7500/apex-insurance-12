# Technology Stack

**Analysis Date:** 2026-08-13

## Languages

**Primary:**
- C# (`LangVersion: latest`, targeting .NET 10 language features) — all 9 `src/` projects and 2 `tests/` projects, e.g. `src/ApexInsurance.Api/ApexInsurance.Api.csproj`, `src/ApexInsurance.Domain/ApexInsurance.Domain.csproj`
- TypeScript ~3.5.3 — `web/apex-ng8/src` (Angular 8.2.14 CLI app), see `web/apex-ng8/package.json`, `web/apex-ng8/tsconfig.json`

**Secondary:**
- JavaScript (ES5/ES6, unbundled) — legacy AngularJS shell `web/apex-shell/app/**/*.js` (controllers, services, directives loaded via `<script>` tags, no build step)
- JavaScript (Node.js, CommonJS) — `web/serve-hybrid.js` (hand-written static file host, no framework)
- T-SQL — hand-maintained schema/seed scripts in `database/*.sql` (no EF Core Migrations project exists)
- JavaScript (Playwright specs) — `tests/e2e/specs/*.spec.js`

## Runtime

**Environment:**
- .NET SDK 10.0 (`dotnet --version` reports `10.0.302` in this environment; no `global.json` pins a specific SDK version)
- Node.js — required range `>=10.9.0 <13.0.0` declared in `web/apex-ng8/package.json` `engines` (legacy Angular CLI 8 constraint); `web/serve-hybrid.js` and `web/package.json` (no engines field) run under whatever Node is on PATH
- Browser runtime — hybrid single-origin SPA served on `http://localhost:4200` (AngularJS shell + Angular 8 islands), API on `http://localhost:52840` (`src/ApexInsurance.Api/Program.cs:34`)

**Package Manager:**
- NuGet for all .NET projects — no central package management file (`Directory.Packages.props`) detected; versions pinned per-`.csproj`
- npm for both frontend projects
  - `web/apex-ng8/package-lock.json` — present
  - `tests/e2e/package-lock.json` — present
  - `web/package.json` (hybrid host) — no dependencies, no lockfile needed (zero npm deps, uses only Node built-ins `http`, `fs`, `path`, `url`)
  - `web/apex-shell` — no `package.json`; AngularJS and ag-Grid are loaded directly from CDN in `web/apex-shell/index.html` (no local install, no lockfile)

## Frameworks

**Core:**
- ASP.NET Core (Microsoft.NET.Sdk.Web) on .NET 10.0 — `src/ApexInsurance.Api/ApexInsurance.Api.csproj`; minimal hosting model in `src/ApexInsurance.Api/Program.cs`
- Entity Framework Core 10.0.0 (`Microsoft.EntityFrameworkCore.SqlServer`, `Microsoft.EntityFrameworkCore.Relational`) — `src/ApexInsurance.Data/ApexInsurance.Data.csproj`; DbContext-only, no `Migrations/` folder — schema lives in `database/*.sql`
- Angular 8.2.14 (`@angular/core`, `common`, `forms`, `router`, etc., all pinned `~8.2.14`) — `web/apex-ng8/package.json`, feature modules under `web/apex-ng8/src/app/features/{dashboard,case-hub,modelling,reporting,admin,login}`
- AngularJS 1.6.9 (loaded via `https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js` + `angular-route` + `angular-animate`) — `web/apex-shell/index.html:103-105`, the legacy shell app (`ng-app="apexApp"`)
- RxJS ~6.4.0, zone.js ~0.9.1, tslib ^1.10.0 — Angular 8 runtime deps, `web/apex-ng8/package.json`

**Testing:**
- xUnit 2.9.3 (+ `xunit.runner.visualstudio` 3.1.4, `coverlet.collector` 6.0.4, `Microsoft.NET.Test.Sdk` 17.14.1) — `tests/ApexInsurance.Api.Tests/ApexInsurance.Api.Tests.csproj`, `tests/ApexInsurance.Services.Tests/ApexInsurance.Services.Tests.csproj` (only 2 test files total, smoke-level coverage per `.planning/RISKS.md`)
- Playwright `@playwright/test` ^1.49.1 — `tests/e2e/package.json`, config `tests/e2e/playwright.config.js`, 10 spec files under `tests/e2e/specs/` (~60 tests)
- No Angular unit-test runner configured beyond the CLI default (`ng test` script exists in `web/apex-ng8/package.json` but no Karma/Jasmine config files were found beyond CLI defaults, and no test specs were located under `web/apex-ng8/src`)

**Build/Dev:**
- Angular CLI ~8.3.29 + `@angular-devkit/build-angular` ~0.803.29 — builds `web/apex-ng8` into `web/apex-shell/ng8/` (see `web/apex-ng8/angular.json`, `outputPath: "../apex-shell/ng8"`, `baseHref: "/ng8/"`)
- TypeScript ~3.5.3, TSLint ~5.15.0, Codelyzer ^5.0.0 — Angular 8 lint/build toolchain, `web/apex-ng8/package.json`
- Custom Node static server `web/serve-hybrid.js` — stitches the AngularJS shell and built Angular 8 bundle onto one origin/port; no bundler/framework (raw `http` module)
- MSBuild / `dotnet build` via `ApexInsurance.sln` (Visual Studio format version 12.00) — standard .NET build, no custom MSBuild targets detected

## Key Dependencies

**Critical:**
- `Microsoft.EntityFrameworkCore.SqlServer` 10.0.0 — sole data-access path to SQL Server; `src/ApexInsurance.Data/ApexInsurance.Data.csproj`, `src/ApexInsurance.Api/ApexInsurance.Api.csproj`
- `Microsoft.AspNetCore.Mvc.NewtonsoftJson` 10.0.0 — API request/response serialization (Newtonsoft, not `System.Text.Json`), configured in `src/ApexInsurance.Api/Program.cs:42-46`
- `RabbitMQ.Client` 6.8.1 — used by `src/ApexInsurance.Data.OpenBox/OpenBoxIntegrationBus.cs` to simulate the stubbed "Open Box" legacy PAS integration; gated by config, falls back to an in-memory bus when disabled/unreachable

**Infrastructure:**
- `Microsoft.Extensions.Configuration.Abstractions` / `Microsoft.Extensions.Logging.Abstractions` 10.0.0 — `src/ApexInsurance.Data.OpenBox/ApexInsurance.Data.OpenBox.csproj`
- `ag-grid-community` 31.3.4 — loaded from `https://cdn.jsdelivr.net` in `web/apex-shell/index.html:101-102` (grid UI in the legacy shell, not npm-installed)

## Configuration

**Environment:**
- ASP.NET Core standard configuration layering: `appsettings.json` → `appsettings.Development.json` → environment variables (no `.env` files used on the backend)
- Key configs required (see `src/ApexInsurance.Api/appsettings.json`):
  - `ConnectionStrings:ApexInsurance` — SQL Server connection string (currently a committed live-looking Azure SQL credential — flagged in `.planning/RISKS.md` item 1; must move to environment variable / secrets manager)
  - `Apex:Documents:RootPath`, `Apex:Documents:MaxUploadSizeBytes`, `Apex:Documents:AllowedExtensions` — document storage config
  - `Apex:Auth:TokenSigningKey`, `Apex:Auth:TokenLifetimeMinutes`, `Apex:Auth:Issuer` — present but unused (demo bearer tokens are unsigned Base64 JSON, see `src/ApexInsurance.Security/DemoTokenService.cs`)
  - `Apex:Cors:AllowedOrigins` — comma-separated allowed origins, defaults to `http://localhost:4200,http://localhost:4201`
  - `Apex:RabbitMQ:*` (Enabled, Host, Port, Username, Password, VirtualHost, Exchange, RoutingKey, Queue, PartyRoutingKey, PartyQueue) — messaging config
  - `DocumentStoragePath`, `AllowedHosts`, `Logging:LogLevel:*`
- Frontend runtime config via plain JS globals, not env vars: `window.APEX_CONFIG` in `web/apex-shell/config.js` (`apiBaseUrl`, `ng8BaseUrl`, demo account list) and `web/apex-ng8/src/environments/environment.ts` / `environment.prod.ts` (Angular file-replacement pattern)

**Build:**
- `ApexInsurance.sln` — solution file referencing all 9 `src/` and 2 `tests/` `.csproj` files
- `web/apex-ng8/angular.json`, `web/apex-ng8/tsconfig*.json` — Angular CLI build config
- `tests/e2e/playwright.config.js` — Playwright config, reads `APEX_UI_URL` (default `http://localhost:4200`) and `APEX_API_URL` (default `http://localhost:52840`) from env

## Platform Requirements

**Development:**
- .NET 10 SDK
- Node.js in the `>=10.9.0 <13.0.0` range for `apex-ng8` builds (legacy Angular 8 CLI constraint); a separate/newer Node install is fine for the zero-dependency `serve-hybrid.js` host and Playwright
- SQL Server reachable via the configured connection string (local SQL Server/Express, Docker, or Azure SQL) — schema bootstrapped by hand-running `database/01_CreateSchema.sql` through `database/05_WorkbenchDepth.sql`
- Optional: Docker (for RabbitMQ) via `docker-compose.rabbitmq.yml` (`rabbitmq:3.13-management` image, ports 5672/15672) — only needed if `Apex:RabbitMQ:Enabled=true`; the app runs fine without it (in-memory bus fallback)

**Production:**
- No deployment target configured — no Dockerfile, Kubernetes manifests, Azure/AWS deployment configs, or CI/CD pipeline (`.github/workflows`, `azure-pipelines.yml`, `Jenkinsfile`) were found anywhere in the repo
- `src/ApexInsurance.Api/Program.cs:34` hardcodes `http://localhost:52840` as the listen URL — not currently parameterized for other environments

---

*Stack analysis: 2026-08-13*
