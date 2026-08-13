# Domain Knowledge

**Extracted**: 2026-08-13
**Project**: Apex Insurance — UW Underwriting Workbench
**Documentation files**: 4

---

## Project Purpose

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
  serve-hybrid.js           # Single-origin static host (port 420

[... see README.md for full description ...]

---

## Documentation Index

- `docs/E2E-TEST-CASES.md`
- `docs/UNDERWRITING-WORKBENCH-FUNCTIONAL-REQUIREMENTS.md`
- `docs/UNDERWRITING-WORKBENCH-UI-SPEC.md`
- `docs/UW-SOLUTION-MAP.md`

---

## Notes for AI agents

1. Use project terminology consistently (see README for defined terms)
2. Maintain documentation when implementing features (doc-updater agent)
3. Update docs/ index when adding new documentation

---
*Regenerate with: `/rapidx:learn --docs` or `node scripts/learn-codebase.js --docs`*
