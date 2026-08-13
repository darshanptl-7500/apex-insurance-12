# Architecture

**Analysis Date:** 2026-08-13

## Pattern Overview

**Overall:** Layered N-tier monolith (Controller → Service → Repository/UnitOfWork → EF Core DbContext) on ASP.NET Core, fronted by a hybrid AngularJS/Angular 8 single-page frontend served from one Node static host.

**Key Characteristics:**
- Clean, acyclic project layering under `src/` — verified from every `.csproj`'s `<ProjectReference>` entries: `ApexInsurance.Domain` has zero dependencies and sits at the root; `ApexInsurance.Api` is the only project that references (nearly) everything.
- Repository + Unit-of-Work pattern (`ApexInsurance.Data/UnitOfWork.cs`, `ApexInsurance.Data/Repositories/*`) sits between EF Core's `ApexInsuranceDbContext` and the service layer — controllers and services depend on `IUnitOfWork`, never on `DbContext` directly (with a couple of documented exceptions, see below).
- One folder per business module repeated in parallel across `ApexInsurance.Services.Contracts/{Module}` (interfaces) and `ApexInsurance.Services/{Module}` (implementations) — e.g. `Pipeline`, `Rating`, `Quotes`, `Policies`, `Claims`, `Workflow`, `Admin`, `Authority`, `Documents`, `Insureds`, `Brokers`, `Modelling`, `Reporting`, `Support`, `Dashboard`, `Auth`, `Audit`.
- The legacy "Open Box" policy admin system is deliberately stubbed in-process (`ApexInsurance.Data.OpenBox`) rather than called over the network — `LocalOpenBoxGateway` and `OpenBoxIntegrationBus` simulate an external PAS/legacy integration for demo purposes.
- Frontend is an intentionally hybrid SPA: a legacy AngularJS shell (`web/apex-shell`) hosts newer Angular 8.2.14 feature "islands" (`web/apex-ng8`), stitched together at runtime by a custom Node static server (`web/serve-hybrid.js`) so both frameworks share one origin, one `localStorage`, and one auth token.
- Auth is a custom demo bearer-token scheme (base64-encoded JSON, not a signed JWT) validated by an `IAuthorizationFilter` (`AuthorizeRoleAttribute`) applied per-controller, not by ASP.NET Core's built-in `[Authorize]`/JWT middleware.
- Cross-cutting concerns (error shaping, audit logging, authorization) are implemented as MVC filters registered globally in `Program.cs`, not as ad hoc try/catch in each controller.

## Layers

**ApexInsurance.Domain:**
- Purpose: Plain entity and enum definitions — the shared vocabulary of the system (Submission, Quote, Policy, Claim, Endorsement, Broker, Insured, AuthorityRule, ReferralRule, RateTable, RiskAnswer, AuditLog, User, Trade, etc.).
- Location: `src/ApexInsurance.Domain/Entities`, `src/ApexInsurance.Domain/Enums`
- Contains: POCO entity classes, enums (`ClaimStatus`, `DocumentType`, `LineOfBusiness`, `PolicyStatus`, `ReferralDecision`, `SubmissionStatus`).
- Depends on: Nothing (root of the dependency graph — `ApexInsurance.Domain.csproj` has no `ProjectReference` entries).
- Used by: Every other project in `src/` (Data, Dto, Security, Services.Contracts, Services, Data.OpenBox, UI, Api).

**ApexInsurance.Data:**
- Purpose: Persistence layer — EF Core `DbContext`, repositories, and the Unit-of-Work aggregate that all higher layers use to reach the database.
- Location: `src/ApexInsurance.Data/ApexInsuranceDbContext.cs`, `src/ApexInsurance.Data/UnitOfWork.cs`, `src/ApexInsurance.Data/IUnitOfWork.cs`, `src/ApexInsurance.Data/Repositories/*`
- Contains: `ApexInsuranceDbContext` (EF Core 10 + SQL Server), one repository interface/implementation pair per aggregate (`ISubmissionRepository`/`SubmissionRepository`, `IQuoteRepository`/`QuoteRepository`, `IPolicyRepository`/`PolicyRepository`, `IClaimRepository`/`ClaimRepository`, `IBrokerRepository`/`BrokerRepository`, `IDocumentRepository`/`DocumentRepository`, `IDashboardRepository`/`DashboardRepository`, `IUserRepository`/`UserRepository`), a generic `IRepository`/`Repository` base.
- Depends on: `ApexInsurance.Domain` only.
- Used by: `ApexInsurance.Data.OpenBox`, `ApexInsurance.Services`, `ApexInsurance.Api` (some controllers inject `IUnitOfWork` directly for reads that have no dedicated service, e.g. `SubmissionsController`, `PoliciesController`).

