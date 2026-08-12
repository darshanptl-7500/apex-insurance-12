# E2E (Playwright)

Automated coverage for **all** cases in [docs/E2E-TEST-CASES.md](../../docs/E2E-TEST-CASES.md).

## Spec map

| Spec file | Catalog IDs |
|-----------|-------------|
| `auth.spec.js` | TC-AUTH-01 … 07 |
| `nav.spec.js` | TC-NAV-01 … 06 |
| `pipeline-and-risk.spec.js` | TC-PIPE-01 … 06, TC-RISK-01 … 04 |
| `uw-file.spec.js` | TC-UW-01 … 10 |
| `documents.spec.js` | TC-DOC-01 … 04 |
| `tasks.spec.js` | TC-TASK-01 … 03 |
| `search.spec.js` | TC-SEARCH-01 … 03 |
| `connect.spec.js` | TC-CONN-01 … 04 |
| `openbox-support.spec.js` | TC-OBX-01 … 04, TC-SUP-01 … 02 |
| `mi-policies-claims.spec.js` | TC-MI-01 … 03, TC-POL-01 … 02, TC-CLM-01 … 02 |

## Prerequisites

1. API on `http://localhost:52840`
2. UI on `http://localhost:4200` (`cd web && nvm use 12 && npm start`)
3. **Node.js 20+** for Playwright (`nvm use 20`)

## Setup

```bash
cd tests/e2e
nvm use 20
npm install
npx playwright install chromium
```

## Run

```bash
nvm use 20
npm test                 # full catalog
npm run test:smoke       # @smoke pack only
npm run test:ui          # interactive
```

## Env overrides

| Variable | Default |
|----------|---------|
| `APEX_UI_URL` | `http://localhost:4200` |
| `APEX_API_URL` | `http://localhost:52840` |
| `APEX_E2E_USER` | `uw1` |
| `APEX_E2E_PASSWORD` | `Password1!` |
