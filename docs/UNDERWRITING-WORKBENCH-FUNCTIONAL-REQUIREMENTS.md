# Underwriting Workbench — Functional Requirements (UW-parity)

**Source:** UW / Open Box discovery discussion + sample UI screens  
**UI field spec:** [UNDERWRITING-WORKBENCH-UI-SPEC.md](./UNDERWRITING-WORKBENCH-UI-SPEC.md)  
**Product goal:** Deliver a modern underwriting workbench (Apex) that preserves UW’s day-to-day underwriter workflow while remaining tethered to Open Box as the policy administration source of truth.

---

## 1. Product intent

| Intent | Requirement |
|--------|-------------|
| Role | Pane-of-glass workbench for London Market underwriters (high-value UW decisions) |
| Not in scope as primary PAS | Full policy administration / low-value repetitive data entry (owned by Open Box / ops) |
| Source of truth | Open Box remains golden source for policy, Lloyd’s-linked, and downstream reporting data |
| Write path | Workbench edits are submitted to Open Box; display is refreshed from Open Box (or its replica) |
| Adjacent systems | Document store (DM22), CRM/Dynamics workflow, messaging, cache, pricing/e-placement portals |

**Primary actors**

- Underwriter (principal / scratch)
- Back-office / ops data entry (Polo / Pro) — query collaboration
- Modelling / second-sight / referral / wording teams (task consumers)
- Support / admin operators

---

## 2. Epic feature set (summary)

1. **Pipelines & day work** — status-bucketed risk lists, filters, profiles, day file, DA, queries  
2. **New risk / submission intake** — create wireframe risks; seed UW file  
3. **Underwriter’s File** — hierarchical risk → section workbench  
4. **UW edit / notes** — limited mutable fields posted to Open Box  
5. **Documents** — upload, classify, preview (PDF), spawn workflow tasks  
6. **Claims, associations, premium monitoring** — read-side portfolio context  
7. **Activity log & tasks** — Dynamics-style workflow (modelling, second sight, front sheet, line slip, …)  
8. **Advanced / vessel / query search** — multi-criteria find + saved searches  
9. **Connect** — broker / client contacts  
10. **Support & admin** — health checks, integration activity, queues, app config, batch RAG  
11. **Cross-cutting** — AD auth, ROE, global search, Excel export, badges/counts, Open Box deep-link  

---

## 3. Functional requirements by module

### FR-01 Navigation shell & global actions

| ID | Requirement |
|----|-------------|
| FR-01.1 | Top nav modules: Dashboard, Reporting, Pipeline, Tasks (+ DA count), Underwriter’s File, Advanced Search, Connect, Pricing, Support, Open Box, E-Placement, Self Service |
| FR-01.2 | Global search with category selector (e.g. policy / reference) |
| FR-01.3 | Primary CTA **+ NEW RISK** always available |
| FR-01.4 | Utility menus: Links, ROE (rate of exchange), refresh, settings/profile |
| FR-01.5 | Task and E-Placement badge counts visible on nav |
| FR-01.6 | Authenticate via enterprise directory (Active Directory / equivalent SSO) |

### FR-02 Pipeline workbench

| ID | Requirement |
|----|-------------|
| FR-02.1 | Pipeline buckets: **Upcoming**, **Bound**, **NTU / Declined**, **Delegated Authority (DA)**, **Day File**, **Queries** |
| FR-02.2 | Upcoming = submissions / near-term unbound or soon-to-update risks |
| FR-02.3 | Bound = live policies only |
| FR-02.4 | NTU / Declined = not taken up or declined by UW |
| FR-02.5 | DA = binder / delegated-authority risks only |
| FR-02.6 | Day File = risks the current UW worked on today |
| FR-02.7 | Queries = list + create query (ops ↔ UW clarification channel) |
| FR-02.8 | Pipeline grid columns (minimum): status icons/badges, Area, Account Name, Reference, SC1, MOP, Policy Description, N/R, UW, Inception, Status, Net (100%), Net Share, Broker, Contact, Exposure |
| FR-02.9 | Filters: Business Areas (multi-select), Expiring Live Renewals only, Show Non Renewable, day-range window, column visibility, **Save Profile** |
| FR-02.10 | Per-column filter behaviour (text+operator, checkbox, etc.) |
| FR-02.11 | Click Account Name / Reference → open Underwriter’s File for that risk |
| FR-02.12 | Recent Activity shortcut access |