**ApexInsurance.Data.OpenBox:**
- Purpose: Stubbed legacy Policy Administration System (PAS) integration — simulates the "Open Box" system that is the real system of record; workbench edits post here and the UI reads back a replica.
- Location: `src/ApexInsurance.Data.OpenBox/IOpenBoxGateway.cs`, `LocalOpenBoxGateway.cs`, `IOpenBoxIntegrationBus.cs`, `OpenBoxIntegrationBus.cs`
- Contains: An in-process gateway (`LocalOpenBoxGateway` implements `IOpenBoxGateway`) and an integration bus (`OpenBoxIntegrationBus` implements `IOpenBoxIntegrationBus`) that fakes async legacy-system round trips; optionally backed by RabbitMQ (gated by `Apex:RabbitMQ:Enabled` config) consumed by hosted services in the Api project.
- Depends on: `ApexInsurance.Data`, `ApexInsurance.Domain`.
- Used by: `ApexInsurance.Services`, `ApexInsurance.Api` (`SubmissionsController` injects `IOpenBoxGateway` directly; `Program.cs` wires `OpenBoxBusConsumerHostedService` / `InsuredPartyBusConsumerHostedService`).

**ApexInsurance.Dto:**
- Purpose: Data-transfer objects shared between the service layer and the API layer (request/response shapes independent of persistence entities).
- Location: `src/ApexInsurance.Dto/*.cs` (namespace is `ApexInsurance.Services.Dto`, kept distinct from the assembly/folder name)
- Contains: One DTO file per module — `SubmissionDto`-equivalent types live in module DTOs such as `QuoteDto.cs`, `PolicyDto.cs`, `ClaimDto.cs`, `AuthDto.cs`, `AdminDto.cs`, `AuditDto.cs`, `AuthorityDto.cs`, `DashboardDto.cs`, `DocumentDto.cs`, `ReportingDto.cs`, `RatingDto.cs`, `WorkbenchDto.cs`, `WorkflowDto.cs`.
- Depends on: `ApexInsurance.Domain`.
- Used by: `ApexInsurance.Security`, `ApexInsurance.Services.Contracts`, `ApexInsurance.Services`, `ApexInsurance.UI`, `ApexInsurance.Api`.

**ApexInsurance.Services.Contracts:**
- Purpose: Service interfaces — the seam the API layer programs against; keeps controllers decoupled from concrete service implementations for DI.
- Location: `src/ApexInsurance.Services.Contracts/{Module}` — one folder per module, mirroring `ApexInsurance.Services` (`Pipeline`, `Rating`, `Quotes`, `Policies`, `Claims`, `Workflow`, `Admin`, `Authority`, `Documents`, `Insureds`, `Brokers`, `Modelling`, `Reporting`, `Support`, `Dashboard`, `Auth`, `Audit`).
- Contains: Interfaces such as `IQuoteService`, `IPolicyService`, `IWorkflowService`, `IPipelineService`, `IAuthorityService`, `IRatingService`.
- Depends on: `ApexInsurance.Dto`, `ApexInsurance.Domain`.
- Used by: `ApexInsurance.Services` (implements them), `ApexInsurance.Api` (controllers depend on the interfaces via DI).

