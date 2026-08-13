# External Integrations

**Analysis Date:** 2026-08-13

## APIs & External Services

**Note on scope:** This is a self-contained demo/training app modeling a London Market underwriting workbench. `docs/UW-SOLUTION-MAP.md:31-32` explicitly lists the real-world integrations it deliberately stubs out rather than implements: Open Box (legacy PAS, via SOAP/ViewService in the real world), DM22, Dynamics CRM, Lloyd's/DXC, and Active Directory. None of these are real network integrations in this codebase.

**Legacy Policy Admin System ("Open Box") — stubbed, not real:**
- Represented by `ApexInsurance.Data.OpenBox` — `src/ApexInsurance.Data.OpenBox/LocalOpenBoxGateway.cs` (implements `IOpenBoxGateway`) simulates the downstream policy-admin system entirely in-process/in-DB; no outbound HTTP/SOAP call exists.
  - Event transport: `src/ApexInsurance.Data.OpenBox/OpenBoxIntegrationBus.cs` implements `IOpenBoxIntegrationBus`, publishing "Open Box" and insured-party domain events to RabbitMQ when enabled, else buffering in an in-memory queue — see "Data Storage / Messaging" below.
  - Consumed by two hosted services in the API: `src/ApexInsurance.Api/Infrastructure/OpenBoxBusConsumerHostedService.cs` and `InsuredPartyBusConsumerHostedService.cs`.

**Third-party UI library (CDN, not an API):**
- ag-Grid Community 31.3.4 — loaded directly from `https://cdn.jsdelivr.net/npm/ag-grid-community@31.3.4/...` in `web/apex-shell/index.html:101-102`; client-side grid rendering only, no server-side ag-Grid service.

**External links referenced but not integrated (placeholder URLs):**
- `web/apex-shell/config.js` defines `pricingUrl`, `ePlacementUrl`, `selfServiceUrl` all pointing at `https://example.invalid/...` — deep-link placeholders for portals that don't exist in this environment; no client/SDK code calls them.

**No integrations detected for:** payment processing, email/SMS delivery, external identity providers (OAuth/SAML/SSO), cloud storage APIs (S3/Blob), analytics/telemetry SDKs, or LLM/AI APIs. No `HttpClient`, `RestSharp`, or `Refit` usage was found anywhere under `src/`.

## Data Storage

**Databases:**
- Microsoft SQL Server (SQL Server or Azure SQL) — sole datastore
  - Connection: `ConnectionStrings:ApexInsurance` key in `src/ApexInsurance.Api/appsettings.json` (currently holds a live-looking Azure SQL credential committed to source — see Secrets section)
  - Client/ORM: Entity Framework Core 10.0.0 (`Microsoft.EntityFrameworkCore.SqlServer`), `ApexInsuranceDbContext` in `src/ApexInsurance.Data`
  - Schema management: **hand-written SQL scripts**, not EF Core Migrations — `database/01_CreateSchema.sql`, `02_SeedData.sql`, `03_SampleQueries.sql`, `04_DemoBrokerOpsUser.sql`, `04_MarketFields.sql`, `05_InsuredExternalId.sql`, `05_WorkbenchDepth.sql`. `src/ApexInsurance.Api/Program.cs:119,132-158` also runs an ad-hoc `ExecuteSqlRaw` idempotent column/index check at startup (`Insureds.ExternalId`) — an unusual mix of script-managed and code-managed schema drift.

**File Storage:**
- Local filesystem only — document uploads stored under a configurable root (`Apex:Documents:RootPath` / `DocumentStoragePath`, default `App_Data/Documents`), resolved relative to `ContentRootPath` in `src/ApexInsurance.Api/Program.cs:92-115`. No cloud storage (S3, Azure Blob, GCS) integration.

**Caching:**
- None detected — no Redis, Memcached, `IMemoryCache`/`IDistributedCache` registrations, or CDN caching layer (the hybrid dev host `web/serve-hybrid.js` explicitly sends no HTTP cache headers).

**Messaging:**
- RabbitMQ 3.13 (management image) — optional, gated by `Apex:RabbitMQ:Enabled` config
  - Client: `RabbitMQ.Client` 6.8.1 NuGet package, wired in `src/ApexInsurance.Data.OpenBox/OpenBoxIntegrationBus.cs`
  - Local dev broker: `docker-compose.rabbitmq.yml` (ports 5672 AMQP, 15672 management UI; default `guest`/`guest` credentials)
  - Exchange/queues: `apex.openbox` exchange, routing keys `obx.events` / `party.insured`, queues `apex.workbench.obx` / `apex.workbench.insured` (all configurable under `Apex:RabbitMQ:*` in `appsettings.json`)
  - Fallback: when disabled or unreachable, the bus degrades to an in-memory queue with no data loss to callers (`Mode` property reports `"RabbitMQ"` vs `"InMemory"`)

