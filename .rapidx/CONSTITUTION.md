# Apex Insurance Constitution

**Version**: 1.0.0
**Ratified**: 2026-08-13
**Profile**: default (governance posture below targets `enterprise-standard` — see Governance note)
**Stack**: angular 8.2.14 · csharp 10.0 + aspnet · efcore 10.0.0 · sqlserver · xunit + playwright

---

## I. Test-Driven Development & Coverage

New and changed code ships with tests. Write the failing test first for new business logic, then implement. The current baseline is smoke-level only (`tests/ApexInsurance.Api.Tests`, `tests/ApexInsurance.Services.Tests` — 8 `[Fact]`/`[Theory]` cases total per `.planning/codebase/TESTING.md`), which is not acceptable as a permanent state.

- Target: 80%+ meaningful line/branch coverage on new and touched code (padding coverage with trivial assertions does not count).
- The **Rating**, **Authority/Referral rule**, and **Workflow** services (`ApexInsurance.Services/Rating/`, `.../Authority/`, `.../Workflow/`) currently have zero unit-level coverage despite being flagged as high-coupling hub modules in `.rapidx/knowledge/GRAPH_REPORT.md`. Backfill unit tests for these modules within the current milestone, regardless of whether a given phase touches them.
- E2E (Playwright, `tests/e2e/specs/`) stays aligned 1:1 with `docs/E2E-TEST-CASES.md`; add a `TC-*` row and a spec together, never one without the other.

**Gate**: A PR/phase that adds or changes business logic without a corresponding test fails review. A phase that touches Rating/Authority/Workflow without adding at least one new unit test fails review.
**Automated by**: `tdd-guide` agent, `code-reviewer` agent (project-specific checks section), `invariant-check` hook once seeded via `/rapidx:invariant-catalog`.

## II. Security Baseline (forward-looking)

This principle governs **new** code. It does not retroactively re-litigate the known findings in `.planning/RISKS.md` (committed SQL credential, unsigned demo auth tokens, hardcoded password fallback, query-string bearer token) — those are tracked there, not here, per an explicit decision during constitution drafting.

- No new hardcoded secrets, credentials, or connection strings in source, `appsettings*.json`, or committed SQL scripts. New configuration goes through environment variables or `dotnet user-secrets` for local dev.
- All new user input is validated at the boundary (controller/DTO level) before reaching services or the database.
- All new database access uses parameterized queries / EF Core LINQ — no raw string-concatenated SQL.
- Any new authentication, authorization, or token-handling code must use real, signed/verifiable credentials — it must not extend or imitate the existing `DemoTokenService` pattern.

**Gate**: `security-reviewer` agent checklist; `secret-scanner` hook on every commit.
**Automated by**: `secret-scanner` hook, `security-reviewer` agent.

## III. Architecture — Preserve Layering

The solution's dependency direction is strictly acyclic today (`.planning/codebase/ARCHITECTURE.md`):

```
Domain (zero deps)
  → Data, Dto, UI, Security
    → Data.OpenBox, Services.Contracts
      → Services
        → Api
```

- `ApexInsurance.Domain` must never depend on anything outside itself.
- No project may introduce a back-reference up this chain (e.g. `Data` referencing `Services`).
- `ApexInsurance.Data.OpenBox` remains an intentional in-process **stub** of a legacy policy admin system. Do not wire it to a real external system, and do not remove its stub nature, without an explicit ADR authorizing that scope change.
- Schema changes are made by hand-editing `database/*.sql` scripts, not EF Core migrations (there is no `Migrations/` folder in this project, by design).

**Gate**: Any plan/PR introducing a new `ProjectReference` is checked against this diagram before merge.
**Automated by**: `architect` agent, `code-reviewer` agent (project-specific checks section).

## IV. Version Constraints

Use only APIs and language features available in the versions below. Do not suggest or silently adopt newer-version features.

| Layer | Version | Constraint |
|---|---|---|
| Angular | 8.2.14 | No Angular 9+ APIs (Ivy-only features, etc.) |
| C# / .NET | 10.0 (`LangVersion: latest` on net10.0) | Fine to use current C# 10.0/.NET 10 features; do not target a different TFM |
| EF Core | 10.0.0 | No EF Core migrations tooling introduced without an ADR (schema stays SQL-script-driven) |
| SQL Server | (version unpinned — see `.rapidx/stack.json`) | No syntax requiring a newer edition than what's configured |
| Testing | xUnit, Playwright | No swapping test frameworks without an ADR |

