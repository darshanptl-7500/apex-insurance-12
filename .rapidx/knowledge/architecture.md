# Architecture Knowledge Map

**Analyzed**: 2026-08-13
**Sources**: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`, `docs/UW-SOLUTION-MAP.md`, `docs/UNDERWRITING-WORKBENCH-FUNCTIONAL-REQUIREMENTS.md`, `.rapidx/knowledge/GRAPH_REPORT.md`, direct inspection of all 19 controllers under `src/ApexInsurance.Api/Controllers/`. No `ARCHITECTURE.md`/`docs/ARCHITECTURE*.md` at repo root, no ADRs, no `.puml`/`.mermaid` diagrams, no `openapi.yaml`/`swagger.yaml`, nothing in `.rapidx/inputs/` — this map is synthesized from the codebase-mapper output and direct source verification, not from authored architecture documentation.
**Confidence**: Medium — no formal ADRs, diagrams, or API spec exist to cross-check against; the component map and data flow below are verified against real `.csproj`/controller/service source, not just described in prose.

---

## System Overview

Apex Insurance is a London Market-style underwriting workbench: submissions → quotes → bind → policy → claims, plus documents, workflow tasks, broker/insured CRM, referral/authority rules, rating, and MI reporting. It deliberately mirrors a classic UW N-tier layout (see `docs/UW-SOLUTION-MAP.md`'s classic-layer-to-Apex-project mapping table) reimplemented on .NET 10. The legacy "Open Box" policy administration system — the real system of record in the classic architecture — is intentionally stubbed in-process (`ApexInsurance.Data.OpenBox`) rather than integrated over the network; DM22, Dynamics CRM, Lloyd's/DXC, and Active Directory are explicitly out of scope. The backend is a layered N-tier ASP.NET Core monolith (Controller → Service → Repository/UnitOfWork → EF Core); the frontend is an intentionally hybrid single-page app pairing a legacy AngularJS shell with newer Angular 8.2.14 feature islands, both served from one origin so they share `localStorage` and one auth token.

## Component Map

| Component | Type | Technology | Responsibility |
|-----------|------|------------|----------------|
| `ApexInsurance.Domain` | Library | C# / .NET 10 | Entities + enums; zero dependencies, root of the dependency graph |
| `ApexInsurance.Data` | Library | EF Core 10 + SQL Server | `ApexInsuranceDbContext`, Unit-of-Work, one repository per aggregate |
| `ApexInsurance.Data.OpenBox` | Library | C# / .NET 10 | Stubbed legacy PAS gateway (`LocalOpenBoxGateway`) + integration bus, optional RabbitMQ backing |
| `ApexInsurance.Dto` | Library | C# / .NET 10 | Request/response DTOs (namespace `ApexInsurance.Services.Dto`) |
| `ApexInsurance.Services.Contracts` | Library | C# / .NET 10 | Service interfaces, one folder per business module |
| `ApexInsurance.Services` | Library | C# / .NET 10 | Business logic — rating, authority/referral rules, workflow, pipeline, admin, etc. |
| `ApexInsurance.Security` | Library | C# / .NET 10 | `DemoTokenService` — demo-only bearer token issuance, explicitly not production auth |
| `ApexInsurance.Shared` | Library | C# / .NET 10 | `Guard` argument-validation helper; no other cross-cutting code |
| `ApexInsurance.UI` | Library | C# / .NET 10 | ViewModel mapping for the hierarchical underwriter workbench (Policy → Section) |
| `ApexInsurance.Api` | Service (Web host) | ASP.NET Core on .NET 10 | Composition root; 19 controllers, MVC filter pipeline, RabbitMQ hosted consumers; listens on `http://localhost:52840` |
| `web/apex-ng8` | UI | Angular 8.2.14 | Newer feature islands (dashboard, case-hub, modelling, reporting, admin, login) |
| `web/apex-shell` | UI | AngularJS (legacy) | Original SPA shell — nav/routing + most CRUD screens; hosts the Angular 8 islands |
| `web/serve-hybrid.js` | Host | Node (no framework) | Single-origin static host stitching AngularJS shell + Angular 8 bundle together on port 4200 |
| SQL Server (`ApexInsurance` DB) | Database | SQL Server, EF Core 10 provider | System of record for this app's own data; schema managed by hand-written scripts in `database/*.sql`, not EF migrations |
| RabbitMQ (optional) | Messaging | RabbitMQ.Client 6.8.1 | Simulates the Open Box legacy integration bus; gated by `Apex:RabbitMQ:Enabled`, no-ops gracefully when disabled |

