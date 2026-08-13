# Codebase Structure

**Analysis Date:** 2026-08-13

## Directory Layout

```
apex-insurance-11/
├── src/                                # .NET 10 / ASP.NET Core backend, one project per layer
│   ├── ApexInsurance.Api/              # Web host: controllers, Program.cs, filters, hosted services
│   ├── ApexInsurance.Domain/           # Entities + enums (zero dependencies, root of the graph)
│   ├── ApexInsurance.Data/             # EF Core DbContext, UnitOfWork, repositories
│   ├── ApexInsurance.Data.OpenBox/     # Stubbed legacy PAS gateway + integration bus
│   ├── ApexInsurance.Dto/              # Shared DTOs (namespace ApexInsurance.Services.Dto)
│   ├── ApexInsurance.Services.Contracts/ # Service interfaces, one folder per module
│   ├── ApexInsurance.Services/         # Service implementations, one folder per module
│   ├── ApexInsurance.Security/         # Demo bearer-token issuer/validator
│   ├── ApexInsurance.Shared/           # Cross-cutting helpers (Guard.cs)
│   └── ApexInsurance.UI/               # Workbench ViewModel mapping layer
├── web/                                # Hybrid AngularJS + Angular 8.2.14 frontend
│   ├── apex-ng8/                       # Angular 8 CLI project — newer feature "islands"
│   ├── apex-shell/                     # Legacy AngularJS host shell + built ng8/ output
│   ├── serve-hybrid.js                 # Single-origin Node static host stitching both apps
│   └── package.json                    # build:ng8 / start / start:hybrid scripts
├── tests/                              # xUnit backend tests + Playwright E2E tests
│   ├── ApexInsurance.Api.Tests/        # xUnit smoke tests for the Api project
│   ├── ApexInsurance.Services.Tests/   # xUnit smoke tests for Security/Shared
│   └── e2e/specs/                      # Playwright specs (1:1 with docs/E2E-TEST-CASES.md)
├── database/                           # Hand-written SQL Server schema/seed scripts (no EF migrations)
├── docs/                               # Functional requirements, UI spec, solution map, E2E test case index
├── scripts/                            # Node scripts for knowledge-graph/codebase-learning tooling
├── .rapidx/                            # RapidX platform state: stack config, knowledge, invariants, hooks
├── .planning/                          # RapidX planning artifacts (PROJECT.md, RISKS.md, codebase/ — this file)
├── ApexInsurance.sln                   # Visual Studio solution referencing all src/ and tests/ projects
├── docker-compose.rabbitmq.yml          # Local RabbitMQ for the simulated Open Box bus
├── CLAUDE.md                            # RapidX-generated project instructions for AI agents
└── README.md                            # Project readme
```

## Directory Purposes

**src/ApexInsurance.Api:**
- Purpose: Composition root and HTTP surface — the only project referencing every other backend project.
- Contains: `Program.cs` (DI + middleware wiring), `Controllers/*.cs` (18 controllers), `Filters/*.cs` (cross-cutting MVC filters), `Infrastructure/*.cs` (current-user context, enum helpers, hosted bus consumers), `Models/{Module}` (per-module request/response models), `App_Data/` (default document storage root).
- Key files: `src/ApexInsurance.Api/Program.cs`, `src/ApexInsurance.Api/Controllers/ApexApiControllerBase.cs`, `src/ApexInsurance.Api/Filters/AuthorizeRoleAttribute.cs`

**src/ApexInsurance.Domain:**
- Purpose: Shared vocabulary of the system — entities and enums with no behavior and no dependencies.
- Contains: `Entities/*.cs` (Submission, Quote, Policy, Claim, Endorsement, Broker, Insured, AuthorityRule, ReferralRule, RateTable, RiskAnswer, AuditLog, User, Trade, …), `Enums/*.cs` (`ClaimStatus`, `DocumentType`, `LineOfBusiness`, `PolicyStatus`, `ReferralDecision`, `SubmissionStatus`).
- Key files: `src/ApexInsurance.Domain/Entities`, `src/ApexInsurance.Domain/Enums`

**src/ApexInsurance.Data:**
- Purpose: Persistence — EF Core DbContext, Unit of Work, and per-aggregate repositories.
- Contains: `ApexInsuranceDbContext.cs`, `IUnitOfWork.cs`/`UnitOfWork.cs`, `Repositories/{I<Name>Repository.cs, <Name>Repository.cs}` pairs plus a generic `IRepository`/`Repository` base and `DashboardModels.cs`.
- Key files: `src/ApexInsurance.Data/ApexInsuranceDbContext.cs`, `src/ApexInsurance.Data/UnitOfWork.cs`