Upgrading any of the above requires an ADR (`/rapidx:adr`) documenting the reason and migration plan — not an inline decision during an unrelated phase.

**Gate**: `architect` and `planner` agents check stack.json before proposing designs.
**Automated by**: Version-specific constraints already injected into `CLAUDE.md`.

## V. Code Quality Gates

- Every change goes through `code-review` (see Governance — mandatory for all changes under the adopted baseline).
- `security-scan` (secret scanning) runs on every commit via the `secret-scanner` hook.
- Functions stay small and focused; no commented-out code; no magic numbers/strings without named constants — per the `coding-standards` skill.
- No linting/formatting tooling is currently configured for either the C# or Angular/AngularJS code (`.planning/codebase/CONVENTIONS.md`). Adding ESLint/Prettier (frontend) and an `.editorconfig` + analyzers (backend) is recommended but not yet mandatory — revisit at the next amendment once tooling is chosen.

**Gate**: `code-reviewer` agent checklist; PR/phase cannot close with an open finding above Medium severity from `.planning/RISKS.md`'s categories left unaddressed in the touched area.
**Automated by**: `code-reviewer`, `secret-scanner` hook.

## VI. Compliance & Governance Posture

No real compliance framework applies to this codebase today — it is P&C/commercial underwriting (submissions, quotes, policies, claims), not health data (no HIPAA relevance) or public-company financial reporting (no SOX relevance). No mandate documents or security policies have been dropped into `.rapidx/inputs/` as of this ratification.

Adopted baseline: **enterprise-standard** governance without claiming a regulatory framework the app doesn't need:

- Audit trail: enabled (`audit-trail` hook).
- Secret scanning: enabled (`secret-scanner` hook).
- Mandatory review: **required for every change, no exceptions** — this is stricter than the currently-installed `default` profile (which only requires `code-review` + `security-scan`, with `mandatory_review: false`). Run `/rapidx:switch-client` to `enterprise-standard` to bring the installed profile in line with this constitution, or treat mandatory review as a team process convention until that switch happens.
- If real org mandates, security policies, or a specific regulatory requirement (e.g. a state DOI rule) ever apply, drop them into `.rapidx/inputs/`, re-run `node scripts/learn-codebase.js --mandates --security`, and amend this constitution (Article VI) accordingly.

**Gate**: `/rapidx:governance-check`.
**Automated by**: `audit-trail`, `secret-scanner`, `invariant-check` hooks; `ai-governance` skill.

## VII. AI Agent Governance

- Agents must never write a hardcoded secret, credential, or connection string into any file, including planning/documentation files (a prior mapping pass leaked a live credential into a `.planning/codebase/` doc and required manual redaction before commit — treat this as a standing caution, not a one-off).
- Agents must not silently "complete" or "fix" `ApexInsurance.Data.OpenBox` into a real integration, or replace `DemoTokenService` with real auth, without that being the explicit, stated task.
- Agents must respect the review gates in Article V/VI — no agent skips code-review or security-scan on its own initiative.
- Agents must treat `.rapidx/knowledge/*.md` and `.planning/codebase/*.md` as a starting reference, not ground truth — verify claims against actual source before acting on them, since these documents can drift from the code.
- Agents must flag, not silently work around, any request that conflicts with Articles I–VI (e.g. a request to skip tests, add a hardcoded secret, or invert the dependency direction).

**Gate**: Spot-checked via `/rapidx:governance-check` and code review.
**Automated by**: `ai-governance` skill; `security-reviewer` and `code-reviewer` agents (project-specific checks sections, updated 2026-08-13).

---

## Governance

- This constitution supersedes all other practices for this project.
- Amendments require: documentation of the change + rationale + (if it loosens a gate) a migration plan. Use `/rapidx:constitution amend`.
- All specs must include a Constitution Check section referencing the relevant article(s).
- `/rapidx:governance-check` enforces the automated gates above.
- `/rapidx:spec-review` validates spec compliance against this document.
- Known, already-tracked exceptions (the 4 critical findings in `.planning/RISKS.md`) are explicitly **not** governed by this constitution per Article II — they are tracked and remediated on their own timeline, not treated as a standing violation of Article II going forward.

**Version history:**

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-08-13 | Initial ratification |