## Integration Topology

```
                     ┌───────────────────────────┐
   Browser  ───────▶ │  web/serve-hybrid.js       │  (port 4200, single origin)
                     │  ├─ web/apex-shell (AngularJS, default route)
                     │  └─ web/apex-ng8  (Angular 8, routed under /ng8*)
                     └──────────────┬────────────┘
                                    │ HTTP (bearer token from DemoTokenService)
                                    ▼
                     ┌───────────────────────────┐
                     │  ApexInsurance.Api         │  (port 52840, ASP.NET Core)
                     │  19 controllers → Services.Contracts → Services
                     └───────┬─────────────┬─────┘
                             │             │
                     IUnitOfWork      IOpenBoxGateway
                             │             │
                             ▼             ▼
                  ┌────────────────┐  ┌─────────────────────────┐
                  │  SQL Server     │  │  ApexInsurance.Data.OpenBox │
                  │  (ApexInsurance)│  │  (in-process stub; optional  │
                  └────────────────┘  │  RabbitMQ bus, also stubbed) │
                                       └─────────────────────────┘

  Explicitly OUT of scope / not integrated: Open Box SOAP/ViewService (real),
  DM22, Dynamics CRM, Lloyd's/DXC, Active Directory  — docs/UW-SOLUTION-MAP.md:29-32
```

## Active Architecture Decisions

No formal ADRs exist in this repository (`docs/adr/`, `docs/decisions/`, `architecture/decisions/` are all absent). The decisions below are **implicit conventions** recovered from source, not ratified ADRs — treat them as the current baseline, and see "Architecture Gaps & Risks" for the recommendation to formalize the most load-bearing ones.

### Must Follow (de facto conventions currently in force)
- **Acyclic layering**: `Domain` has zero dependencies; nothing may reference "up" the chain `Domain → Data/Dto/UI/Security → Data.OpenBox/Services.Contracts → Services → Api`. Verified against every `.csproj`'s `<ProjectReference>` — no violations found.
- **Repository + Unit-of-Work over direct `DbContext` access**: services and most controllers depend on `IUnitOfWork`, not `ApexInsuranceDbContext` directly.
- **One Contracts/Implementation folder pair per business module** (`Services.Contracts/{Module}` ↔ `Services/{Module}`) — keeps controllers decoupled from concrete implementations for DI.
- **Cross-cutting concerns as global MVC filters**, not per-controller try/catch: `ApiExceptionFilterAttribute`, `AuditActionFilterAttribute`, `AuthorizeRoleAttribute`, `ApexAllowAnonymousAttribute`, all registered in `src/ApexInsurance.Api/Program.cs`.
- **Open Box stays a stub**: `ApexInsurance.Data.OpenBox` must not be wired to a real external system without an explicit, scoped decision to do so (this is a deliberate demo simplification per `docs/UW-SOLUTION-MAP.md`, not legacy cruft to "fix").
- **Schema changes via hand-written SQL**, not EF Core migrations: there is no `Migrations/` folder anywhere in `src/ApexInsurance.Data`; changes go in `database/*.sql`.

### Deprecated Patterns (do NOT use)
- None formally deprecated — there is no ADR history to draw from. However, two patterns are explicitly documented in-code as demo-only and should not be extended: `DemoTokenService`'s unsigned base64 token scheme (`ApexInsurance.Security/DemoTokenService.cs`), and `AuthService`'s hardcoded `Password1!` fallback for users without a stored hash. New auth work should not imitate either.