**ApexInsurance.Services:**
- Purpose: Business logic — the core of the application; orchestrates repositories, applies underwriting rules (rating, authority/referral limits, workflow transitions), and composes calls across modules (e.g. `QuoteService` calls `RatingService` and `AuthorityService`).
- Location: `src/ApexInsurance.Services/{Module}` — `Admin`, `Audit`, `Auth`, `Authority`, `Brokers`, `Claims`, `Dashboard`, `Documents`, `Insureds`, `Modelling`, `Pipeline`, `Policies`, `Quotes`, `Rating`, `Reporting`, `Support`, `Workbench`, `Workflow`.
- Contains: Service implementations (`QuoteService`, `AdminService`, `WorkflowService`, `PipelineService`, `AuthService`, `RatingService`, `DocumentService`, etc.). Flagged in the knowledge graph as the highest-coupling ("hub") files: `AdminService.cs` (degree 22), `WorkflowService.cs` (degree 17), `PipelineService.cs` (degree 16).
- Depends on: `ApexInsurance.Domain`, `ApexInsurance.Data`, `ApexInsurance.Services.Contracts`, `ApexInsurance.Dto`, `ApexInsurance.Data.OpenBox`, `ApexInsurance.Security`, `ApexInsurance.Shared`.
- Used by: `ApexInsurance.Api` (registered as scoped DI services in `Program.cs`).

**ApexInsurance.Security:**
- Purpose: Demo-only authentication token issuance/validation — explicitly documented as not production auth.
- Location: `src/ApexInsurance.Security/DemoTokenService.cs`, `IDemoTokenService.cs`
- Contains: `DemoTokenService` — base64-encodes a JSON `TokenPayload` (`UserId`, `Username`, `Role`, `Exp`) as the "bearer token"; no signature, no encryption.
- Depends on: `ApexInsurance.Domain`, `ApexInsurance.Dto`, `ApexInsurance.Shared`.
- Used by: `ApexInsurance.Services` (Auth), `ApexInsurance.Api` (`AuthorizeRoleAttribute` constructs `new DemoTokenService()` directly, and `Program.cs` also registers `IDemoTokenService` as a singleton for `AuthController`).

**ApexInsurance.Shared:**
- Purpose: Cross-cutting helper utilities with no business meaning of their own.
- Location: `src/ApexInsurance.Shared/Guard.cs`
- Contains: `Guard` — argument-validation helper (null/empty checks) used across services.
- Depends on: Nothing (no `ProjectReference` entries).
- Used by: `ApexInsurance.Security`, `ApexInsurance.Services`.

**ApexInsurance.UI:**
- Purpose: ViewModel/presentation-mapping layer for the underwriter workbench — shapes DTOs into hierarchical view models (Policy → Section: Limits, Premiums, Performance, Bureau, Deductions, Outwards RI).
- Location: `src/ApexInsurance.UI/ViewModels/WorkbenchViewModels.cs`
- Contains: Workbench view-model classes consumed by `ApexInsurance.Services.Contracts.Workbench` / `SupportAndUwFileControllers.cs`.
- Depends on: `ApexInsurance.Dto`, `ApexInsurance.Domain`.
- Used by: `ApexInsurance.Api`.

**ApexInsurance.Api:**
- Purpose: Web host — the composition root. Hosts all HTTP controllers, wires up dependency injection, registers cross-cutting MVC filters, and runs RabbitMQ-backed hosted services that simulate the Open Box legacy bus.
- Location: `src/ApexInsurance.Api/Program.cs`, `Controllers/*`, `Filters/*`, `Infrastructure/*`, `Models/*`
- Contains: 18 controllers (`AdminController`, `AuditController`, `AuthController`, `AuthorityController`, `BrokersController`, `ClaimsController`, `DashboardController`, `DocumentsController`, `InsuredsController`, `ModellingController`, `OpenBoxPortalController`, `PipelineController`, `PoliciesController`, `QuotesController`, `ReportsController`, `SubmissionsController`, `SupportAndUwFileControllers`, `WorkflowController`), all inheriting `ApexApiControllerBase`; MVC filters (`ApiExceptionFilterAttribute`, `AuditActionFilterAttribute`, `AuthorizeRoleAttribute`, `ApexAllowAnonymousAttribute`); request/response models under `Models/{Module}`; infrastructure helpers (`CurrentUserContext`, `EnumHelper`, `ApexApiException`, hosted bus consumers).
- Depends on: Every other `src/` project (Domain, Data, Services, Services.Contracts, Dto, UI, Security, Data.OpenBox, Shared).
- Used by: Nothing in `src/` — it is the runtime entry point, called by the frontend (`web/apex-ng8` and `web/apex-shell`) over HTTP on `http://localhost:52840`.

