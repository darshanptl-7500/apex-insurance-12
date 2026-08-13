# Architecture Decision Record Index

**Scanned**: 2026-08-13
**Locations checked**: `docs/adr/`, `docs/decisions/`, `architecture/decisions/`, `decisions/` — none exist in this repository. `ApexInsurance.sln` has no ADR tooling wired up either.

| # | Title | Status | Date | Key Decision |
|---|-------|--------|------|-------------|
| — | *No ADRs recorded* | — | — | — |

## Recommended first ADRs

No decisions have been formally ratified yet. Based on the architecture analysis (`.rapidx/knowledge/architecture.md`) and the existing risk register (`.planning/RISKS.md` item 10), these two are the highest-value candidates to write first — both capture decisions that are already true in the code but invisible to anyone who hasn't read the source:

1. **"Open Box is an intentional in-process stub, not a real integration"** — covers `ApexInsurance.Data.OpenBox` (`LocalOpenBoxGateway`, `OpenBoxIntegrationBus`) and why DM22/Dynamics CRM/Lloyd's-DXC/AD are out of scope.
2. **"Schema is managed by hand-written SQL scripts, not EF Core migrations"** — covers why `src/ApexInsurance.Data` has no `Migrations/` folder despite using EF Core 10, and that `database/*.sql` is the only place schema changes belong.

Use `/rapidx:adr` to draft these.

---
*Regenerate with: `/rapidx:learn-arch`*