**src/ApexInsurance.Data.OpenBox:**
- Purpose: Simulated legacy Policy Administration System (PAS) integration — deliberately fake, not a real downstream system.
- Contains: `IOpenBoxGateway.cs`/`LocalOpenBoxGateway.cs`, `IOpenBoxIntegrationBus.cs`/`OpenBoxIntegrationBus.cs`.
- Key files: `src/ApexInsurance.Data.OpenBox/LocalOpenBoxGateway.cs`

**src/ApexInsurance.Dto:**
- Purpose: Transfer objects passed between services and the API layer.
- Contains: One or more DTO classes per module in a single file per module (`AuthorityDto.cs`, `WorkbenchDto.cs`, `ClaimDto.cs`, `AuditDto.cs`, `DocumentDto.cs`, `ReportingDto.cs`, `RatingDto.cs`, `AdminDto.cs`, `QuoteDto.cs`, `DashboardDto.cs`, `WorkflowDto.cs`, `PolicyDto.cs`, `AuthDto.cs`).
- Key files: `src/ApexInsurance.Dto/QuoteDto.cs`, `src/ApexInsurance.Dto/PolicyDto.cs`

**src/ApexInsurance.Services.Contracts:**
- Purpose: Service interfaces — DI seam between controllers and business logic.
- Contains: One folder per module (`Admin`, `Audit`, `Auth`, `Authority`, `Brokers`, `Claims`, `Dashboard`, `Documents`, `Insureds`, `Modelling`, `Pipeline`, `Policies`, `Quotes`, `Rating`, `Reporting`, `Support`, `Workbench`, `Workflow`), each holding its `I<Module>Service.cs`.
- Key files: `src/ApexInsurance.Services.Contracts/Quotes/IQuoteService.cs`

**src/ApexInsurance.Services:**
- Purpose: Business logic implementation — the largest and most-coupled backend project.
- Contains: Same module folder layout as Services.Contracts, each holding the `<Module>Service.cs` implementation(s). Highest-coupling files (per `.rapidx/knowledge/GRAPH_REPORT.md`): `Admin/AdminService.cs`, `Workflow/WorkflowService.cs`, `Pipeline/PipelineService.cs`.
- Key files: `src/ApexInsurance.Services/Quotes/QuoteService.cs`, `src/ApexInsurance.Services/Admin/AdminService.cs`

**src/ApexInsurance.Security:**
- Purpose: Demo-only authentication token handling.
- Contains: `DemoTokenService.cs`, `IDemoTokenService.cs`.
- Key files: `src/ApexInsurance.Security/DemoTokenService.cs`

**src/ApexInsurance.Shared:**
- Purpose: Small cross-cutting helpers reused by Security and Services.
- Contains: `Guard.cs`.
- Key files: `src/ApexInsurance.Shared/Guard.cs`

**src/ApexInsurance.UI:**
- Purpose: Presentation/ViewModel mapping for the hierarchical underwriter workbench.
- Contains: `ViewModels/WorkbenchViewModels.cs`.
- Key files: `src/ApexInsurance.UI/ViewModels/WorkbenchViewModels.cs`

**web/apex-ng8:**
- Purpose: Angular 8.2.14 CLI project for newer feature areas of the workbench.
- Contains: `src/app/core` (api/auth services, guards, interceptors, shared TS models), `src/app/features/{dashboard,case-hub,modelling,reporting,admin,login}` (one Angular module per feature), `src/app/shared` (shared UI module).
- Key files: `web/apex-ng8/src/app/core/api.service.ts`, `web/apex-ng8/src/app/core/auth.service.ts`, `web/apex-ng8/src/app/core/models.ts`, `web/apex-ng8/src/app/app.module.ts`, `web/apex-ng8/src/app/app-routing.module.ts`

**web/apex-shell:**
- Purpose: Legacy AngularJS shell — outer chrome and the majority of CRUD screens; also the deployment target for the built Angular 8 bundle.
- Contains: `app/controllers` (one `.controller.js` per screen: submissions, quotes, policies, claims, brokers, documents, pipeline, referrals, renewals, search, connect, openbox, support), `app/views` (matching `.html` templates), `app/services`, `app/directives`, `ng8/` (build output — see Special Directories), `index.html`, `config.js`, `lib/` (vendored AngularJS + deps).
- Key files: `web/apex-shell/index.html`, `web/apex-shell/app/controllers/shell.controller.js`, `web/apex-shell/config.js`

**tests/:**
- Purpose: Automated test suites for backend and end-to-end coverage.
- Contains: `ApexInsurance.Api.Tests/UwStructureSmokeTests.cs` (xUnit), `ApexInsurance.Services.Tests/SecurityAndSharedSmokeTests.cs` (xUnit), `e2e/specs/*.spec.js` (10 Playwright spec files: `auth`, `connect`, `documents`, `mi-policies-claims`, `nav`, `openbox-support`, `pipeline-and-risk`, `search`, `tasks`, `uw-file`), `e2e/fixtures.js` (shared Playwright fixtures, imported by 10 spec files per the knowledge graph).
- Key files: `tests/e2e/fixtures.js`, `tests/e2e/specs/auth.spec.js`