### FR-03 New risk / submission

| ID | Requirement |
|----|-------------|
| FR-03.1 | Create new risk / wireframe submission with unique UW reference + YOA |
| FR-03.2 | Capture broker, inception/expiry, description, policy type (e.g. lineslip), MOP, risk appetite |
| FR-03.3 | Persist via Open Box write API; surface in Upcoming pipeline |

### FR-04 Underwriter’s File — structure

| ID | Requirement |
|----|-------------|
| FR-04.1 | File context header: Insured/Account, Status (e.g. Submission), UW Reference, YOA |
| FR-04.2 | File sidebar: Dashboard, Policy, Claim, Activity Log, Associations, Premium Monitoring |
| FR-04.3 | Risk-level toolbar actions: Open Box, Summary, CSR, Task, Log, Edit/Note, Document, Model |
| FR-04.4 | **Risk View** panes: Policy Summary, Notes, Performance |
| FR-04.5 | **Section View** panes: Section Summary, Limits, Premiums, Performance, Bureau, Deductions, Outwards RI, Declarations |
| FR-04.6 | Collapsible Risk View / Section View / Documents regions |
| FR-04.7 | Policy may contain one or more **Sections**; select section to drive Section View |
| FR-04.8 | **+ Add Section** supported (subject to Open Box rules) |
| FR-04.9 | All policy/section display data sourced from Open Box (replica acceptable for read) |

### FR-05 Policy / Risk View data

| ID | Requirement |
|----|-------------|
| FR-05.1 | Policy Summary fields: Inception, Expiry, Broker, Broker Contact, UMR, Broker Reference, MOP, Policy Description, Insured, Reinsured, Domicile, Slip Leader, Policy Type, Risk Appetite |
| FR-05.2 | Policy / Apex Share metrics: Gross/Net Premium, Weighted TI, Weighted RRM, Long Term Loss Ratio, Rate Adequacy, Expected Premium, Net Signed Premium, Exposure |
| FR-05.3 | Additional Insureds list |
| FR-05.4 | Sections grid: UW Reference, GoM Wind, LBS, LIC, LIC Risk, UW, Limit, Excess, Deductible, Gross Policy Premium, Est/Act Sign Line, Exposure, RRM, TI |
| FR-05.5 | Performance: Line Share vs 100% tables with YOA rows; CCY / ROE / YOA filters; Net vs Gross of Q/S legend |
| FR-05.6 | Notes pane for UW notes (typed, e.g. UWTR) |

### FR-06 Section View data

| ID | Requirement |
|----|-------------|
| FR-06.1 | Section Summary: Business Area, Stat1/2, Sub Stat, LIC Secondee, Inception/Expiry, UW Principal, UW Scratch, Basis, Facility, Syndicate, Written/Signed lines & orders, Est/Act signing, FAC RI, Technical Index, Settlement/Original CCY premiums & exposure, Deductions, Risk Code |
| FR-06.2 | Side KPI strip: RRM, Ded X/S, Prem/Rate, Limit, Risk Change, T&C, Other, Total |
| FR-06.3 | Limits grid: Agg to Policy/Section, Limit Type/Basis, Limit, Co-ins, Excess, Agg Limit/Excess/Deductible, Deductible Basis, Description |
| FR-06.4 | Premiums grid: Type, Basis, CCY, EGPI/ENPI (100% & Share), SDI/IDD, Description; Export to Excel |
| FR-06.5 | Tabs for Performance, Bureau, Deductions, Outwards RI, Declarations (read/write per Open Box capability) |

### FR-07 Edit underwriting information (mutable subset)

| ID | Requirement |
|----|-------------|
| FR-07.1 | Edit/Note opens form for allowed mutable fields only (not full PAS edit) |
| FR-07.2 | Editable examples: Risk Status, Broker Contact, Inception/Expiry, Risk Appetite, Renewal Warning, Non Renewable, Policy Description |
| FR-07.3 | Per-section assignment: Principal UW, Sub Stat 1/2, E-trading Platform, Est Signing |
| FR-07.4 | ESG Status with contextual guidance (e.g. Exposed definition) |
| FR-07.5 | LIC Secondee, Long Term Loss Ratio, Rate Adequacy, Notes Type + Notes |
| FR-07.6 | Technical grid: Deductible Excess, Limit, Prem/Rate, Risk Change, T&C, Other, Total, Technical Index (+ basis), Modelled Loss Ratio, Facility/LBS/LIC/LIC Risk flags |
| FR-07.7 | On Submit: call Open Box API; do **not** treat workbench DB as write-master; refresh from replica after success |