**web/apex-ng8 (Angular 8.2.14 islands):**
- Purpose: Newer feature modules of the underwriting workbench, built as a standalone Angular 8 CLI app and embedded into the legacy shell.
- Location: `web/apex-ng8/src/app` — `core/` (`api.service.ts`, `auth.service.ts`, `auth.guard.ts`, `auth.interceptor.ts`, `models.ts`), `features/{dashboard,case-hub,modelling,reporting,admin,login}`, `shared/`
- Contains: Angular components/services/modules per feature; `core/api.service.ts` (imported by 11 files) and `core/auth.service.ts` (imported by 9 files) are the most-reused abstractions per the knowledge graph; `core/models.ts` is the single most-imported file (14×), defining shared TS interfaces mirroring backend DTOs.
- Depends on: `@angular` (v8), `rxjs`; calls the `ApexInsurance.Api` HTTP endpoints via `api.service.ts` with the bearer token attached by `auth.interceptor.ts`.
- Used by: End users via the browser; built output is consumed by `web/apex-shell/ng8`.

**web/apex-shell (legacy AngularJS host):**
- Purpose: Original AngularJS single-page shell — the outer chrome (nav, routing, most CRUD screens: submissions, quotes, policies, claims, brokers, documents, pipeline, referrals, renewals, search, connect) that hosts the newer Angular 8 islands for specific feature areas.
- Location: `web/apex-shell/app/{controllers,directives,services,views}`, `web/apex-shell/index.html`, `web/apex-shell/config.js`
- Contains: One AngularJS controller + view per screen (e.g. `submission-detail.controller.js` / `submission-detail.html`, `quotes.controller.js`, `policy-detail.controller.js`, `pipeline.controller.js`), hashbang routing.
- Depends on: AngularJS (bundled under `web/apex-shell/lib`), calls the same `ApexInsurance.Api` backend directly via `$http`/services under `app/services`.
- Used by: End users; `web/serve-hybrid.js` serves it as the default route for everything not under `/ng8*`.

## Data Flow

**Submission → Quote → Bind → Policy (core underwriting flow):**

1. Broker/underwriter creates a submission via `POST api/submissions` (`SubmissionsController.List`/`Create` in `src/ApexInsurance.Api/Controllers/SubmissionsController.cs`). No dedicated `ISubmissionService` exists — the controller composes `IUnitOfWork.Submissions` (+ `RiskAnswers`) directly, per its own doc comment, and delegates underwriter assignment to `IWorkflowService.AssignSubmission`.
2. Underwriter creates a quote from the submission via `POST api/quotes` (`QuotesController.Create`, forcing `CreatedByUserId` from the authenticated caller, never the request body) → `QuoteService.CreateQuote` (`src/ApexInsurance.Services/Quotes/QuoteService.cs`): loads the submission via `_unitOfWork.Submissions.GetWithDetails`, resolves the insured's trade, calls `IRatingService.CalculatePremium` to price it, and consults `IAuthorityService` for referral/authority-limit checks.
3. Quote acceptance/bind logic (in `QuoteService`/`PolicyService`) creates the bound `Policy` entity via the repository/unit-of-work, and — per the project overview — posts the resulting state to the stubbed Open Box gateway (`IOpenBoxGateway`/`LocalOpenBoxGateway` in `ApexInsurance.Data.OpenBox`) so the "system of record" replica reflects the bind.
4. `PoliciesController` (`src/ApexInsurance.Api/Controllers/PoliciesController.cs`) exposes the resulting policy: its `List` endpoint explicitly bypasses `IPolicyService` for filtered listing (no generic filtered-list method exists there) and reads `IUnitOfWork.Policies` directly, mapping to the same `PolicyDto` shape `IPolicyService` uses elsewhere — a documented, intentional inconsistency rather than an oversight.
5. The frontend (`web/apex-shell` quotes/policy-detail controllers, or `web/apex-ng8` case-hub feature) calls these endpoints through `$http`/`api.service.ts`, both attaching the demo bearer token issued at login.