**database/:**
- Purpose: Hand-authored SQL Server schema and seed scripts — the schema is **not** managed via EF Core migrations.
- Contains: Numbered, ordered `.sql` scripts: `01_CreateSchema.sql`, `02_SeedData.sql`, `03_SampleQueries.sql`, `04_DemoBrokerOpsUser.sql`, `04_MarketFields.sql`, `05_InsuredExternalId.sql`, `05_WorkbenchDepth.sql`.
- Key files: `database/01_CreateSchema.sql`

**docs/:**
- Purpose: Domain/functional documentation used to keep implementation aligned with intended scope.
- Contains: `UW-SOLUTION-MAP.md` (in/out-of-scope integrations), `UNDERWRITING-WORKBENCH-FUNCTIONAL-REQUIREMENTS.md`, `UNDERWRITING-WORKBENCH-UI-SPEC.md`, `E2E-TEST-CASES.md`, `uw-screens/` (reference screenshots/specs).
- Key files: `docs/UW-SOLUTION-MAP.md`

**scripts/:**
- Purpose: Node tooling for RapidX codebase learning and knowledge-graph generation (not part of the app runtime).
- Contains: `build-knowledge-graph.js`, `learn-codebase.js`.

**.rapidx/ and .planning/:**
- Purpose: RapidX Agentic Engineering Platform state — stack config, auto-learned knowledge, invariants, and this codebase-mapping output.
- Contains: `.rapidx/stack.json`, `.rapidx/knowledge/*.md` (architecture.md, GRAPH_REPORT.md, domain.md, code-patterns.md), `.rapidx/invariants/`, `.rapidx/hooks/`; `.planning/PROJECT.md`, `.planning/RISKS.md`, `.planning/codebase/` (this document and ARCHITECTURE.md).

## Key File Locations

**Entry Points:**
- `src/ApexInsurance.Api/Program.cs`: Backend host startup — DI registration, middleware, listens on `http://localhost:52840`.
- `web/serve-hybrid.js`: Frontend single-origin static host — listens on port 4200, serves both frontend apps.
- `web/apex-ng8/src/app/app.module.ts` / `app-routing.module.ts`: Angular 8 app bootstrap and routing.
- `web/apex-shell/index.html` / `web/apex-shell/config.js`: AngularJS shell bootstrap and routing config.

**Configuration:**
- `src/ApexInsurance.Api/appsettings.json` (implied by `builder.Configuration.GetConnectionString("ApexInsurance")` and `Apex:Cors:AllowedOrigins`, `Apex:RabbitMQ:Enabled`, `Apex:Documents:RootPath` keys read in `Program.cs`).
- `.rapidx/stack.json`: RapidX-tracked technology stack declaration.
- `web/apex-ng8/src/environments/environment.ts`: Angular 8 environment config (imported by 6 files per the knowledge graph).
- `docker-compose.rabbitmq.yml`: Local RabbitMQ broker for the simulated Open Box bus.

**Core Logic:**
- `src/ApexInsurance.Services/*/{Module}Service.cs`: Business logic per module.
- `src/ApexInsurance.Data/UnitOfWork.cs` + `Repositories/*`: Data access.
- `src/ApexInsurance.Api/Controllers/*.cs`: HTTP endpoint logic and request/response mapping.

**Testing:**
- `tests/ApexInsurance.Api.Tests/UwStructureSmokeTests.cs`: xUnit backend smoke tests.
- `tests/ApexInsurance.Services.Tests/SecurityAndSharedSmokeTests.cs`: xUnit backend smoke tests.
- `tests/e2e/specs/*.spec.js` + `tests/e2e/fixtures.js`: Playwright E2E tests, mapped 1:1 to `docs/E2E-TEST-CASES.md`.

## Naming Conventions

**Files:**
- Backend: PascalCase matching the type name, one primary type per file — `QuoteService.cs` contains `QuoteService`, `IQuoteService.cs` contains `IQuoteService`. Interfaces always prefixed with `I` (e.g. `IUnitOfWork.cs`, `IPolicyRepository.cs`).
- Backend controllers: `<Module>Controller.cs` (e.g. `PoliciesController.cs`, `QuotesController.cs`); one file occasionally hosts multiple related controllers when small (`SupportAndUwFileControllers.cs`).
- Backend DTOs: `<Module>Dto.cs` holding several related DTO classes for that module rather than one file per class.
- Angular 8 (`web/apex-ng8`): kebab-case with Angular suffix convention — `case-hub.component.ts`, `case-hub.service.ts`, `case-hub-routing.module.ts`, `case-hub.module.ts`, each paired with matching `.html`/`.css`.
- AngularJS (`web/apex-shell`): kebab-case `<screen>.controller.js` paired with `<screen>.html` in the sibling `views/` folder (e.g. `policy-detail.controller.js` ↔ `policy-detail.html`).
- SQL scripts: `<NN>_<Description>.sql`, zero-padded ordinal prefix controlling execution order (`01_CreateSchema.sql` … `05_WorkbenchDepth.sql`); note two files share prefix `04_` and two share `05_` — order within a prefix is not strictly encoded by the filename alone.
- Tests: `<Area>Tests.cs` for xUnit (`UwStructureSmokeTests.cs`); `<feature>.spec.js` for Playwright.

