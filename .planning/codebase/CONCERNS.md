# Codebase Concerns

**Analysis Date:** 2026-08-13

## Tech Debt

**Fully synchronous request pipeline:**
- Issue: Every controller action returns `IActionResult` (not `Task<IActionResult>`) and every service/repository method is synchronous — there is not a single `async`/`await` anywhere under `src/ApexInsurance.Services` or `src/ApexInsurance.Api/Controllers`. All EF Core access goes through blocking calls (`.ToList()`, `.FirstOrDefault()`, `SaveChanges()`) via `IRepository<T>`/`IUnitOfWork`.
- Files: `src/ApexInsurance.Data/Repositories/IRepository.cs`, `src/ApexInsurance.Services/Pipeline/PipelineService.cs`, `src/ApexInsurance.Services/Workflow/WorkflowService.cs`, `src/ApexInsurance.Services/Admin/AdminService.cs`, all `*Controller.cs` under `src/ApexInsurance.Api/Controllers`
- Impact: Under concurrent load, each request holds a thread-pool thread for the full duration of its (blocking) DB call, so ASP.NET Core cannot scale request throughput the way it would with async EF Core calls. Fine for a single-user demo; would need a rewrite before any real concurrent traffic.
- Fix approach: Convert `IRepository<T>` to expose `Task`-returning members (`GetByIdAsync`, `ToListAsync`, `SaveChangesAsync`), then thread `async`/`await` up through services and controllers. This is a wide, mechanical but invasive change — best done as its own dedicated phase given the number of touched files (19+ service files, 18 controllers).