**State Management:**
- Backend: request-scoped state only — no server-side session; all state is either persisted via EF Core (`ApexInsuranceDbContext`) or carried in the stateless bearer token (`TokenPayload`: UserId, Username, Role, Exp) decoded per-request by `AuthorizeRoleAttribute`/`CurrentUserContext`.
- Frontend (Angular 8 islands): service-held observable state in per-feature services (e.g. `case-hub.service.ts`) plus `core/auth.service.ts` for the current user/token, following standard Angular 8 DI singleton-service state pattern (no NgRx/store library present).
- Frontend (AngularJS shell): controller-local `$scope` state plus shared AngularJS services under `web/apex-shell/app/services` for cross-controller state (e.g. current user, shared lookups); `localStorage` is shared with the Angular 8 islands because both apps are served from the same origin by `serve-hybrid.js`, which is precisely why the hybrid host exists.

## Key Abstractions

**IUnitOfWork:**
- Purpose: Single aggregate root over all EF Core repositories, injected wherever data access is needed (services and, in a few documented cases, controllers directly).
- Examples: `src/ApexInsurance.Data/IUnitOfWork.cs`, `src/ApexInsurance.Data/UnitOfWork.cs`
- Pattern: Unit of Work + Repository.

**Services.Contracts / Services module pairing:**
- Purpose: One interface + implementation pair per business capability, registered in `Program.cs` as scoped services, giving controllers a stable seam for DI/testing.
- Examples: `src/ApexInsurance.Services.Contracts/Quotes/IQuoteService.cs` ↔ `src/ApexInsurance.Services/Quotes/QuoteService.cs`; same pattern for Policies, Claims, Workflow, Pipeline, Admin, Authority, Rating, Documents, Insureds, Brokers, Modelling, Reporting, Support, Dashboard, Auth, Audit.
- Pattern: Interface segregation per bounded module (not one giant service interface).

**MVC Filters as cross-cutting pipeline:**
- Purpose: Centralize error shaping, audit logging, and authorization instead of duplicating logic per controller action.
- Examples: `src/ApexInsurance.Api/Filters/ApiExceptionFilterAttribute.cs`, `AuditActionFilterAttribute.cs`, `AuthorizeRoleAttribute.cs`, `ApexAllowAnonymousAttribute.cs` — all registered globally in `src/ApexInsurance.Api/Program.cs` (`options.Filters.Add<...>()`).
- Pattern: ASP.NET Core `IActionFilter`/`IAuthorizationFilter`/`IExceptionFilter` pipeline.

**TokenPayload / DemoTokenService:**
- Purpose: Stand-in for a real auth token — carries `UserId`, `Username`, `Role`, `Exp` as base64-encoded JSON.
- Examples: `src/ApexInsurance.Security/DemoTokenService.cs`, `src/ApexInsurance.Security/IDemoTokenService.cs`
- Pattern: Custom bearer scheme, not JWT — no signature verification, so it must not be treated as a security-hardened mechanism (see Cross-Cutting Concerns below).

**OpenBox Gateway/Bus stub:**
- Purpose: Fakes an external legacy PAS system and its async integration bus so the rest of the app can be built and demoed against a "real" downstream dependency without one existing.
- Examples: `src/ApexInsurance.Data.OpenBox/IOpenBoxGateway.cs`, `LocalOpenBoxGateway.cs`, `IOpenBoxIntegrationBus.cs`, `OpenBoxIntegrationBus.cs`
- Pattern: Gateway pattern + in-process pub/sub bus, optionally bridged to RabbitMQ via hosted services in `ApexInsurance.Api/Infrastructure`.

## Entry Points

**ApexInsurance.Api host:**
- Location: `src/ApexInsurance.Api/Program.cs`
- Triggers: Process start (`dotnet run`); listens on `http://localhost:52840` (`builder.WebHost.UseUrls`).
- Responsibilities: Configures MVC + Newtonsoft JSON, CORS (allowed origins from `Apex:Cors:AllowedOrigins`, defaulting to `http://localhost:4200,http://localhost:4201`), EF Core `DbContext` registration against the `ApexInsurance` connection string, all DI service registrations, two RabbitMQ-backed hosted services, and a startup-time idempotent schema patch (`EnsureInsuredExternalIdColumn`) that adds an `Insureds.ExternalId` column/unique index if missing — a stopgap outside the normal `database/*.sql` migration scripts.