### FR-08 Documents (DM22)

| ID | Requirement |
|----|-------------|
| FR-08.1 | Documents pane per risk: folder tree (e.g. SLIPS), Doc Type, Endorsement No, date/ref |
| FR-08.2 | Upload with metadata: Doc Type, Author, Note/category, Endt No, Name, Desc, Reference |
| FR-08.3 | On upload, optionally spawn tasks: Data Entry, Second Sight, Front Sheet, Modelling, Referral, Wording |
| FR-08.4 | In-app preview (Viewer + Profile); page nav, zoom, fullscreen |
| FR-08.5 | Download/preview normalised to PDF regardless of upload format |
| FR-08.6 | Documents stored in DM22; listed/previewed from workbench |

### FR-09 Claims

| ID | Requirement |
|----|-------------|
| FR-09.1 | Claim Summary KPIs: ILR / Overall ILR, CAP, Apex Share Net Premium, Exposure |
| FR-09.2 | Claims grid: Status, UCR, YOA, Claimant, Description, Location, DOL, DON, CCY, PTD (+ share vs 100% legend) |
| FR-09.3 | YOA filter and column visibility |

### FR-10 Associations

| ID | Requirement |
|----|-------------|
| FR-10.1 | List related policies/risks for current file |
| FR-10.2 | **+ NEW ASSOCIATION**; search; Export to Excel |
| FR-10.3 | Association fields: Name, Description, YOA, Notes; linked risk financials (Status, UW Ref, Insured, Reinsured, Apex Share, Gross/Net Premium, Limit, Excess, Exposure) |

### FR-11 Premium monitoring

| ID | Requirement |
|----|-------------|
| FR-11.1 | Per-section premium schedule view: UW Reference, Inception, Expiry, EGPI, Commission, Brokerage, PC, PC Paid to Date, ILR |
| FR-11.2 | Reflect instalment / frequency expectations when schedule data exists in Open Box |

### FR-12 Activity log & tasks / workflow

| ID | Requirement |
|----|-------------|
| FR-12.1 | Activity Log lists workflows tied to the risk (e.g. Second Sight, Modelling, Front Sheet, Line Slip) |
| FR-12.2 | Columns: Activity Type, Type (e.g. SLIP), Doc Info (expandable), Lloyd’s PIN, Date Created, Created By, Owner, Date Completed, Completed By, Reference, Detail |
| FR-12.3 | Global **Tasks** module lists workflows across risks; same detail experience as Activity Log drill-in |
| FR-12.4 | Task View: Comment History, Associated Queries/Documents, Send To, Priority, Comments, Due Date, Status |
| FR-12.5 | Actions: Save/Send, Complete and Close Task, Cancel; assign to other users/teams |
| FR-12.6 | Side-by-side document preview on task |
| FR-12.7 | Task-type specific forms (e.g. Line Slip questionnaire: Customer Type multi-select, Bulking/Non-Bulking, Apex 100% of risk, branching questions) |
| FR-12.8 | Workflow engine concept parity with Dynamics 365–driven UW automation (implementation may modernise) |

### FR-13 Search

| ID | Requirement |
|----|-------------|
| FR-13.1 | **Policy / Advanced Search**: multi-row criteria (field + operator + value), Add Row, Save, Save and Search, Saved Searches |
| FR-13.2 | **Vessel Search**: Vessel Type, Year of Build, GT, DWT, Risk Code, Class of Business, Stat Code, Risk Status, etc. |
| FR-13.3 | **Query Search**: find historical/similar queries to reuse resolutions |

### FR-14 Connect (contacts)

| ID | Requirement |
|----|-------------|
| FR-14.1 | Create and list contacts for brokers and clients |
| FR-14.2 | Link contacts to risks where applicable |

### FR-15 Support

| ID | Requirement |
|----|-------------|
| FR-15.1 | **System Health Check**: run integration probes (DM/DMS, CRM, OBX/Open Box, Redis Cache, RabbitMQ / message bus, service-link daily checks) with elapsed time, endpoint, pass/fail |
| FR-15.2 | **Integration Activity**: transaction log across UW ↔ Open Box / CRM / other integrations |
| FR-15.3 | Supporting admin panes reachable from Support (e.g. SDC Response Types, ACR recommendation categories) |