### Open Decisions (Proposed ADRs)
- None recorded. See recommendation below to open ADRs for the two "Must Follow" items most likely to be misunderstood by a new contributor or agent: "Open Box is an intentional stub" and "schema is SQL-script-managed, not EF-migration-managed."

## Data Architecture

### Key Entities

| Entity | Location | Description |
|--------|----------|-------------|
| `Submission` | `ApexInsurance.Domain/Entities`, table `Submissions` | Intake record; root of the underwriting flow |
| `RiskAnswer` | `ApexInsurance.Domain/Entities`, table `RiskAnswers` | Questionnaire answers attached to a submission |
| `Quote` | `ApexInsurance.Domain/Entities`, table `Quotes` | Priced offer derived from a submission via `RatingService` |
| `Policy` | `ApexInsurance.Domain/Entities`, table `Policies` | Bound quote; core record for in-force business |
| `Endorsement` | `ApexInsurance.Domain/Entities`, table `Endorsements` | Mid-term policy amendment |
| `Claim` | `ApexInsurance.Domain/Entities`, table `Claims` | FNOL through payment/close lifecycle |
| `Broker` / `Insured` | `ApexInsurance.Domain/Entities`, tables `Brokers`/`Insureds` | CRM-lite counterparties |
| `AuthorityRule` / `ReferralRule` | `ApexInsurance.Domain/Entities`, tables `AuthorityRules`/`ReferralRules` | Delegated-authority limits and referral triggers consulted by `AuthorityService` |
| `RateTable` | `ApexInsurance.Domain/Entities`, table `RateTables` | Table-based rating inputs for `RatingService` |
| `WorkflowTask` | `ApexInsurance.Domain/Entities`, table `WorkflowTasks` | Underwriter task queue (Data Entry, Second Sight, Front Sheet, Modelling, Referral, Wording) |
| `Document` | `ApexInsurance.Domain/Entities`, table `Documents` | DM22-style uploads, linked to submission/policy/claim |
| `AuditLog` / `LoginAudit` | `ApexInsurance.Domain/Entities`, tables `AuditLogs`/`LoginAudits` | Written by `AuditActionFilterAttribute` via `AuditService` |
| `User` / `Team` | `ApexInsurance.Domain/Entities`, tables `Users`/`Teams` | Identity for the demo auth scheme |

Full DDL lives in `database/01_CreateSchema.sql`; seed data in `database/02_SeedData.sql` and `database/04_DemoBrokerOpsUser.sql`.

### Data Flow

**Submission → Quote → Bind → Policy** (verified against `SubmissionsController`, `QuotesController`, `QuoteService`, `PoliciesController`):

1. `POST api/submissions` (`SubmissionsController.Create`) — no dedicated `ISubmissionService`; the controller composes `IUnitOfWork.Submissions`/`RiskAnswers` directly and delegates assignment to `IWorkflowService.AssignSubmission`.
2. `POST api/quotes` (`QuotesController.Create` → `QuoteService.CreateQuote`) — loads the submission via `IUnitOfWork.Submissions.GetWithDetails`, calls `IRatingService.CalculatePremium`, consults `IAuthorityService` for referral/authority-limit checks.
3. Bind (`POST api/policies/bind`) creates the `Policy` via the repository/unit-of-work and posts the resulting state to the stubbed Open Box gateway (`IOpenBoxGateway`) so the "system of record" replica reflects the bind.
4. `GET api/policies` (`PoliciesController.List`) intentionally bypasses `IPolicyService` for filtered listing and reads `IUnitOfWork.Policies` directly — a documented, intentional inconsistency, not an oversight.
5. Both frontends (`web/apex-shell` and `web/apex-ng8`) call these endpoints over HTTP with the demo bearer token attached.

**State management**: backend is fully request-scoped/stateless (no server session); state lives in EF Core or the decoded bearer token per request. Frontend state is per-feature Angular services (no NgRx) on the `apex-ng8` side and AngularJS `$scope`/shared services on the `apex-shell` side, with `localStorage` shared across both because they're served from one origin.

