# Coding Conventions

**Analysis Date:** 2026-08-13

## Naming Patterns

**Files:**
- C# files are named after their single primary type, PascalCase, matching the class exactly: `PoliciesController.cs`, `PolicyService.cs`, `ApexApiException.cs`, `Guard.cs`. Multiple related small types can share one file when tightly coupled (`src/ApexInsurance.Api/Infrastructure/ApexApiException.cs` holds `ApexApiException`, `ApexNotFoundException`, `ApexValidationException`, `ApexForbiddenException`, `ApexConflictException`; `src/ApexInsurance.Api/Controllers/SupportAndUwFileControllers.cs` holds two controllers).
- Angular 8 (`web/apex-ng8/src/app/...`) follows Angular CLI conventions: `dashboard.component.ts`, `dashboard.component.html`, `dashboard.component.css`, `dashboard.service.ts`, `dashboard.module.ts`, `dashboard-routing.module.ts` — kebab-case file name + dot-separated role suffix.
- Test files mirror the thing under test with a `Tests`/`SmokeTests` suffix: `UwStructureSmokeTests.cs`, `SecurityAndSharedSmokeTests.cs`. Playwright specs are kebab-case + `.spec.js`: `tests/e2e/specs/auth.spec.js`, `tests/e2e/specs/mi-policies-claims.spec.js`.

**Functions:**
- C# methods/properties: PascalCase (`BindQuote`, `GetRenewalDiary`, `CreateRenewalSubmission`). Private static helpers also PascalCase (`GeneratePolicyNumber`, `ToDto` in `src/ApexInsurance.Api/Controllers/PoliciesController.cs:177`).
- TypeScript methods: camelCase (`getSummary`, `getPipelinePulse` in `web/apex-ng8/src/app/features/dashboard/dashboard.service.ts`).

**Variables:**
- C# private fields: `_camelCase` with leading underscore (`_policyService`, `_unitOfWork` — see `src/ApexInsurance.Api/Controllers/PoliciesController.cs:21-22` and `src/ApexInsurance.Services/Policies/PolicyService.cs:13`).
- C# locals/parameters: camelCase (`statusFilter`, `totalCount`, `daysAhead`).
- TypeScript constructor-injected fields: camelCase, no prefix, injected via `private` constructor params (`private api: ApiService` in `dashboard.service.ts`).

**Types:**
- Interfaces prefixed with `I`: `IPolicyService`, `IUnitOfWork`, `IOpenBoxGateway`, `IPipelineService` (`src/ApexInsurance.Services.Contracts/Policies/IPolicyService.cs`).
- DTOs suffixed `Dto` or `Request`/`ViewModel`: `PolicyDto`, `BindQuoteRequest`, `EndorsePolicyRequest`, `PagedResultViewModel<T>`, `PipelineWorkbenchViewModel`.
- Controllers suffixed `Controller`; services suffixed `Service`; exceptions prefixed `Apex` and suffixed `Exception` (`ApexNotFoundException`, `ApexValidationException`).
- Angular components/services follow CLI suffix convention: `DashboardComponent`, `DashboardService`, `DashboardRoutingModule`.

## Code Style

**Formatting:**
- No `.editorconfig` committed at the repo root or any project root (only auto-generated MSBuild ones under `obj/`, e.g. `src/ApexInsurance.Api/obj/Debug/net10.0/ApexInsurance.Api.GeneratedMSBuildEditorConfig.editorconfig` — these are build artifacts, not style config).
- No `dotnet format` config or Directory.Build.props found. Formatting is by convention only: 4-space indentation, Allman-style braces (opening brace on its own line) throughout `src/`.
- Angular workspace has no `.prettierrc`; formatting is enforced only by `tslint` rules (see Linting).

**Linting:**
- C#/.NET: no `.editorconfig`, no StyleCop/analyzers package referenced in any `.csproj`. No linting enforced on the backend beyond compiler warnings (`Nullable` enabled, `ImplicitUsings` enabled — see `tests/ApexInsurance.Api.Tests/ApexInsurance.Api.Tests.csproj`).
- Angular: `web/apex-ng8/tslint.json` extends `tslint:recommended` with project rules: single quotes only (`"quotemark": [true, "single"]`), 140-char max line length, `component-selector` must be `apex` kebab-case element, `directive-selector` must be `apex` camelCase attribute, `no-non-null-assertion` enabled, `member-ordering` enforced (static-field, instance-field, static-method, instance-method).