## Authentication & Identity

**Auth Provider:**
- Custom, demo-only — no external identity provider (no OAuth/OIDC/SAML/Azure AD/Okta/Auth0 integration exists)
  - Implementation: `src/ApexInsurance.Security/DemoTokenService.cs` issues **unsigned** Base64-encoded JSON "bearer tokens" (`{"UserId","Username","Role","Exp"}`) — no HMAC/JWT signature validation anywhere in the codebase, despite an unused `Apex:Auth:TokenSigningKey` config placeholder in `appsettings.json`
  - Token extraction: `CurrentUserContext.TryExtractBearerToken` in `src/ApexInsurance.Api/Infrastructure/CurrentUserContext.cs` accepts the token from either the `Authorization` header or an `?access_token=` query string parameter
  - Role enforcement: custom `AuthorizeRoleAttribute` filter (`src/ApexInsurance.Api/Filters`), registered globally in `Program.cs:40`
  - Demo password fallback: `AuthService` (per `.planning/RISKS.md` item 4) accepts a hardcoded literal password for any seeded user with a NULL password hash — documented as a critical risk if ever pointed at a non-demo environment.

## Monitoring & Observability

**Error Tracking:**
- None — no Sentry, Application Insights, Datadog, or similar SDK detected. Exceptions are funneled through a custom `ApiExceptionFilterAttribute` (`src/ApexInsurance.Api/Filters`) and an `AuditActionFilterAttribute` that writes to the app's own `AuditLog` domain entity/table (via `IAuditService`), not an external APM.

**Logs:**
- Standard ASP.NET Core `ILogger` / `Microsoft.Extensions.Logging` console logging, configured via `Logging:LogLevel` in `appsettings.json` / `appsettings.Development.json`. No structured log shipping (Serilog sinks, ELK, Seq) detected.

## CI/CD & Deployment

**Hosting:**
- Not applicable / not configured — no Dockerfile, Kubernetes manifests, or cloud deployment templates found. `src/ApexInsurance.Api/Program.cs:34` hardcodes the API to `http://localhost:52840`; the hybrid frontend host listens on port 4200 (`web/serve-hybrid.js`, override via `PORT` env var).

**CI Pipeline:**
- None — no `.github/workflows/`, `azure-pipelines.yml`, or `Jenkinsfile` exists anywhere in the repo (confirmed absent; also called out in `.planning/RISKS.md` item 5). The xUnit and Playwright suites exist but do not run automatically on any trigger.

## Environment Configuration

**Required env vars:**
- Backend: none are strictly required as env vars today — all config is read from `appsettings.json`/`appsettings.Development.json` via `IConfiguration`, with no `DOTNET_ENVIRONMENT`-specific override files beyond `Development`. In production use, `ConnectionStrings__ApexInsurance`, `Apex__Auth__TokenSigningKey`, and the `Apex__RabbitMQ__*` keys should be supplied via environment variables/secrets manager rather than the committed JSON (they currently are not).
- Playwright E2E: `APEX_UI_URL` (default `http://localhost:4200`), `APEX_API_URL` (default `http://localhost:52840`) — `tests/e2e/playwright.config.js`
- Frontend host: `PORT` (default `4200`) — `web/serve-hybrid.js`

**Secrets location:**
- Currently **in source control**, not a secrets manager: `src/ApexInsurance.Api/appsettings.json` defines the keys `ConnectionStrings:ApexInsurance` (SQL connection string) and `Apex:Auth:TokenSigningKey`, both holding literal values committed to git. `appsettings.Development.json` also defines `Apex:RabbitMQ:Username`/`Password` (local dev defaults). This is flagged as the top critical risk in `.planning/RISKS.md` (item 1) — no `.env` files, User Secrets, or Key Vault integration were found anywhere in the repo.

## Webhooks & Callbacks

**Incoming:**
- None — no webhook receiver endpoints were found among the API controllers (`src/ApexInsurance.Api/Controllers`); all controller routes serve the workbench's own UI.

**Outgoing:**
- None — no outbound webhook calls (e.g., to Slack, Teams, or partner systems) were found. The closest analog is the RabbitMQ event publishing described above, which is an internal message bus, not a webhook.

---

*Integration audit: 2026-08-13*
