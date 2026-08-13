# Codebase Knowledge Graph — Report

**Built**: 2026-08-13T07:07:30.951Z
**Generator**: rapidx-native
**Root**: apex-insurance-11

## Metrics

- Files: **270**
- Classes/Types: **287**
- Functions/Methods: **659**
- External modules: **14**
- Edges: **1139**

## Hub modules (highest coupling)

- `web/apex-shell/ng8/polyfills.js` — degree 67 (imported by 0)
- `web/apex-shell/ng8/main.js` — degree 47 (imported by 0)
- `scripts/learn-codebase.js` — degree 29 (imported by 0)
- `scripts/build-knowledge-graph.js` — degree 26 (imported by 0)
- `src/ApexInsurance.Services/Admin/AdminService.cs` — degree 22 (imported by 0)
- `src/ApexInsurance.Api/Controllers/AdminController.cs` — degree 21 (imported by 0)
- `tests/e2e/fixtures.js` — degree 19 (imported by 10)
- `src/ApexInsurance.Services/Workflow/WorkflowService.cs` — degree 17 (imported by 0)
- `web/apex-ng8/src/app/core/api.service.ts` — degree 17 (imported by 11)
- `web/apex-ng8/src/app/core/auth.service.ts` — degree 17 (imported by 9)
- `src/ApexInsurance.Dto/AdminDto.cs` — degree 16 (imported by 0)
- `src/ApexInsurance.Services/Pipeline/PipelineService.cs` — degree 16 (imported by 0)

## Most-imported files (core abstractions)

- `web/apex-ng8/src/app/core/models.ts` — imported 14×
- `web/apex-ng8/src/app/core/api.service.ts` — imported 11×
- `tests/e2e/fixtures.js` — imported 10×
- `web/apex-ng8/src/app/core/auth.service.ts` — imported 9×
- `web/apex-ng8/src/app/shared/shared.module.ts` — imported 6×
- `web/apex-ng8/src/environments/environment.ts` — imported 6×
- `web/apex-ng8/src/app/features/admin/admin.component.ts` — imported 2×
- `web/apex-ng8/src/app/features/case-hub/case-hub-list.component.ts` — imported 2×
- `web/apex-ng8/src/app/features/case-hub/case-hub.component.ts` — imported 2×
- `web/apex-ng8/src/app/features/case-hub/case-hub.service.ts` — imported 2×

## Top external dependencies

- `@angular` — used by 62 files
- `rxjs` — used by 17 files
- `fs` — used by 5 files
- `path` — used by 4 files
- `child_process` — used by 2 files
- `@playwright` — used by 2 files
- `classlist.js` — used by 2 files
- `web-animations-js` — used by 2 files
- `) && content.includes(` — used by 1 files
- `)) cjs++;
  }
  return esm > cjs ? ` — used by 1 files
- `os` — used by 1 files
- `zone.js` — used by 1 files
- `http` — used by 1 files
- `url` — used by 1 files

## Potential orphans (no imports in or out)

- `src/ApexInsurance.Api/Program.cs`
- `src/ApexInsurance.Api/obj/Debug/net10.0/ApexInsurance.Api.AssemblyInfo.cs`
- `src/ApexInsurance.Data/IUnitOfWork.cs`
- `src/ApexInsurance.Data/Repositories/IBrokerRepository.cs`
- `src/ApexInsurance.Data/Repositories/IClaimRepository.cs`
- `src/ApexInsurance.Data/Repositories/IDashboardRepository.cs`
- `src/ApexInsurance.Data/Repositories/IDocumentRepository.cs`
- `src/ApexInsurance.Data/Repositories/IPolicyRepository.cs`
- `src/ApexInsurance.Data/Repositories/IQuoteRepository.cs`
- `src/ApexInsurance.Data/Repositories/IRepository.cs`
- `src/ApexInsurance.Data/Repositories/ISubmissionRepository.cs`
- `src/ApexInsurance.Data/Repositories/IUserRepository.cs`
- `src/ApexInsurance.Data/obj/Debug/net10.0/ApexInsurance.Data.AssemblyInfo.cs`
- `src/ApexInsurance.Data.OpenBox/obj/Debug/net10.0/ApexInsurance.Data.OpenBox.AssemblyInfo.cs`
- `src/ApexInsurance.Domain/Enums/ClaimStatus.cs`
- `src/ApexInsurance.Domain/Enums/DocumentType.cs`
- `src/ApexInsurance.Domain/Enums/LineOfBusiness.cs`
- `src/ApexInsurance.Domain/Enums/PolicyStatus.cs`
- `src/ApexInsurance.Domain/Enums/ReferralDecision.cs`
- `src/ApexInsurance.Domain/Enums/SubmissionStatus.cs`

## Notes for AI agents

1. Treat **hub modules** as high-blast-radius — changes there ripple widely.
2. **Most-imported files** define core contracts; preserve their interfaces.
3. Query this graph for impact analysis before edits:
   `node .rapidx/hooks/lib/graph-query.cjs <term>`
4. Open `.rapidx/knowledge/graph.html` for an interactive view.

---
*Regenerate with: `/rapidx:knowledge-graph` or `node scripts/build-knowledge-graph.js`*
