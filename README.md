# Apex Insurance — UW Underwriting Workbench

Demo / training platform for the Apex **UW (Underwriting Workbench)**: a single underwriter workbench that unifies submissions, quoting, policy, claims, documents, and performance MI.

## Stack

| Layer | Technology |
| --- | --- |
| Hybrid UI | **One app on port 4200** (single nav; AngularJS + Angular 8 behind the scenes) |
| API | ASP.NET Core on **.NET 10** — port 52840 |
| ORM | Entity Framework Core 10 |
| Database | Microsoft SQL Server (Azure SQL configured for Mac/cross-platform) |

## Prerequisites (Mac)

1. [.NET 10 SDK](https://dotnet.microsoft.com/download)
2. Network access to the configured SQL Server (default connection string in `appsettings.json`)
3. **Node.js 12** (via nvm) to build the Angular 8 islands once

## Solution layout

```
ApexInsurance.sln
src/                        # .NET 10 API + libraries
database/                   # MSSQL schema + seed
web/
  serve-hybrid.js           # Single-origin static host (port 4200)
  apex-shell/               # Portal shell + static host for /ng8 build
  apex-ng8/                 # Source for Dashboard, Case Hub, Modelling, Reports, Admin
```

## Run the web app

```bash
# Terminal 1 — API
dotnet run --project src/ApexInsurance.Api

# Terminal 2 — UI (Node 12 for the Angular 8 build)
cd web
nvm use 12
npm run build:ng8    # first time / after ng8 changes
npm start            # http://localhost:4200
```

Open **http://localhost:4200/#!/login** — `uw1` / `Password1!`

The sidebar is one product menu. Two frameworks still power different screens under the hood (AngularJS for submissions/policies/claims/…, Angular 8 for dashboard/case hub/…); that is an implementation detail, not something shown in the UI.
## Database setup

If you need a fresh database, run in order against SQL Server (Azure Data Studio / sqlcmd):

1. `database/01_CreateSchema.sql`
2. `database/02_SeedData.sql`

Optional: `database/03_SampleQueries.sql`

Connection string name: **`ApexInsurance`** (see `src/ApexInsurance.Api/appsettings.json`).

> Rotate the SQL credentials in `appsettings.json` if this repo is shared; they were carried forward from the legacy `Web.config`.

## Run the API (Mac / Windows / Linux)

```bash
dotnet restore
dotnet run --project src/ApexInsurance.Api
```

API listens on **http://localhost:52840/** (same port the Angular apps already call).

Smoke-check login:

```bash
curl -s -X POST http://localhost:52840/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"uw1","password":"Password1!"}'
```

## Demo users

| Username | Password | Role |
| --- | --- | --- |
| admin | Password1! | Admin |
| uw1 | Password1! | Underwriter |
| mgr1 | Password1! | Underwriting Manager |
| cl1 | Password1! | Claims Handler |

## Modules

**MVP:** Auth & roles, underwriter workbench, submissions, table-based rating & quoting, policy admin, documents, claims (light), broker/insured CRM-lite.

**Phase 2:** Authority rules, exposure/modelling views, workflow & referrals, reporting/MI, admin reference data, audit/compliance.

Details: [web/README.md](web/README.md)

## E2E tests

Manual + automated cases: [docs/E2E-TEST-CASES.md](docs/E2E-TEST-CASES.md)  
Playwright runner: [tests/e2e/README.md](tests/e2e/README.md)