## API Surface

No OpenAPI/Swagger spec exists — inventory below is extracted directly from `[Route]`/`[Http*]` attributes on all 19 controllers under `src/ApexInsurance.Api/Controllers/`.

### Internal APIs

| Controller | Base route | Key endpoints |
|---|---|---|
| `AdminController` | `api/admin` | `GET/POST users`, `PUT users/{id}`, `POST users/{id}/deactivate`, `POST users/{id}/reset-password`, `GET/POST rate-tables`, `GET/POST referral-rules` |
| `AuditController` | `api/audit` | `GET logs`, `GET logins` |
| `AuthController` | `api/auth` | `POST login`, `GET me` |
| `AuthorityController` | `api/authority` | `POST check`, `GET rules` |
| `BrokersController` | `api/brokers` | `GET/POST ""`, `GET/PUT {id}`, `POST {id}/deactivate`, `GET {id}/performance` |
| `ClaimsController` | `api/claims` | `GET ""`, `GET {id}`, `POST fnol`, `PUT {id}/status`, `PUT {id}/reserve`, `POST {id}/payments`, `PUT {id}/handler`, `POST {id}/close` |
| `DashboardController` | `api/dashboard` | `GET summary`, `GET queues`, `GET kpis`, `GET broker-performance` |
| `DocumentsController` | `api/documents` | `GET ""`, `GET {id}`, `GET by-submission/by-policy/by-claim`, `GET {id}/versions`, `POST upload`, `POST {id}/versions`, `PUT {id}/classify`, `PUT {id}/annotate`, `GET {id}/download` |
| `InsuredsController` | `api/insureds` | `GET ""`, `GET {id}`, `GET search`, `POST from-external` (lab helper simulating an external system publishing `InsuredCreated`) |
| `ModellingController` | `api/modelling` | `GET exposure`, `GET exposure/by-lob`, `GET exposure/by-territory`, `GET exposure/by-broker`, `GET concentration-summary` |
| `OpenBoxPortalController` | `api/openbox` | `GET status`, `GET risks`, `GET risks/{submissionId}`, `GET bus`, `GET bus/messages` |
| `PipelineController` | `api/pipeline` | `GET summary`, `GET {bucket}` |
| `PoliciesController` | `api/policies` | `GET ""`, `GET renewal-diary`, `GET {id}`, `GET by-number/{policyNumber}`, `POST bind`, `POST {id}/endorsements`, `POST {id}/cancel`, `POST {id}/reinstate`, `POST {id}/create-renewal` |
| `QuotesController` | `api/quotes` | `POST ""`, `GET {id}`, `GET by-submission/{submissionId}`, `PUT {id}/select` |
| `ReportsController` | `api/reports` | `GET premium-vs-target(/export)`, `GET broker-league(/export)`, `GET pipeline`, `GET loss-ratio` |
| `SubmissionsController` | `api/submissions` | `GET ""`, `GET {id}`, `POST ""`, `PUT {id}/status`, `PUT {id}/assign`, `PUT {id}/due-date`, `GET/PUT {id}/risk-answers` |
| `SupportController` | `api/support` | `GET health`, `GET integration-activity`, `GET scheduled-jobs` |
| `UnderwriterFileController` | `api/underwriter-file` | `GET {submissionId}`, `POST {submissionId}/edit` |
| `WorkflowController` | `api/workflow` | `GET/POST tasks`, `GET/PUT tasks/{id}`, `PUT tasks/{id}/complete`, `PUT tasks/{id}/cancel`, `POST tasks/{id}/comments`, `GET referrals`, `PUT referrals/{quoteId}/approve` |

**Auth**: every endpoint is gated by `AuthorizeRoleAttribute` (custom `IAuthorizationFilter`) unless explicitly marked `[ApexAllowAnonymousAttribute]` (e.g. `AuthController.Login`). Bearer token via `Authorization` header or `?access_token=` query string (see Non-Functional Characteristics — Security).