### FR-16 Admin / operations

| ID | Requirement |
|----|-------------|
| FR-16.1 | Queue status monitoring (message bus admin) |
| FR-16.2 | App Config management |
| FR-16.3 | **RAG / scheduled jobs**: job name, schedule type, RAG status (Pass/Fail/Must Run), last run, job status |
| FR-16.4 | Example job classes: premium schedules, wall service, final slip tasks, policy state translate, premium forecast, document deletion/search, bucket cleanup, email reminders, etc. |

### FR-17 Cross-cutting non-functional (functional constraints)

| ID | Requirement |
|----|-------------|
| FR-17.1 | Open Box is write-master for policy data; workbench holds workflow/UI state + replica reads |
| FR-17.2 | Support high-volume grids (999+ pipeline rows) with paging/virtualisation |
| FR-17.3 | Excel export on major grids |
| FR-17.4 | Multi-currency display with ROE context |
| FR-17.5 | Auditability of who created/completed workflow tasks |
| FR-17.6 | Messaging between platforms (queue/bus); cache for hot reads |
| FR-17.7 | Remain compatible with Lloyd’s / DXC feed into Open Box (no bypass of Open Box for market data) |

---

## 4. Screen → requirement map (sample pack)

| Screen theme | Primary FRs |
|--------------|-------------|
| Pipeline Upcoming grid | FR-02 |
| UW File Policy / Performance / Section Summary | FR-04, FR-05, FR-06 |
| Section Limits / Premiums + Documents viewer | FR-06, FR-08 |
| Add Underwriting Information / ESG help | FR-07 |
| Document upload + task spawn | FR-08, FR-12 |
| Claim Summary | FR-09 |
| Policy Associations | FR-10 |
| Premium Monitoring | FR-11 |
| Activity Log / Task View / Line Slip questionnaire | FR-12 |
| Policy / Vessel / Query Search | FR-13 |
| Support System Health (DMS/CRM/OBX/Redis/RabbitMQ) | FR-15 |
| ACR categories / RAG scheduled tasks | FR-15, FR-16 |

---

## 5. Suggested delivery phases (for Apex)

| Phase | Scope | Notes |
|-------|-------|-------|
| **P0 — Core UW day** | Shell, Pipeline buckets, UW File read (Risk + Section Summary), Open Box read gateway, New Risk stub | Matches current Apex contracts direction |
| **P1 — Decision support** | Edit/Note write-through, Documents upload/preview stub, Activity Log + basic Tasks, Claims/Associations/Premium Monitoring read | |
| **P2 — Workflow depth** | Full task types + questionnaires, Query ops channel, Advanced/Vessel/Query search, Connect | |
| **P3 — Ops & platform** | Support health, Integration activity, Admin queues/config/RAG, E-Placement/Pricing deep-links | Real DM22/CRM/AD optional behind adapters |

---

## 6. Explicit out-of-scope / stubbed integrations (parity with Apex map)

Unless separately commissioned:

- Live Open Box SOAP/ViewService (use gateway adapter; local stub OK for lab)
- Live DM22, Dynamics CRM, Lloyd’s/DXC inbound, RabbitMQ, production AD
- Full replacement of Open Box as PAS
- Reinsurance-team parallel workbench (separate product surface)

---

## 7. Acceptance criteria (solution-level)

1. An underwriter can triage work via Pipeline buckets with saved filter profiles.  
2. Opening a risk shows Policy Summary + Sections + Section Summary from Open Box–backed data.  
3. Allowed UW field edits submit to Open Box and reappear after refresh/replication.  
4. Documents can be attached with type metadata and optionally create modelling/second-sight/front-sheet tasks.  
5. Activity Log / Tasks show ownership, status, comments, and linked documents.  
6. Advanced Search can find policies by compound criteria; Vessel and Query searches are available.  
7. Support can verify Open Box / document / cache / bus connectivity from System Health Check.  
8. Workbench never presents itself as the golden source for bound policy data.

---

*Derived from the UW/Open Box walkthrough (James overview, Bella UI tour, Piotr architecture notes) and the accompanying sample screens zip.*
