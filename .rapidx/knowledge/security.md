# Security Artifacts

**Extracted**: 2026-08-13
**Security docs**: none

---

## Security tooling detected

- CODEOWNERS: no
- Dependabot: no
- Semgrep: no
- CodeQL: no
- Secret scanning (gitleaks): no
- .env.example present: no

## Security documentation

_No SECURITY.md / threat model found. Add one and re-run `/rapidx:learn --security`._

---

## Notes for AI agents & invariants

1. Honor the security requirements above in every change (auth, validation, secrets).
2. The `security-reviewer` agent and `secret-scanner` hook enforce a baseline already.
3. Encode hard security rules as `error`-severity **invariants** via `/rapidx:invariant-catalog`.

---
*Regenerate with: `/rapidx:learn --security`*
