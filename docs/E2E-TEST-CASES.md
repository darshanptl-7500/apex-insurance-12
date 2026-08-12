# Apex UW Workbench — E2E Test Cases

**App under test:** Hybrid UI `http://localhost:4200` + API `http://localhost:52840`  
**Default user:** `uw1` / `Password1!`  
**Prerequisites:** API + hybrid UI running; seed data loaded; optional RabbitMQ for bus cases.

**Legend:** P0 = smoke / release gate · P1 = core journey · P2 = extended

---

## TC-AUTH — Authentication

| ID | Priority | Title | Steps | Expected |
|----|----------|-------|-------|----------|
| TC-AUTH-01 | P0 | Valid login (uw1) | Open `/#!/login` → enter `uw1` / `Password1!` → Sign in | Redirect to Pipeline Upcoming; chrome shows user name + Underwriter role |
| TC-AUTH-02 | P0 | Invalid password | Enter `uw1` / wrong password → Sign in | Error shown; stay on login; no chrome |
| TC-AUTH-03 | P0 | Unauthenticated redirect | Clear storage → open `/#!/pipeline/upcoming` | Redirected to login |
| TC-AUTH-04 | P1 | Demo role picker | Click a demo account button | Credentials filled / signed in for that role |
| TC-AUTH-05 | P1 | Logout | Sign in → Log out | Returned to login; protected routes require login again |
| TC-AUTH-06 | P1 | Admin sees Admin nav | Login as `admin` | Admin link visible in primary nav |
| TC-AUTH-07 | P1 | UW does not see Admin | Login as `uw1` | Admin link not shown |

---

## TC-NAV — Shell & navigation (FR-01)

| ID | Priority | Title | Steps | Expected |
|----|----------|-------|-------|----------|
| TC-NAV-01 | P0 | Brand shows Apex UW | Login | Top bar: Apex + **UW** + Workbench |
| TC-NAV-02 | P0 | Primary nav modules | Login → click each: Dashboard, Reporting, Pipeline, Tasks, Underwriter's File, Advanced Search, Connect, Pricing, Support, Open Box | Each route loads without error; active state updates |
| TC-NAV-03 | P0 | + NEW RISK CTA | Click **+ NEW RISK** | `/#!/submissions/new` with New Risk form |
| TC-NAV-04 | P1 | Global search | Enter term in global search → submit | Lands on Advanced Search with results or empty state (no crash) |
| TC-NAV-05 | P1 | ROE menu | Open ROE → select USD | ROE label updates to USD |
| TC-NAV-06 | P2 | E-Placement external | Click E-Placement | Opens configured external URL (new tab) |

---

## TC-PIPE — Pipeline (FR-02)

| ID | Priority | Title | Steps | Expected |
|----|----------|-------|-------|----------|
| TC-PIPE-01 | P0 | Upcoming loads | Open Pipeline | Grid/table renders; bucket **upcoming** active |
| TC-PIPE-02 | P0 | Bucket switch | Click another rail bucket (e.g. Quoted / Bound) | Title/bucket changes; data refreshes |
| TC-PIPE-03 | P1 | Column filter | Apply a column operator filter | Rows filtered; clear restores |
| TC-PIPE-04 | P1 | Paging | If > page size, go next page | Page indicator / rows change |
| TC-PIPE-05 | P1 | Open UW File from row | Click risk / UW File link | Opens Underwriter's File for that submission |
| TC-PIPE-06 | P2 | Export Excel | Click Export to Excel | Download starts or export succeeds |

---

## TC-RISK — New Risk / submission (FR-03)

| ID | Priority | Title | Steps | Expected |
|----|----------|-------|-------|----------|
| TC-RISK-01 | P0 | Create wireframe risk | + NEW RISK → select Insured + Broker → set inception → Submit | Success; risk appears in Upcoming / Open Box |
| TC-RISK-02 | P0 | Validation required fields | Submit with empty insured/broker | Validation / error; no create |
| TC-RISK-03 | P1 | Broker & insured dropdowns | Open New Risk | Lists populated from API |
| TC-RISK-04 | P1 | Business area & LOB | Change area/LOB | Values retained on submit payload |

---

## TC-UW — Underwriter's File (FR-04–07)

| ID | Priority | Title | Steps | Expected |
|----|----------|-------|-------|----------|
| TC-UW-01 | P0 | List page | Open Underwriter's File (`/ng8/case-hub`) | List/grid of submissions |
| TC-UW-02 | P0 | Open file | Open a known submission | Risk header shows account, UW ref, status |
| TC-UW-03 | P0 | Policy Summary tab | Policy nav → Summary | Inception, broker, UMR, insured, Apex Share metrics visible |
| TC-UW-04 | P1 | Sections / quotes | Quotes tab | Section grid; create/select quote if unbound |
| TC-UW-05 | P1 | Edit / Note → Open Box | Edit / Note → change fields → Submit | Success; fields refresh from replica |
| TC-UW-06 | P1 | Performance tabs | Performance → Apex Line Share / 100% Order | Tables render (rows or empty state) |
| TC-UW-07 | P1 | Claims pane | Claim nav | KPIs (ILR, CAP, Apex Share NP) + claim rows or empty |
| TC-UW-08 | P1 | Documents pane | Documents → Download | Authenticated download succeeds (not 401) |
| TC-UW-09 | P1 | Activity log | Activity Log | Tasks/audits listed or empty state |
| TC-UW-10 | P2 | Model deep-link | Click Model | Pricing opens with `submissionId` |