## Import Organization

**Order (C#):**
1. `System.*` namespaces first (`System`, `System.Linq`, `System.Collections.Generic`)
2. Third-party/framework namespaces (`Microsoft.AspNetCore.Mvc`, `Microsoft.EntityFrameworkCore`)
3. Project namespaces, alphabetical-ish by layer (`ApexInsurance.Api.*`, then `ApexInsurance.Data`, `ApexInsurance.Domain.*`, `ApexInsurance.Services.*`) — see `src/ApexInsurance.Api/Controllers/PoliciesController.cs:1-12`.
- Not enforced by tooling (no `ordered-imports` equivalent for C#) — this is an observed convention, not a lint rule.

**Order (TypeScript, Angular):**
1. `@angular/*` imports first (`import { Injectable } from '@angular/core';`)
2. Third-party libs (`rxjs`)
3. Relative project imports last (`'../../core/api.service'`, `'../../core/models'`)
- `tslint.json` explicitly sets `"ordered-imports": false` — order is convention, not enforced.

**Path Aliases:**
- None. `web/apex-ng8/tsconfig.json` sets `"baseUrl": "./"` but defines no `paths` map — all cross-module imports use relative paths (`'../../core/api.service'`).

## Error Handling

**Patterns:**
- Backend uses a centralized `ExceptionFilterAttribute` (`src/ApexInsurance.Api/Filters/ApiExceptionFilterAttribute.cs`) that classifies any exception surfacing from a controller into an HTTP status + JSON body — controllers and services do **not** need try/catch for the happy-path-to-error translation.
- A small typed exception hierarchy in `src/ApexInsurance.Api/Infrastructure/ApexApiException.cs` (`ApexNotFoundException` → 404, `ApexValidationException` → 400, `ApexForbiddenException` → 403, `ApexConflictException` → 409) lets service/domain code opt into a precise status code. Plain BCL exceptions are also mapped by convention: `ArgumentException` → 400, `UnauthorizedAccessException` → 401, `KeyNotFoundException` → 404, `InvalidOperationException` → 404 if message contains "not found" else 409, anything else → generic 500 with a user-safe message.
- Services guard inputs at the top of public methods with explicit checks and throw immediately, e.g. `if (request == null) throw new ArgumentNullException(nameof(request));` and `if (quote == null) throw new InvalidOperationException($"Quote {request.QuoteId} not found.");` (`src/ApexInsurance.Services/Policies/PolicyService.cs:21-30`). The shared `Guard` helper (`src/ApexInsurance.Shared/Guard.cs`) offers `Guard.NotNull` / `Guard.NotBlank` for the same purpose but is used inconsistently — most services still inline the null checks rather than call `Guard`.
- Controllers do minimal manual handling — mostly `if (x == null) return NotFound();` / `return BadRequest(...)` for request-shape validation (`src/ApexInsurance.Api/Controllers/PoliciesController.cs:92-95, 118-121`) — and let the exception filter handle everything else.
- `AuditActionFilterAttribute` (`src/ApexInsurance.Api/Filters/AuditActionFilterAttribute.cs`) wraps its own audit-write logic in try/catch and only logs a warning on failure, so an audit-log failure never breaks the actual request.

## Logging

**Framework:** ASP.NET Core built-in `Microsoft.Extensions.Logging` (`ILogger<T>` resolved via DI or `HttpContext.RequestServices.GetService<ILogger<T>>()`); no Serilog/NLog package referenced.

**Patterns:**
- Structured logging with named placeholders, not string interpolation: `logger?.LogError(exception, "Unhandled exception on {Method} {Path}", context.HttpContext.Request.Method, context.HttpContext.Request.Path);` (`src/ApexInsurance.Api/Filters/ApiExceptionFilterAttribute.cs:23-25`).
- Logger is resolved lazily via `RequestServices.GetService<ILogger<T>>()` inside filters rather than constructor-injected, since `ExceptionFilterAttribute`/`ActionFilterAttribute` subclasses are instantiated by the MVC pipeline, not by DI directly.
- Logging is null-conditional (`logger?.Log...`) everywhere it's used, defensively guarding against a missing logger.
- Non-critical failures (e.g., audit write failures) are logged at `LogWarning`, not `LogError`, so they're visible but don't look like outages.
- Most service/domain classes (e.g. `PolicyService`) have **no logging at all** — logging is concentrated in the API layer (filters, hosted services), not the business-logic layer.

## Comments

**When to Comment:**
- XML `<summary>` doc comments are used on controller action methods to state the HTTP verb/route and describe non-obvious behavior, e.g. `/// <summary>POST api/policies/bind - converts a selected quote into a bound policy.</summary>` and the longer note on `List()` explaining why it bypasses `IPolicyService` (`src/ApexInsurance.Api/Controllers/PoliciesController.cs:30-34, 79, 113, 168`).
- Inline `//` comments explain *why*, not *what*, and are used sparingly at decision points, e.g. `// List endpoint: related collections are not loaded — return empty lists.` (`src/ApexInsurance.Api/Controllers/PoliciesController.cs:179`).
- Class-level `<summary>` comments explain the role of infrastructure types in the larger system, e.g. `ApexApiControllerBase` and `ApexApiException` (`src/ApexInsurance.Api/Controllers/ApexApiControllerBase.cs:5-9`, `src/ApexInsurance.Api/Infrastructure/ApexApiException.cs:5-11`).
- Simple CRUD-ish controller actions and DTO mapping methods are left uncommented — comments are reserved for non-obvious routing quirks or deliberate deviations from the "normal" pattern.

**XML doc comments:**
- Used selectively on controllers and infrastructure/base classes, not on every public member. Domain entities, DTOs, and most service methods have no XML docs.

## Function Design

**Size:** Controller actions and service methods are short — typically 5–30 lines, one HTTP verb/one business operation per method. `PolicyService.BindQuote` (`src/ApexInsurance.Services/Policies/PolicyService.cs:19-68`) is on the longer end (~50 lines) because it performs a multi-entity state transition (quote → policy → submission → prior policy) in one transaction; this appears to be the practical ceiling before a method would be split.

**Parameters:** Controller actions take primitive query params with defaults (`int page = 1, int pageSize = 25`) for GET/list endpoints, and a single request DTO for POST/PUT bodies (`BindQuoteRequest request`, `EndorsePolicyRequest request`). Service methods take a single request DTO or scalar IDs — never long positional parameter lists.

**Return Values:** Controllers return `IActionResult` (not typed `ActionResult<T>`) uniformly, wrapping results in `Ok(...)`, `NotFound()`, `BadRequest(...)`, or `Created(location, body)`. Services return DTOs (`PolicyDto`), never EF entities, across the public interface boundary (`IPolicyService` in `src/ApexInsurance.Services.Contracts/Policies/IPolicyService.cs`) — entity-to-DTO mapping happens either in the service (`MapToDto`) or, for read-only list endpoints that bypass the service, in a private static `ToDto` helper on the controller itself.

## Module Design

**Exports:** C# uses one-public-type-per-file as the norm (exceptions file is the deliberate exception). Solution is split into layered class-library projects: `ApexInsurance.Domain` (entities/enums) → `ApexInsurance.Data` (EF Core/repositories) → `ApexInsurance.Services.Contracts` (interfaces) / `ApexInsurance.Services` (implementations) → `ApexInsurance.Api` (controllers). `ApexInsurance.Dto`, `ApexInsurance.Shared`, and `ApexInsurance.Security` are cross-cutting. `ApexInsurance.Data.OpenBox` is an intentionally isolated stub of a fictional legacy system, not a real integration (per `docs/UW-SOLUTION-MAP.md`).
- Angular: each feature (`web/apex-ng8/src/app/features/dashboard/`) exports a `*.module.ts` with its own routing module, following the Angular CLI feature-module pattern; `core/` holds singleton, app-wide services (`ApiService`, `AuthService`, `AuthGuard`, `AuthInterceptor`) provided at `root`.

**Barrel Files:** Not used. No `index.ts` re-export barrels found under `web/apex-ng8/src/app/`; imports reference concrete files directly (`'../../core/api.service'`).

---

*Convention analysis: 2026-08-13*
