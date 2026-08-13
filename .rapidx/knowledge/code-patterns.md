# Code Patterns — Learned from Codebase

**Learned**: 2026-08-13
**Files analyzed**: 50 source files (sampled 30)
**Stack**: {"frontend":"angular","backend":"csharp","db":"sqlserver"}

---

## File Naming Conventions

- **Dominant style**: PascalCase
- **Module imports**: Mixed ESM/CJS
- **Module exports**: Default exports preferred

## Test File Structure

- Test files found: 10
- Convention: Co-located test files (*.test.ts / *.spec.ts)

## Notes for AI agents

When generating new code for this project:
1. Follow the **PascalCase** naming convention for new files
2. Use **Mixed ESM/CJS** style for module imports
3. Use **Default exports preferred** pattern for module exports
4. Write tests following the detected test convention above

## Anti-patterns (do NOT use)

- Do not introduce new naming conventions that differ from the dominant style
- Do not mix ESM and CJS imports in the same file
- Do not create files without corresponding tests in src/ directories

---
*Regenerate with: `/rapidx:learn --code` or `node scripts/learn-codebase.js --code`*