---

## TC-DOC — Documents (FR-05)

| ID | Priority | Title | Steps | Expected |
|----|----------|-------|-------|----------|
| TC-DOC-01 | P0 | Documents list | Open `/#!/documents` | List loads |
| TC-DOC-02 | P1 | Upload | Upload PDF/PNG with submission id | Appears in list |
| TC-DOC-03 | P0 | Download with auth | Download from Documents or UW File | File saved; Content-Disposition present |
| TC-DOC-04 | P1 | PDF preview | Preview PDF | Iframe/preview loads (tokenized URL) |

---

## TC-TASK — Tasks & inbox (FR-07)

| ID | Priority | Title | Steps | Expected |
|----|----------|-------|-------|----------|
| TC-TASK-01 | P0 | Inbox loads | Open Tasks | Task list / empty state |
| TC-TASK-02 | P1 | Open task detail | Open a task | Detail form; complete/comment actions work |
| TC-TASK-03 | P2 | Line slip questionnaire | If line-slip task | hiscox→apex100 checkbox and follow-on fields behave |

---

## TC-SEARCH — Advanced Search (FR-08)

| ID | Priority | Title | Steps | Expected |
|----|----------|-------|-------|----------|
| TC-SEARCH-01 | P0 | Page loads | Open Advanced Search | Criteria UI visible (no digest loop / blank page) |
| TC-SEARCH-02 | P1 | Search All | Run search with category All | Results or empty; no console infinite digest |
| TC-SEARCH-03 | P1 | Policy status filter | Filter by status | Results match |

---

## TC-CONN — Connect / brokers (FR-09)

| ID | Priority | Title | Steps | Expected |
|----|----------|-------|-------|----------|
| TC-CONN-01 | P0 | Connect overview | Open Connect | Brokers + insureds sections |
| TC-CONN-02 | P1 | Brokers list | Open full Brokers | Table of brokers |
| TC-CONN-03 | P1 | Create broker (Admin/BrokerOps) | Login admin → + New broker → save | Detail page for new broker |
| TC-CONN-04 | P1 | UW cannot create broker | Login uw1 → Brokers | No create button / API 403 if forced |

---

## TC-OBX — Open Box & bus (FR-15/17)

| ID | Priority | Title | Steps | Expected |
|----|----------|-------|-------|----------|
| TC-OBX-01 | P0 | Portal loads | Open Open Box | Gateway status + risk register |
| TC-OBX-02 | P1 | Bus health | Check bus tile | Mode RabbitMQ or InMemory; connected message |
| TC-OBX-03 | P1 | Publish insured (bus) | Publish insured form → wait | New insured searchable; Integration Activity shows inbound |
| TC-OBX-04 | P2 | Bus messages list | Create/edit risk | RiskCreated / UwFieldsUpdated in bus messages |

---

## TC-SUP — Support (FR-15)

| ID | Priority | Title | Steps | Expected |
|----|----------|-------|-------|----------|
| TC-SUP-01 | P0 | Health check | Support → System Health → Run | Apex DB, Documents, Rating, OpenBox, RabbitMQ (if enabled) show Success/Fail |
| TC-SUP-02 | P1 | Integration Activity | Activity tab | Log entries including RabbitMQ In/Out |

---

## TC-MI — Dashboard / Reporting / Pricing

| ID | Priority | Title | Steps | Expected |
|----|----------|-------|-------|----------|
| TC-MI-01 | P0 | Dashboard | Open Dashboard | Summary tiles/charts load |
| TC-MI-02 | P0 | Reporting | Open Reporting | Report catalog / charts load |
| TC-MI-03 | P1 | Pricing hub | Open Pricing | External pricing + modelling queue / risk grid |

---

## TC-POL / TC-CLM — Policies & claims

| ID | Priority | Title | Steps | Expected |
|----|----------|-------|-------|----------|
| TC-POL-01 | P1 | Policies list | `/#!/policies` | Seeded policies listed |
| TC-POL-02 | P1 | Policy detail | Open a policy | Detail fields render |
| TC-CLM-01 | P1 | Claims list | `/#!/claims` | Claims listed or empty |
| TC-CLM-02 | P1 | Claim detail | Open a claim | Detail renders |

---

## Suggested smoke pack (release gate)

Run these before demo / deploy:

1. TC-AUTH-01, TC-AUTH-03  
2. TC-NAV-01, TC-NAV-02, TC-NAV-03  
3. TC-PIPE-01, TC-PIPE-02  
4. TC-RISK-01  
5. TC-UW-01, TC-UW-02, TC-UW-03, TC-UW-08  
6. TC-OBX-01, TC-SUP-01  
7. TC-MI-01, TC-MI-02  

```bash
cd tests/e2e && nvm use 20 && npm run test:smoke
```

## Full automated suite

All catalog IDs above are implemented under `tests/e2e/specs/` (Playwright).

```bash
cd tests/e2e && nvm use 20 && npm test
```