**web/serve-hybrid.js:**
- Location: `web/serve-hybrid.js`
- Triggers: `node serve-hybrid.js` or `npm start` (from `web/`); listens on port 4200 by default (`process.env.PORT`).
- Responsibilities: Single-origin static file host — serves `web/apex-shell` as the AngularJS shell root, routes any `/ng8*` request to the built Angular 8 bundle in `web/apex-shell/ng8` with SPA fallback, disables all HTTP caching (dev-only host), and requires a prior `npm run build:ng8` to populate `ng8/`.

**Controllers (18 total) under src/ApexInsurance.Api/Controllers:**
- Location: `src/ApexInsurance.Api/Controllers/*.cs`
- Triggers: Inbound HTTP requests matching each controller's `[Route("api/...")]`.
- Responsibilities: Deserialize/validate request models (`Models/{Module}`), delegate to the matching `Services.Contracts` interface (or `IUnitOfWork` directly for a few documented exceptions), map results to DTOs, return `IActionResult`.

## Error Handling

**Strategy:** Centralized exception-to-HTTP-response mapping via a global MVC exception filter, rather than per-controller try/catch.

**Patterns:**
- `ApiExceptionFilterAttribute` (`src/ApexInsurance.Api/Filters/ApiExceptionFilterAttribute.cs`) registered globally in `Program.cs`, catching unhandled exceptions and shaping them into a consistent error payload.
- `ApexApiException` (`src/ApexInsurance.Api/Infrastructure/ApexApiException.cs`) as a typed exception controllers/services can throw to communicate a specific HTTP status/message.
- `AuthorizeRoleAttribute` short-circuits requests before they reach the controller, returning a structured `{ error, message }` `ObjectResult` for 401/403 cases (see `Reject` helper) rather than throwing.
- Startup-time defensive coding: `EnsureInsuredExternalIdColumn` in `Program.cs` wraps its ad hoc schema patch in try/catch and logs a warning rather than failing app startup.

## Cross-Cutting Concerns

**Logging:** Minimal/ad hoc — no structured logging framework (Serilog/NLog) detected in `Program.cs`; startup warnings go to `Console.WriteLine`. Audit logging of user actions is handled separately and more deliberately via `AuditActionFilterAttribute` (`src/ApexInsurance.Api/Filters/AuditActionFilterAttribute.cs`) writing to `AuditLog` entities through `IAuditService`/`AuditService` (`src/ApexInsurance.Services/Audit`), not general application logging.

**Validation:** Primarily manual/imperative — controllers null-check request bodies and return `BadRequest(...)` (e.g. `QuotesController.Create`); services throw `ArgumentNullException`/`InvalidOperationException` for invalid state (e.g. `QuoteService.CreateQuote` checking the submission exists). No `[Required]`/DataAnnotations-driven model validation or FluentValidation observed in the sampled controllers/DTOs.

**Authentication:** Custom demo-only scheme — **not** signed JWT. `ApexInsurance.Security/DemoTokenService.cs` issues a token that is just base64-encoded JSON (`TokenPayload { UserId, Username, Role, Exp }`) with no signature or encryption; `src/ApexInsurance.Api/Filters/AuthorizeRoleAttribute.cs` (an `IAuthorizationFilter`, not ASP.NET Core's built-in `[Authorize]`) validates presence/expiry via `IDemoTokenService.IsValid`/`DecodeToken`, optionally enforcing a role allow-list, and stores the decoded payload in `CurrentUserContext` for controllers to read via `ApexApiControllerBase.CurrentUser`/`CurrentUserId`. `ApexAllowAnonymousAttribute` opts specific actions/controllers out of this check. This is explicitly documented project-wide as demo-only and must not be treated as production-grade auth.

---

*Architecture analysis: 2026-08-13*