**Directories:**
- Backend: one folder per business module repeated identically across `ApexInsurance.Services.Contracts/{Module}` and `ApexInsurance.Services/{Module}` (e.g. `Quotes`, `Policies`, `Claims`, `Workflow`).
- Frontend (Angular 8): `features/<feature-name>/` per routed feature area; `core/` for singleton app-wide services; `shared/` for reusable UI pieces.
- Frontend (AngularJS): flat `controllers/`, `views/`, `services/`, `directives/` folders rather than per-feature folders.

## Where to Add New Code

**New Feature (backend module, e.g. a new business capability):**
- Primary code: add `src/ApexInsurance.Services.Contracts/<Module>/I<Module>Service.cs`, `src/ApexInsurance.Services/<Module>/<Module>Service.cs`, DTOs in `src/ApexInsurance.Dto/<Module>Dto.cs`, a controller in `src/ApexInsurance.Api/Controllers/<Module>Controller.cs` inheriting `ApexApiControllerBase`, request/response models in `src/ApexInsurance.Api/Models/<Module>/`, and a DI registration line in `src/ApexInsurance.Api/Program.cs`.
- Tests: `tests/ApexInsurance.Services.Tests/` for service-level xUnit tests; `tests/e2e/specs/<feature>.spec.js` plus a `docs/E2E-TEST-CASES.md` entry for E2E coverage.

**New Component/Module (frontend):**
- Angular 8 feature: `web/apex-ng8/src/app/features/<feature>/` with a `<feature>.module.ts`, `<feature>-routing.module.ts`, and component(s); register the route in `web/apex-ng8/src/app/app-routing.module.ts`; rebuild via `npm run build:ng8` (from `web/`) so it lands in `web/apex-shell/ng8`.
- AngularJS screen: add `web/apex-shell/app/controllers/<screen>.controller.js` + `web/apex-shell/app/views/<screen>.html`, and register the route/state in `web/apex-shell/config.js`.

**Utilities:**
- Backend shared helpers: `src/ApexInsurance.Shared/` (e.g. add alongside `Guard.cs`).
- Frontend shared Angular 8 code: `web/apex-ng8/src/app/core/` (cross-cutting services) or `web/apex-ng8/src/app/shared/` (reusable UI/pipes/directives).
- Frontend shared AngularJS code: `web/apex-shell/app/services/` or `app/directives/`.

## Special Directories

**src/*/obj and src/*/bin:**
- Purpose: .NET build intermediates and output (assembly info, nuget restore cache, compiled DLLs) for every project under `src/` and `tests/`.
- Generated: Yes (by `dotnet build`/`dotnet restore`).
- Committed: No — excluded via `.gitignore`; noted in `.rapidx/knowledge/GRAPH_REPORT.md` as containing orphaned auto-generated files (e.g. `src/ApexInsurance.Api/obj/Debug/net10.0/ApexInsurance.Api.AssemblyInfo.cs`) that should not be treated as hand-written source.

**web/apex-shell/ng8:**
- Purpose: Build target/output directory for the Angular 8 app — populated by `npm run build:ng8` (which runs `ng build --base-href /ng8/ --deploy-url /ng8/` inside `apex-ng8/`) so `serve-hybrid.js` can serve it under the `/ng8*` route.
- Generated: Yes.
- Committed: Contains prebuilt bundle files at inspection time (e.g. `common.js`, `features-admin-admin-module.js`, `features-case-hub-case-hub-module.js`, `features-dashboard-dashboard-module.js`, `features-login-login-module.js`) — treat as build output to regenerate via `npm run build:ng8`, not to hand-edit.

**tests/e2e/node_modules and tests/e2e/test-results:**
- Purpose: Playwright dependency cache and per-run test artifacts (traces, screenshots).
- Generated: Yes.
- Committed: No.

**App_Data (src/ApexInsurance.Api/App_Data):**
- Purpose: Default on-disk root for uploaded documents when `Apex:Documents:RootPath`/`DocumentStoragePath` config is not set (see `DocumentService` wiring in `Program.cs`).
- Generated: Yes, at runtime.
- Committed: No (runtime data).

---

*Structure analysis: 2026-08-13*
