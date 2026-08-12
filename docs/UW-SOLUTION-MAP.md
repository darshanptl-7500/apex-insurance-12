# UW solution map (Apex)

Apex mirrors a classic underwriting-workbench N-tier layout under .NET 10. Product behaviour is unchanged.

| Classic UW layer | Apex project | Role |
|-------------|--------------|------|
| `Apex.UW.Web` | `ApexInsurance.Api` | Web host + API controllers (UW Web equivalent) |
| `Apex.UW.UI` | `ApexInsurance.UI` | ViewModels / presentation mapping |
| `ServiceLayer.Contracts` | `ApexInsurance.Services.Contracts` | Service interfaces (Pipeline, UW File, Support, …) |
| `ServiceImplementations` | `ApexInsurance.Services` | Implementations |
| `DomainModel` | `ApexInsurance.Domain` | Entities / enums |
| `Data.UW` | `ApexInsurance.Data` | EF + UnitOfWork |
| `Data.OBX` | `ApexInsurance.Data.OpenBox` | Stub Open Box gateway (local DB mirror) |
| `DTO` | `ApexInsurance.Dto` | Shared DTOs (`ApexInsurance.Services.Dto` namespace retained) |
| `Shared` | `ApexInsurance.Shared` | Cross-cutting helpers |
| `Web.Security` | `ApexInsurance.Security` | Demo token issuer |
| Tests | `tests/ApexInsurance.Services.Tests`, `tests/ApexInsurance.Api.Tests` | Smoke tests |

## Front-end layout (UW-like)

Local hybrid host remains `web/serve-hybrid.js` → `http://localhost:4200` (single origin for AngularJS + ng8).

| UW path | Apex path |
|----------|-----------|
| `Scripts/UW/` | `web/Scripts/UW` → `web/apex-shell` |
| `Scripts/ng8/` | `web/Scripts/ng8` → `web/apex-shell/ng8` |
| `Content/` | `web/Content/css` → `web/apex-shell/css` |

## Explicit stubs (not real integrations)

- Open Box SOAP / ViewService — `LocalOpenBoxGateway`
- DM22, Dynamics CRM, Lloyd’s/DXC, RabbitMQ, Active Directory — out of scope