**Ad-hoc runtime schema patch bypasses the documented schema-management path:**
- Issue: `Program.cs` runs `EnsureInsuredExternalIdColumn()` on every application startup, issuing raw `ExecuteSqlRaw` `ALTER TABLE`/`CREATE INDEX` statements directly against the database, independent of the hand-maintained `database/*.sql` scripts.
- Files: `src/ApexInsurance.Api/Program.cs:119,132-158`
- Impact: There are now two different, uncoordinated mechanisms that can change schema (the `database/` SQL scripts, and this inline C# migration in `Program.cs`). A future contributor following the "schema is SQL-script-managed" convention (see `database/01_CreateSchema.sql`) could easily miss this second path. The failure mode is also silent: the `catch (Exception ex)` swallows any error and just logs a `Console.WriteLine`, so a failed ALTER TABLE (e.g., insufficient permissions) would not stop startup or surface anywhere but stdout.
- Fix approach: Fold this column/index addition into `database/01_CreateSchema.sql` (or a new numbered script) and delete the runtime patch, or commit fully to EF Core migrations. Document the choice in an ADR either way.

**God-class `AdminService`/`AdminController`:**
- Issue: `AdminService` (408 lines) and its 1:1 `AdminController` cover ten unrelated admin concerns — users, teams, rate tables, referral rules, authority rules, system parameters, holidays, trades, coverages, territories — in a single class each.
- Files: `src/ApexInsurance.Services/Admin/AdminService.cs`, `src/ApexInsurance.Api/Controllers/AdminController.cs`
- Impact: High change-coupling — a change to holiday logic and a change to password reset both touch the same file, increasing merge conflicts and the chance of an unrelated regression. Confirmed as a top-coupling "hub module" in `.rapidx/knowledge/GRAPH_REPORT.md` (degree 22 and 21 respectively).
- Fix approach: Split into focused services (`UserAdminService`, `RateTableAdminService`, `ReferralRuleAdminService`, `AuthorityRuleAdminService`, `ReferenceDataAdminService`) behind the existing controller routes, migrating one vertical slice at a time behind the current `IAdminService` interface to avoid a big-bang rewrite.

**Weak password KDF parameters:**
- Issue: `PasswordHasher.CreateHash`/`VerifyPassword` use `Rfc2898DeriveBytes(password, saltBytes, 10000)` — the 3-argument constructor, which defaults to HMAC-SHA1, with only 10,000 iterations.
- Files: `src/ApexInsurance.Services/Auth/PasswordHasher.cs:9-11,29-35`
- Impact: 10,000 SHA1 iterations is well below current OWASP guidance (600,000+ for PBKDF2-HMAC-SHA1, or switch to SHA-256/512 with proportionally fewer iterations). Only exercised via `AdminService.ResetPassword`, since seeded demo users have `NULL` hashes and rely on the `DemoPassword` fallback instead — but any admin-created production account would inherit this weak hash.
- Fix approach: Use the `Rfc2898DeriveBytes` overload that takes `HashAlgorithmName.SHA256`, raise iterations to a current OWASP-recommended count (or migrate to `Argon2id`/`BCrypt` via a maintained package once external dependencies are allowed).

## Known Bugs

No known bugs identified during this pass.

## Security Considerations

**Committed SQL Server credential in source control:**
- Risk: `appsettings.json` contains a full Azure SQL connection string with a live-looking `User ID=` / `Password=` credential pair, committed to git. (Value redacted here — see the file directly; treat as compromised regardless.)
- Files: `src/ApexInsurance.Api/appsettings.json:3`
- Current mitigation: `README.md:59` explicitly acknowledges the credential should be rotated before sharing the repo; no other mitigation is in place.
- Recommendations: Rotate the credential (assume compromised, since it's in git history regardless of future removal). Move to `dotnet user-secrets` for local dev and environment variables/Key Vault for any shared environment. Add a pre-commit secret scan.

**Unsigned, forgeable "bearer tokens":**
- Risk: `DemoTokenService.IssueToken`/`DecodeToken` produce/read a Base64-encoded JSON blob (`{"UserId":...,"Username":...,"Role":...,"Exp":...}`) with no HMAC/signature. `IsValid` only checks the `Exp` field parsed out of client-supplied Base64 — anyone can hand-craft a token for any user ID or `Role` (e.g. `Admin`) and pass `AuthorizeRoleAttribute`'s role check.
- Files: `src/ApexInsurance.Security/DemoTokenService.cs:17-55`, `src/ApexInsurance.Api/Filters/AuthorizeRoleAttribute.cs:43-59`
- Current mitigation: None. `appsettings.json:12` even defines an unused `Apex:Auth:TokenSigningKey` placeholder that gives the false impression signing is wired up — it is never read anywhere in the codebase.
- Recommendations: Replace with real signed JWTs (`System.IdentityModel.Tokens.Jwt` + the existing `TokenSigningKey` config) validated via ASP.NET Core's JWT bearer middleware, or explicitly document/flag this as demo-only and gate it out of any non-local environment.

**Bearer token accepted via query string:**
- Risk: `CurrentUserContext.TryExtractBearerToken` falls back to `?access_token=` or `?token=` query parameters when no `Authorization` header is present. The Angular island (`auth.service.ts`) mirrors this by expecting a `?token=` handoff from the AngularJS shell.
- Files: `src/ApexInsurance.Api/Infrastructure/CurrentUserContext.cs:57-70`, `src/ApexInsurance.Api/Filters/AuthorizeRoleAttribute.cs:38-39`, `web/apex-ng8/src/app/core/auth.service.ts:70-81`
- Current mitigation: None — this is the primary auth handoff mechanism between the AngularJS shell and the Angular 8 islands, not just a document-download convenience.
- Recommendations: Tokens in URLs leak via server access logs, browser history, and `Referer` headers. Replace the URL handoff with a short-lived server-side exchange (e.g., a one-time code redeemed via POST) or `postMessage` between the shell and island instead of a URL query parameter, and drop `?access_token=`/`?token=` support from the API entirely.

**Hardcoded demo password fallback in the real auth code path:**
- Risk: `AuthService.ValidateLogin` accepts the literal `Password1!` for any user whose `PasswordHash` is empty, regardless of environment.
- Files: `src/ApexInsurance.Services/Auth/AuthService.cs:14-17,48-52`
- Current mitigation: Only seeded demo accounts currently have empty hashes (`database/02_SeedData.sql`, `database/04_DemoBrokerOpsUser.sql`), so the fallback is only reachable for those specific rows today — but nothing in code prevents a real user record with a null hash from also being accepted.
- Recommendations: Gate the fallback behind an explicit `IWebHostEnvironment.IsDevelopment()` check passed into `AuthService`, or remove it and instead ship a one-time "must set password" flow for accounts without a hash. Log loudly (not just silently succeed) whenever the fallback path is exercised.

**Token stored in `localStorage` (defense-in-depth gap, frontend):**
- Risk: `AuthService` (Angular) stores the bearer token in `localStorage` under `apex_token`, readable by any JavaScript executing on the page (XSS-exploitable), and the AngularJS↔Angular handoff also passes it as a URL query parameter that gets written to browser history before being stripped.
- Files: `web/apex-ng8/src/app/core/auth.service.ts:73-90,117-121`
- Current mitigation: The token is short-lived (`TokenLifetime` = 8 hours) and the demo app has no known XSS vectors identified in this pass, but no CSP is configured either.
- Recommendations: If moving toward real JWTs, prefer an httpOnly, `SameSite=Strict` cookie over `localStorage`, and add a Content-Security-Policy header.

**No brute-force protection on login:**
- Risk: `AuthController.Login` / `AuthService.ValidateLogin` has no rate limiting, CAPTCHA, or account lockout after repeated failed attempts — only an audit log entry (`_auditService.WriteLoginAudit`) is written per attempt.
- Files: `src/ApexInsurance.Api/Controllers/AuthController.cs:24-45`, `src/ApexInsurance.Services/Auth/AuthService.cs:30-58`
- Current mitigation: Audit trail exists (so attempts are at least visible after the fact), but nothing blocks a scripted credential-stuffing attempt in real time.
- Recommendations: Add a failed-attempt counter with progressive lockout (e.g., via `ASP.NET Core` rate-limiting middleware, available in .NET as `Microsoft.AspNetCore.RateLimiting` from .NET 7+) keyed by username and/or IP.

## Performance Bottlenecks

**Synchronous EF Core calls throughout the stack:**
- Problem: See "Fully synchronous request pipeline" under Tech Debt — every DB round-trip blocks a thread-pool thread instead of yielding it.
- Files: `src/ApexInsurance.Data/Repositories/IRepository.cs` and all implementations under `src/ApexInsurance.Data/Repositories`
- Cause: The repository/unit-of-work abstraction was written with fully synchronous signatures from the start; no `async` overloads exist to opt into.
- Improvement path: See Tech Debt fix approach above — introduce async repository methods and propagate `async`/`await` end-to-end.

No other performance bottleneck was identified in this pass — pagination (`Skip`/`Take`) is consistently applied on list endpoints (e.g., `BrokerService.List`, `PipelineService.GetBucket`, `InsuredService.List`), and `IUnitOfWork` is scoped per-request so there's no obvious connection leak.

## Fragile Areas

**`AdminService.cs` / `AdminController.cs`:**
- Files: `src/ApexInsurance.Services/Admin/AdminService.cs` (408 lines, 20 public methods), `src/ApexInsurance.Api/Controllers/AdminController.cs` (21 public methods)
- Why fragile: Highest-coupling hub module in the knowledge graph (degree 22 / 21 per `.rapidx/knowledge/GRAPH_REPORT.md`). Ten unrelated admin domains live in one class/controller pair, so any edit risks an unrelated regression, and there is zero unit-test coverage over any of its methods (rate tables, referral rules, authority rules, users, holidays, etc. are all untested).
- Safe modification: Add characterization tests for the specific method you're about to touch before changing it (there are none today to lean on). Avoid adding a 21st responsibility — route new admin concerns to a new, separate service/controller instead of growing this one further.
- Test coverage: None. No test file references `AdminService` or `AdminController` anywhere under `tests/`.

**`WorkflowService.cs`:**
- Files: `src/ApexInsurance.Services/Workflow/WorkflowService.cs` (475 lines), hub module degree 17 per the knowledge graph
- Why fragile: Owns submission assignment, task lifecycle, and notification side effects together, and calls into `IAuthorityService` for authority-limit checks — a cross-cutting dependency baked into a single service with no seams for testing state-transition logic in isolation.
- Safe modification: Changes to status-transition rules (e.g., `AssignSubmission`'s `Received → Triaged` transition) should be paired with a new unit test asserting the transition, since none currently exist.
- Test coverage: None — confirmed no `WorkflowService` reference in either `tests/ApexInsurance.Api.Tests` or `tests/ApexInsurance.Services.Tests`; correctness currently depends entirely on the Playwright E2E suite (`tests/e2e/specs/pipeline-and-risk.spec.js`, `tasks.spec.js`).

**`PipelineService.cs`:**
- Files: `src/ApexInsurance.Services/Pipeline/PipelineService.cs` (475 lines), hub module degree 16
- Why fragile: Bucket/summary logic (`GetSummary`, `GetBucket`) hand-computes date windows (`today`, `tomorrow`, `recentFrom`) and status groupings inline; any change to bucket definitions has no test asserting the current behavior, so a refactor could silently change which submissions land in which bucket on the underwriter's dashboard.
- Safe modification: Snapshot current bucket outputs for a known fixture set before changing the date/status logic.
- Test coverage: None at the unit level; covered only indirectly via `tests/e2e/specs/pipeline-and-risk.spec.js`.

**`web/apex-ng8/src/app/core/api.service.ts` / `core/auth.service.ts`:**
- Files: `web/apex-ng8/src/app/core/api.service.ts` (imported by 11 other files), `web/apex-ng8/src/app/core/auth.service.ts` (imported by 9 other files, degree 17 each per the knowledge graph)
- Why fragile: `ApiService` is the single choke point for every HTTP call from the Angular 8 islands — a bug in `handleError`/`toHttpParams` affects every feature module simultaneously. `AuthService` layers three different auth-state sources (query-string handoff, `/login` POST, and manual `localStorage` reads) with no dedicated test file for any of it.
- Safe modification: Any change to `ApiService.handleError`'s error-shape or `AuthService`'s `localStorage` key names (`apex_token`/`apex_user`, also referenced by the AngularJS shell in `web/apex-shell/config.js`) must be cross-checked against the AngularJS shell, since the two apps share these keys informally rather than through a shared contract.
- Test coverage: No `*.spec.ts` unit tests found alongside either file; only indirect Playwright coverage (`tests/e2e/specs/auth.spec.js`).

**`ApexInsuranceDbContext.cs`:**
- Files: `src/ApexInsurance.Data/ApexInsuranceDbContext.cs` (552 lines — the largest file in the codebase)
- Why fragile: Every entity mapping for the whole domain lives in one `OnModelCreating`; combined with the empty `src/ApexInsurance.Data/Migrations/` folder (no EF Core migrations exist), a mapping change here does not get any compiler or migration-time check against the actual `database/*.sql`-managed schema — drift between the two is only caught at runtime.
- Safe modification: After changing any mapping here, diff the corresponding table definition in `database/01_CreateSchema.sql` by hand — there is no automated cross-check.
- Test coverage: No dedicated tests for context mappings; indirectly exercised by every service-layer E2E test.

## Scaling Limits

Not really applicable — this is a local-only demo app (`Program.cs` binds to `http://localhost:52840`, SQLite-free single SQL Server instance, RabbitMQ optional/local). The synchronous request pipeline (see Performance Bottlenecks) would be the first thing to hit a ceiling if the app were ever pointed at real concurrent traffic, but no numeric capacity limits were found or are meaningful to state for this codebase in its current form.

## Dependencies at Risk

**Angular 8.2.14 (frontend, `web/apex-ng8`):**
- Risk: Angular 8 went end-of-life in November 2020; TypeScript 3.5.3 and RxJS 6.4.0 (also pinned in `web/apex-ng8/package.json`) are similarly far out of support. No security patches are being produced for any of these versions.
- Impact: Any newly-disclosed vulnerability in Angular 8/RxJS 6/zone.js 0.9.1 will never be patched upstream; the project is also locked out of modern Angular tooling (standalone components, new control-flow syntax, esbuild-based builds).
- Migration plan: This is called out explicitly in the project's own `CLAUDE.md` as an intentional version pin ("Use angular 8.2.14 patterns... do NOT suggest upgrading unless explicitly asked"), so no action is expected unless the client engagement scope changes. If/when it does, plan an incremental `ng update` path (8→9→...→current) rather than a rewrite, and retire the AngularJS shell (`web/apex-shell`) in the same effort since it's the other half of this hybrid.

**RabbitMQ.Client 6.8.1:**
- Risk: RabbitMQ.Client 6.x is on the older major line (7.x is current upstream at time of writing) — 6.8.1 still receives some security fixes but is not the actively developed line, and the API differs enough (7.x is async-only) that upgrading isn't a drop-in version bump.
- Impact: Low immediate impact since `Apex:RabbitMQ:Enabled` defaults to demo-local use and both consumers (`OpenBoxBusConsumerHostedService`, `InsuredPartyBusConsumerHostedService`) already no-op gracefully if the broker is unreachable — see `src/ApexInsurance.Api/Infrastructure/OpenBoxBusConsumerHostedService.cs`, `InsuredPartyBusConsumerHostedService.cs`.
- Migration plan: Track upstream 7.x; when upgrading, note that 7.x's fully-async client API pairs naturally with the broader async migration already recommended above.

## Missing Critical Features

**No CI/CD pipeline at all:**
- Problem: No `.github/workflows/`, `azure-pipelines.yml`, `Jenkinsfile`, or any other CI config exists anywhere in the repo.
- Blocks: The existing xUnit tests (`tests/ApexInsurance.Api.Tests`, `tests/ApexInsurance.Services.Tests`) and the 10-file, 60+ test Playwright E2E suite (`tests/e2e/specs/`) never run automatically on push/PR — a regression can land on `main` with zero automated signal. There is also no automated build check, so a broken build could be committed and only discovered by the next person who happens to `dotnet build` locally.

## Test Coverage Gaps

**Rating logic:**
- What's not tested: `RatingService.cs` (99 lines) has zero unit tests — no `RatingServiceTests` file exists anywhere under `tests/`.
- Files: `src/ApexInsurance.Services/Rating/RatingService.cs`
- Risk: Premium/rating calculation errors would only surface via manual QA or the E2E suite (which exercises UI flows, not rating edge cases/boundary values directly).
- Priority: High

**Authority/referral rule evaluation:**
- What's not tested: `AuthorityService.cs` (73 lines) — authority-limit checks used by `WorkflowService.AssignSubmission` and elsewhere — and the referral-rule CRUD/evaluation logic in `AdminService` (`GetReferralRules`/`UpsertReferralRule`, lines 201-234) have no unit tests.
- Files: `src/ApexInsurance.Services/Authority/AuthorityService.cs`, `src/ApexInsurance.Services/Admin/AdminService.cs:201-234`
- Risk: Authority/referral rules gate who can approve what dollar amount — an untested regression here is a business-rule/compliance risk (an underwriter could exceed authority undetected, or a referral that should trigger a manager review could be silently skipped).
- Priority: High

**Workflow state transitions:**
- What's not tested: `WorkflowService.cs` (475 lines) — submission status transitions (e.g., `Received → Triaged` in `AssignSubmission`), task lifecycle management, and notification side effects have no unit-level test.
- Files: `src/ApexInsurance.Services/Workflow/WorkflowService.cs`
- Risk: An incorrect status transition could silently strand submissions in the wrong pipeline bucket; only caught today if it happens to break a Playwright scenario.
- Priority: High

**Pipeline bucketing logic:**
- What's not tested: `PipelineService.GetSummary`/`GetBucket` date-window and status-grouping logic (`src/ApexInsurance.Services/Pipeline/PipelineService.cs`) has no unit test asserting bucket boundaries (e.g., what counts as "upcoming" vs. "overdue").
- Files: `src/ApexInsurance.Services/Pipeline/PipelineService.cs`
- Risk: Off-by-one date errors (e.g., timezone/UTC boundary handling around `DateTime.UtcNow.Date`) would misplace submissions between buckets without any automated check.
- Priority: Medium

**Admin CRUD surface:**
- What's not tested: All 20 `AdminService` methods (users, teams, rate tables, referral rules, authority rules, parameters, holidays, trades, coverages, territories) — none have unit tests.
- Files: `src/ApexInsurance.Services/Admin/AdminService.cs`
- Risk: Given this is also the most change-coupled module in the codebase (see Fragile Areas), the lack of tests compounds the regression risk of any edit here.
- Priority: Medium

**Existing unit tests are structural, not behavioral:**
- What's not tested: The only two unit test files that exist — `UwStructureSmokeTests.cs` and `SecurityAndSharedSmokeTests.cs` — verify that types/interfaces exist via reflection (`Assert.Contains("PipelineController", names)`) and that `DemoTokenService`/`Guard` work at a basic level. Neither exercises any business-rule branch of rating, authority, referral, or workflow logic.
- Files: `tests/ApexInsurance.Api.Tests/UwStructureSmokeTests.cs`, `tests/ApexInsurance.Services.Tests/SecurityAndSharedSmokeTests.cs`
- Risk: 8 total unit test cases give a false sense of "there are tests" without providing actual regression protection on business logic; the real safety net is the Playwright E2E suite alone.
- Priority: High

---

*Concerns audit: 2026-08-13*