**Response shape**: DTOs from `ApexInsurance.Dto`, mapped in controllers/services; errors shaped by `ApiExceptionFilterAttribute` into a consistent payload; `AuthorizeRoleAttribute` returns a structured `{ error, message }` object on 401/403.

### External Integrations

None real. `docs/UW-SOLUTION-MAP.md:29-32` explicitly lists Open Box SOAP/ViewService, DM22, Dynamics CRM, Lloyd's/DXC, and Active Directory as out-of-scope stubs. RabbitMQ is the one live optional dependency, and it's used only to simulate the Open Box bus — not a real third-party integration.

## Non-Functional Characteristics

| Concern | Current Approach | Target |
|---------|-----------------|--------|
| Scalability | Fully synchronous request handling (no `async`/`await` observed anywhere in controllers/services/repositories); stateless API behind a single process | Not specified — no scaling target documented; this is a demo/training app, not sized for production load |
| Availability | Single instance, no documented HA/failover; RabbitMQ hosted consumers no-op gracefully if the broker is unreachable | Not specified |
| Latency | No caching layer, no CDN; SQL Server accessed synchronously per request | Not specified |
| Security | Custom unsigned bearer-token scheme (`DemoTokenService`), token accepted via header **or** `?access_token=` query string; hardcoded demo password fallback (`AuthService`); a live-looking SQL Server credential is committed to `src/ApexInsurance.Api/appsettings.json` | Explicitly demo-only — see `.planning/RISKS.md` items 1-4 for the gap to a production-grade posture (signed JWT, secrets via env/Key Vault, remove password fallback, header-only token) |

## Architecture Anti-Patterns (Avoid)

- **Extending `DemoTokenService`'s unsigned-token pattern** to any new auth surface — it has no signature/encryption and is explicitly demo-only.
- **Accepting bearer tokens via query string** (`?access_token=`) for any new endpoint — leaks into logs/referrers/browser history; existing usage in `CurrentUserContext` should not be treated as a pattern to copy.
- **Replicating the `AuthService` hardcoded-password fallback** (`Password1!` for users without a hash) in any new user flow.
- **Wiring `ApexInsurance.Data.OpenBox` to a real external system** without an explicit decision to do so — it exists specifically to let the app be built/demoed without a real legacy PAS.
- **Adding EF Core migrations** without first deciding to abandon the SQL-script-managed schema convention — mixing both would be worse than either alone.
- **Bypassing the `Services.Contracts`/`Services` seam** for new business logic by putting logic directly in a controller (the existing `SubmissionsController`/`PoliciesController` direct-`IUnitOfWork` exceptions are documented, narrow, and pre-existing — not a general license to skip the service layer for new work).

## Architecture Gaps & Risks

- **No ADRs exist.** The two most load-bearing implicit decisions — "Open Box is an intentional stub, not a real integration" and "schema is SQL-script-managed, not EF-migration-managed" — are easy for a new contributor or an AI agent to misread as unfinished/legacy work rather than deliberate design. Recommend formalizing both via `/rapidx:adr` (also flagged in `.planning/RISKS.md` item 10).
- **No architecture diagrams exist** (no `.puml`/`.mermaid`/`docs/diagrams/`); the integration topology above is reconstructed from source and `docs/UW-SOLUTION-MAP.md`'s prose, not from an authored diagram — verify against source before relying on it for anything load-bearing.
- **No OpenAPI/Swagger spec exists**; the API Surface table above was extracted by grepping controller attributes and could drift from actual behavior (e.g. undocumented query parameters, actual request/response shapes) — treat it as a navigation aid, not a contract.
- **Auth architecture is documented as demo-only everywhere it's implemented**, which is good, but there is no ADR capturing what a real replacement (signed JWT via ASP.NET Core's built-in `[Authorize]` middleware) would look like — worth drafting before this is ever extended toward production use.
- **Fully synchronous I/O throughout** (no `async`/`await`) is a genuine architectural characteristic, not just a style nit — any future scalability work needs to treat this as a cross-cutting change, not a local fix.

---

*Architecture analysis: 2026-08-13*
