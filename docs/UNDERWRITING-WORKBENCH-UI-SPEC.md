# Underwriting Workbench — UI Specification (fields & screens)

**Companion to:** [UNDERWRITING-WORKBENCH-FUNCTIONAL-REQUIREMENTS.md](./UNDERWRITING-WORKBENCH-FUNCTIONAL-REQUIREMENTS.md)  
**Source:** UW sample screens + discovery walkthrough  
**Convention:** `R` = read-only display · `E` = editable in workbench · `W` = write-through to Open Box on submit · `L` = lookup/dropdown · `G` = grid column · `A` = action

---

## 0. Global UI chrome

### 0.1 Application shell

| Region | Control | Spec |
|--------|---------|------|
| Brand | Logo + app name | Fixed left: product brand + “Workbench” |
| Clock | Date/time | Server local display |
| Global search | Category `L` + text | Categories include Policy / Reference (extensible) |
| Links | Menu `A` | External/deep links |
| ROE | Menu `L` | Rate of exchange context for money columns |
| Refresh | Icon `A` | Reload active view |
| Settings / profile | Icon `A` | User prefs |
| **+ NEW RISK** | Primary button `A` | Opens New Risk flow |
| Main nav | Tabs `A` | See §0.2 |
| Badge | Tasks count | Integer / `99+` |
| Badge | DA count | Integer |
| Badge | E-Placement count | Integer |

### 0.2 Main navigation tabs

| Tab | Route key | Notes |
|-----|-----------|-------|
| Dashboard | `/dashboard` | Portfolio overview (phase) |
| Reporting | `/reporting` | Reports entry |
| Pipeline | `/pipeline/{bucket}` | Default `upcoming` |
| Tasks | `/tasks` | Badge = open task count |
| Underwriter’s File | `/uwf/{id}` | Contextual when file open |
| Advanced Search | `/search` | Policy / Vessel / Query |
| Connect | `/connect` | Contacts |
| Pricing | deep-link / embed | External OK |
| Support | `/support` | Health / integration |
| Open Box | deep-link | External PAS |
| E-Placement | deep-link | Badge count |
| Self Service | deep-link | External OK |

### 0.3 Field type legend (used below)

| Type | UI control |
|------|------------|
| Text | Single-line input |
| TextArea | Multi-line |
| Number | Numeric / decimal |
| Money | Decimal + CCY context |
| Percent | Decimal % |
| Date | `dd/MM/yyyy` picker |
| DateTime | `dd/MM/yyyy HH:mm` |
| Bool | Checkbox |
| Select | Single dropdown |
| MultiSelect | Multi dropdown / chips |
| ToggleGroup | Button group (Yes/No or multi) |
| Lookup | Typeahead (UW, broker, contact) |
| StatusBadge | Colour icon/chip |
| Link | Navigates to UW File / Detail |
| File | Upload picker |
| Viewer | Embedded PDF viewer |

---

## 1. Pipeline (`UI-PIPE`)

### 1.1 Layout

```
┌ Header (global) ─────────────────────────────────────────────┐
├ Left sidebar │ Toolbar filters + Save Profile + Grid Display │
│ Recent       ├───────────────────────────────────────────────┤
│ Day File     │ Pipeline data grid (virtualised)              │
│ Queries      │                                               │
│ Pipeline     │                                               │
│  Upcoming*   │                                               │
│  Bound       │                                               │
│  NTU/Declined│                                               │
│  Dashboard   │                                               │
│ DA Pipeline  │                                               │
│  Delegated   │                                               │
└──────────────┴───────────────────────────────────────────────┘
```

### 1.2 Sidebar items

| Label | Count badge | Bucket key |
|-------|-------------|------------|
| Recent Activity | — | `recent` |
| Day File | optional | `dayfile` |
| Queries | yes | `queries` |
| Upcoming | yes | `upcoming` |
| Bound | yes | `bound` |
| NTU / Declined | yes | `ntu-declined` |
| Dashboard | optional | `pipeline-dashboard` |
| Delegated Authority | yes | `da` |

### 1.3 Toolbar filters

| Field | Type | Mode | Default | Notes |
|-------|------|------|---------|-------|
| Business Areas | MultiSelect | E | All / multi | Shows “N selected” |
| Expiring Live Renewals only | Bool | E | false | |
| Show Non Renewable | Bool | E | false | |
| Date Range From | Number (days) | E | e.g. -90 | Relative day window |
| Date Range To | Number (days) | E | e.g. 90 | |
| Save Profile | Button `A` | — | — | Persists filter + column set |
| Grid Display | MultiSelect | E | subset | Column visibility |

### 1.4 Pipeline grid columns

| # | Field | Type | Mode | Sort | Filter | Width hint |
|---|-------|------|------|------|--------|------------|
| 1 | Workflow badges | StatusBadge[] | R | — | — | Icons e.g. SS / FS / M |
| 2 | Area | Text | R/G | Y | Select | Business area code |
| 3 | Account Name | Link | R/G | Y | Text+op | → UW File |
| 4 | Reference | Link | R/G | Y | Text+op | UW Ref → UW File |
| 5 | SC1 | Text | R/G | Y | Text | Stat code 1 |
| 6 | MOP | Text | R/G | Y | Select | Method of placement |
| 7 | Policy Description | Text | R/G | Y | Text | |
| 8 | N/R | Text | R/G | Y | Select | New / Renewal |
| 9 | UW | Text | R/G | Y | Lookup | UW code |
| 10 | Inception | Date | R/G | Y | Date | |
| 11 | Status | Select | R/G | Y | Select | Quote / Submission / Lapsed / Bound / … |
| 12 | Net (100%) | Money | R/G | Y | Number | |
| 13 | Net Share | Money | R/G | Y | Number | |
| 14 | Broker | Text | R/G | Y | Text | |
| 15 | Contact | Text | R/G | Y | Text | |
| 16 | Exposure | Money | R/G | Y | Number | |

**Behaviours:** row virtualisation; per-column filter popovers (operator + value or checkbox); click Account/Reference opens UW File.

### 1.5 Queries list (bucket)

| Field | Type | Mode |
|-------|------|------|
| Query list grid | G | R |
| + New Query | Button | A |
| Query Type | Select | E (create) |
| Assigned To | Lookup | E |
| Status | Select | E |
| Created By / Date | Text/DateTime | R |
| Closed Date | DateTime | R |
| Body / question | TextArea | E |

---

## 2. New Risk (`UI-NEW`)

| Field | Type | Mode | Required | Notes |
|-------|------|------|----------|-------|
| Insured / Account Name | Text / Lookup | E/W | Y | |
| Broker | Lookup | E/W | Y | |
| Broker Contact | Text / Lookup | E/W | N | |
| Inception Date | Date | E/W | Y | |
| Expiry Date | Date | E/W | Y | Default +1 year |
| Policy Type | Select | E/W | Y | e.g. Lineslip |
| MOP | Select | E/W | N | e.g. COVERS / LINESLIPS |
| Policy Description | TextArea | E/W | N | |
| Risk Appetite | Number / Select | E/W | N | |
| Business Area | Select | E/W | Y | |
| YOA | Number | R/W | system | Derived from inception |
| UW Reference | Text | R | system | Assigned on create |
| Actions | Cancel / Submit | A | — | Submit → Open Box |

---

## 3. Underwriter’s File shell (`UI-UWF`)

### 3.1 File header

| Field | Type | Mode |
|-------|------|------|
| Account / Insured name | Text | R |
| Status | StatusBadge | R | e.g. Submission |
| UW Reference | Text | R |
| YOA | Number | R |

### 3.2 File sidebar

| Item | Key |
|------|-----|
| Dashboard | `dashboard` |
| Policy | `policy` |
| Claim | `claim` |
| Activity Log | `activity` |
| Associations | `associations` |
| Premium Monitoring | `premium` |

### 3.3 Risk toolbar

| Action | Icon/label | Behaviour |
|--------|------------|-----------|
| Open Box | OPENBOX | Deep-link / open PAS record |
| Summary | SUMMARY | Summary view / chart |
| CSR | CSR | CSR menu (+ count if any) |
| Task | TASK | Create / list tasks |
| Log | LOG | Jump to Activity Log |
| Edit / Note | EDIT/NOTE | Opens `UI-EDIT` |
| Document | DOCUMENT | Opens upload / docs focus |
| Model | MODEL | Modelling entry |

### 3.4 Collapsible regions

1. **Risk View** (tabs §4)  
2. **Section View** (tabs §5) — title includes Account | Status | Section UW Ref  
3. **Documents** (pane §6)

---

## 4. Risk View (`UI-RISK`)

### 4.1 Tabs

`Policy Summary` · `Notes` · `Performance`

### 4.2 Policy Summary — identity row

| Field | Type | Mode | Write |
|-------|------|------|-------|
| Inception | Date | R | via Edit |
| Expiry | Date | R | via Edit |
| Broker | Text / code | R | |
| Broker Contact | Text | R | via Edit |
| UMR | Text | R | |
| Broker Reference | Text | R | |
| MOP | Text | R | |
| Policy Description | Text | R | via Edit |
| Insured | Text | R | |
| Reinsured | Text | R | |
| Domicile of Insured | Text | R | |
| Slip Leader | Text | R | |
| Policy Type | Select | R | |
| Risk Appetite | Number | R | via Edit |

### 4.3 Policy / Apex Share metrics

| Field | Group | Type | Mode |
|-------|-------|------|------|
| Gross Premium | Policy | Money | R |
| Net Premium | Policy | Money | R |
| Weighted TI | Policy | Number | R |
| Weighted RRM | Policy | Number | R |
| Long Term Loss Ratio | Policy | Percent | R |
| Rate Adequacy | Policy | Number/Percent | R |
| Expected Premium | Apex Share | Money | R |
| Net Signed Premium | Apex Share | Money | R |
| Exposure | Apex Share | Money | R |

### 4.4 Additional Insured

| Field | Type | Mode |
|-------|------|------|
| Expand/collapse | A | |
| Insured name list | G | R (+ add if allowed) |

### 4.5 Sections grid (+ Add Section)

| Field | Type | Mode |
|-------|------|------|
| UW Reference | Link | R → select section |
| GoM Wind | Bool/Flag | R |
| LBS | Bool/Flag | R |
| LIC | Bool/Flag | R |
| LIC Risk | Bool/Flag | R |
| UW | Text | R |
| Limit | Money | R |
| Excess | Money | R |
| Deductible | Money | R |
| Gross Policy Premium | Money | R |
| Est Sign Line | Percent/Number | R |
| Act Sign Line | Percent/Number | R |
| Exposure | Money | R |
| RRM | Number | R |
| TI | Number | R |
| + Add Section | Button | A/W |

### 4.6 Notes tab

| Field | Type | Mode |
|-------|------|------|
| Notes Type | Select | R/E |
| Notes body | TextArea | R (edit via Edit/Note) |

### 4.7 Performance tab

**Filters**

| Field | Type | Mode |
|-------|------|------|
| CCY | Select | E |
| ROE | Select | E |
| YOA Filter | MultiSelect | E |
| Legend | Net of Q/S vs Gross of Q/S | R |

**Grids** (×2): *Line Share (Gross of Q/S)* and *100% (Gross of … Q/S)*

| Field | Type | Mode |
|-------|------|------|
| Status | Text | R |
| YOA | Number | R |
| Technical Premium | Money | R |
| Signed Premium | Money | R |
| Paid Claims | Money | R |
| Outstanding Claims | Money | R |
| Incurred Claims | Money | R |
| PLR | Percent | R |
| ILR | Percent | R |

---

## 5. Section View (`UI-SEC`)

### 5.1 Tabs

`Section Summary` · `Limits` · `Premiums` · `Performance` · `Bureau` · `Deductions` · `Outwards RI` · `Declarations`

### 5.2 Section Summary — left/main fields

| Field | Type | Mode |
|-------|------|------|
| Business Area | Text | R |
| Stat1 | Text | R |
| Stat2 | Text | R |
| Sub Stat1 | Text | R |
| Lic. Secondee | Text/Number | R |
| Inception | Date | R |
| Expiry | Date | R |
| UW (Principal) | Text | R |
| UW (Scratch) | Text | R |
| Basis | Text | R |
| Facility | Bool/Text | R |
| Synd | Text | R |
| Written Line | Percent/Number | R |
| Broker Order | Percent/Number | R |
| W/O | Percent/Number | R |
| Est Signing | Percent/Number | R |
| Est Signed Line | Percent/Number | R |
| FAC RI Purchased | Percent/Number | R |
| Technical Index | Number | R |
| Signed Line | Percent/Number | R |
| Signed Order | Percent/Number | R |
| Act Signing | Percent/Number | R |
| Act Signed Line | Percent/Number | R |
| Total Q/S | Percent/Number | R |
| Sett CCY | Select | R |
| Orig CCY | Select | R |
| Net Written Premium | Money | R |
| Net Signed Premium | Money | R |
| Written Exposure | Money | R |
| Technical Exposure | Money | R |
| Deductions | Money | R |
| Risk Code | Text | R |
| Section Name | Text | R |

### 5.3 Section KPI strip (right)

| Field | Type | Mode |
|-------|------|------|
| RRM | Number | R |
| Ded X/S | Money | R |
| Prem / Rate | Money/Number | R |
| Limit | Money | R |
| Risk Change | Text/Number | R |
| T&C | Text | R |
| Other | Text | R |
| Total | Number | R |

### 5.4 Limits tab grid

| Field | Type | Mode |
|-------|------|------|
| Agg To Policy | Bool | R |
| Agg To Section | Bool | R |
| Limit Type | Select | R |
| Limit | Money | R |
| Limit Basis | Select | R |
| Co-ins | Number | R |
| Excess | Money | R |
| Excess Basis | Select | R |
| Agg Limit | Money | R |
| Agg Excess | Money | R |
| Agg Deductible | Money | R |
| Deductible | Money | R |
| Deductible Basis | Select | R |
| Description | Text | R |

### 5.5 Premiums tab grid

| Field | Type | Mode |
|-------|------|------|
| Type | Select | R |
| Basis | Select | R |
| CCY | Select | R |
| EGPI (100%) | Money | R |
| ENPI (100%) | Money | R |
| EGPI (Share) | Money | R |
| ENPI (Share) | Money | R |
| SDI / IDD | Text/Date | R |
| Description | Text | R |
| Export to Excel | Button | A |

### 5.6 Other section tabs (field groups)

| Tab | Minimum field groups |
|-----|----------------------|
| Performance | YOA metrics aligned to risk Performance |
| Bureau | Bureau/Lloyd’s reference fields from Open Box |
| Deductions | Deduction type, %, amount, CCY |
| Outwards RI | RI type, carrier, %, premium, exposure |
| Declarations | Declaration date, period, premium, status |

---

## 6. Documents (`UI-DOC`)

### 6.1 List pane

| Field | Type | Mode |
|-------|------|------|
| Folder tree | Tree | R |
| Doc Type | Text | R/G |
| Endt No | Text | R/G |
| Date / Dr | Date | R/G |
| Doc name | Text | R/G |
| Upload | Button | A → modal |

### 6.2 Viewer pane

| Control | Type | Mode |
|---------|------|------|
| Viewer / Profile tabs | Tabs | |
| Page nav | 1 of N | A |
| Zoom +/- | A | |
| Search in doc | A | |
| Full Screen | A | |
| Content | Viewer | PDF preview (all formats → PDF) |

### 6.3 Save file modal (`UI-DOC-UPLOAD`)

| Field | Type | Mode | Required |
|-------|------|------|----------|
| File | File | E | Y |
| File Name | Text | R | — |
| Doc Type | Select | E | Y | e.g. SLIP: Slip |
| Author | Select/Lookup | E | Y |
| Note (category) | Select | E | N | e.g. OPS: Operations |
| Endt No | Text | E | N |
| Name | Text | E | Y | default Insured |
| Desc | TextArea | E | N |
| Reference No | Text | R/E | Y | default UW Ref |
| **Tasks** — Data Entry | Bool | E | N |
| Tasks — Second Sight | Bool | E | N |
| Tasks — Front Sheet | Bool | E | N |
| Tasks — Modelling | Bool | E | N |
| Tasks — Referral | Bool | E | N |
| Tasks — Wording | Bool | E | N |
| Cancel / Submit | Buttons | A | — |

---

## 7. Edit Underwriting Information (`UI-EDIT`)

Modal/page title: **Add Underwriting Information to {UW Ref}**

### 7.1 Header fields

| Field | Type | Mode | Required |
|-------|------|------|----------|
| Risk Status | Select | E/W | N |
| Broker Contact | Text | E/W | N |
| Inception Date | Date | E/W | Y |
| Expiry Date | Date | E/W | Y |
| Risk Appetite | Number/Select | E/W | N |
| Renewal Warning | Bool | E/W | N |
| Non Renewable | Bool | E/W | N |
| Policy Description | TextArea | E/W | N |

### 7.2 Section assignment grid (per section row)

| Field | Type | Mode |
|-------|------|------|
| Section | Text (A, B, …) | R |
| Principal Underwriter | Lookup | E/W |
| Sub Stat 1 | Select | E/W |
| Sub Stat 2 | Select | E/W |
| Etrading Platform | Select | E/W |
| Est Signing | Number | E/W |

### 7.3 Indicators

| Field | Type | Mode | Notes |
|-------|------|------|-------|
| LIC Secondee | Select/Number | E/W | |
| ESG Status | Select | E/W | Shows help panel when value = Exposed |
| ESG help panel | Info | R | Definition + sector examples; dismissible |
| Long Term Loss Ratio | Number | E/W | |
| Rate Adequacy | Number | E/W | |

### 7.4 Notes

| Field | Type | Mode |
|-------|------|------|
| Notes Type | Select | E/W | e.g. UWTR - Underwriter |
| Notes | TextArea | E/W | |
| SUMMARY | Link/Button | A | |

### 7.5 Technical metrics grid (per section)

| Field | Type | Mode |
|-------|------|------|
| Section | Text | R |
| Deductible Excess | Money | E/W |
| Limit | Money | E/W |
| Premium / Rate | Money/Number | E/W |
| Risk Change | Text | E/W |
| Terms and Conditions | Text | E/W |
| Other | Text | E/W |
| Total | Number | E/W |
| Technical Index | Number | E/W |
| Technical Index Basis | Select | E/W |
| Modelled Loss Ratio | Number | E/W |
| Facility | Bool | E/W |
| LBS | Bool | E/W |
| LIC | Bool | E/W |
| LIC Risk | Bool | E/W |

### 7.6 Footer actions

| Action | Behaviour |
|--------|-----------|
| Cancel | Close without write |
| Submit | POST to Open Box → refresh replica → close |

---

## 8. Claim (`UI-CLM`)

### 8.1 KPI strip

| Field | Type | Mode |
|-------|------|------|
| ILR | Percent | R |
| Overall ILR | Percent | R |
| CAP | Text/Flag | R |
| Apex Share Net Premium | Money | R |
| Exposure | Money | R |

### 8.2 Filters

| Field | Type | Mode |
|-------|------|------|
| YOA Filter | Select/Multi | E |
| Grid Display | MultiSelect | E |
| Legend | Apex share vs 100% | R |

### 8.3 Claims grid

| Field | Type | Mode |
|-------|------|------|
| Sts | StatusBadge | R |
| UCR | Text | R |
| YOA | Number | R |
| Claimant | Text | R |
| Description | Text | R |
| Location | Text | R |
| DOL | Date | R |
| DON | Date | R |
| CCY | Select | R |
| PTD | Money | R |

---

## 9. Associations (`UI-ASC`)

### 9.1 Toolbar

| Control | Type |
|---------|------|
| Search | Text + category |
| + NEW ASSOCIATION | Button |
| Export to Excel | Button |

### 9.2 Association header grid

| Field | Type | Mode |
|-------|------|------|
| Name | Text | E/R |
| Description | Text | E/R |
| YOA | Number | E/R |
| Notes | Text | E/R |

### 9.3 Linked risk financials grid

| Field | Type | Mode |
|-------|------|------|
| Status | Text | R |
| UW Reference | Link | R |
| Insured | Text | R |
| Reinsured | Text | R |
| Description | Text | R |
| Apex Share | Percent/Money | R |
| Gross Premium (Share) | Money | R |
| Net Premium (Share) | Money | R |
| Limit | Money | R |
| Excess | Money | R |
| Exposure | Money | R |

---

## 10. Premium Monitoring (`UI-PREM`)

| Field | Type | Mode |
|-------|------|------|
| UW Reference | Text | R/G |
| Inception Date | Date | R/G |
| Expiry Date | Date | R/G |
| EGPI | Money | R/G |
| Commission | Money/% | R/G |
| Brokerage | Money/% | R/G |
| PC | Money/% | R/G |
| PC Paid to Date | Money | R/G |
| ILR | Percent | R/G |

Empty state allowed when no schedule data in Open Box.

---

## 11. Activity Log (`UI-ACT`)

| Field | Type | Mode |
|-------|------|------|
| Activity Type | Text | R/G | Second Sight, Modelling, Front Sheet, Line Slip, … |
| Type | Text | R/G | e.g. SLIP |
| Doc Info | Expand | R | Nested Doc Type + Ref# |
| Lloyds PIN | Text | R/G |
| Date Created | DateTime | R/G |
| Created By | Text | R/G |
| Owner | Text | R/G |
| Date Completed | DateTime | R/G |
| Completed By | Text | R/G |
| Reference | Text | R/G |
| Detail > | Link | A → Task View |

---

## 12. Task View (`UI-TASK`)

### 12.1 Common chrome

| Field | Type | Mode |
|-------|------|------|
| Back | Button | A |
| Title (Account) | Text | R |
| Task type title | Text | R | e.g. LINE SLIP TASK / Modelling |
| Principal UW | Text | R |
| Created By | Text | R |
| UW Reference | Text | R |
| Task Ref | Text | R |
| Comment History | Timeline | R |
| Associated Queries | List | R |
| Associated Documents | List | R | e.g. SLIP added by X on date |
| Document viewer | Viewer | R | optional docked pane |
| Send To | Select/Lookup | E |
| Task Priority | Select | E |
| Task Comments | TextArea | E |
| Due Date | Date | E |
| Task Status | Select | E | e.g. Not Started |
| Cancel | Button | A |
| Save/Send | Button | A |
| Complete and Close Task | Button | A |

### 12.2 Line Slip questionnaire (task-type specific)

| Field | Type | Mode | Notes |
|-------|------|------|-------|
| Customer Type | ToggleGroup Multi | E | Micro Enterprise, SME, Commercial, Large Risk/RI, Private Individual |
| Is this a Bulking or Non-Bulking Lineslip? | ToggleGroup Yes/No | E | |
| Does Apex write 100% of the risk? | ToggleGroup Yes/No | E | |
| Follow-on questions | Dynamic | E | Shown based on prior answers |

### 12.3 Modelling / Second Sight / Front Sheet

| Field | Type | Mode |
|-------|------|------|
| Task description | TextArea | R/E |
| Comments | TextArea | E |
| Assign / Send To | Lookup | E |
| Attached docs preview | Viewer | R |
| Extra type-specific fields | varies | E | Per workflow definition |

---

## 13. Advanced Search (`UI-SRCH`)

### 13.1 Sub-tabs

`Policy Search` · `Saved Searches` · `Vessel Search` · `Query Search`

### 13.2 Policy Search criteria builder

| Field | Type | Mode |
|-------|------|------|
| Criteria rows | Repeater | E | Field + Operator + Value |
| And/Or join | Select | E |
| Add Row | Button | A |
| Save | Button | A | Named saved search |
| Save and Search | Button | A |
| Results grid | G | R | Align to pipeline columns |

### 13.3 Vessel Search criteria (minimum)

| Field | Operator examples | Value type |
|-------|-------------------|------------|
| Vessel Type | EqualTo | Select |
| Year of Build | Greater Than | Number |
| GT | Between | Number range |
| DWT | Between | Number range |
| Risk Code | EqualTo / Contains | Text |
| Class Of Business | Equal To | Select |
| Stat Code 1 | Equal / In | Select |
| Risk Status | Equal / In | Select |

### 13.4 Query Search

| Field | Type | Mode |
|-------|------|------|
| Search text / filters | Text + criteria | E |
| Results: historical queries | G | R |
| Open similar resolution | Link | A |

---

## 14. Connect — Contacts (`UI-CON`)

| Field | Type | Mode | Required |
|-------|------|------|----------|
| Contact Type | Select | E | Y | Broker / Client |
| Name | Text | E | Y |
| Email | Text | E | N |
| Phone | Text | E | N |
| Company / Broker house | Lookup | E | N |
| Linked risks | MultiLookup | E | N |
| List grid | G | R | |
| + Create Contact | Button | A | |

---

## 15. Support (`UI-SUP`)

### 15.1 System Health Check cards

Per dependency card:

| Field | Type | Mode |
|-------|------|------|
| System name | Text | R | DMS, CRM, OBX, Redis Cache, RabbitMQ, Service link |
| Test description | Text | R |
| Result | Pass/Fail + message | R |
| Elapsed time | Number (sec) | R |
| Endpoint | Text/URL | R |
| Run / refresh | Button | A |

### 15.2 Integration Activity

| Field | Type | Mode |
|-------|------|------|
| Timestamp | DateTime | R/G |
| Source system | Text | R/G |
| Target system | Text | R/G |
| Transaction type | Text | R/G |
| Status | StatusBadge | R/G |
| Correlation / Ref | Text | R/G |
| Detail | Link | A |

### 15.3 ACR / SDC admin (Support sub-views)

| Field | Type | Mode |
|-------|------|------|
| Category Code | Text | E | e.g. BAN, BIN, BOR |
| Category Name | Text | E | |
| Active | Bool | E | |
| Cancel / Submit | Buttons | A | |
| Category list grid | G | R | |

---

## 16. Admin (`UI-ADM`)

### 16.1 Queue / RabbitMQ Admin

| Field | Type | Mode |
|-------|------|------|
| Queue name | Text | R |
| Depth / status | Number/Badge | R |
| Actions | Purge/retry (role-gated) | A |

### 16.2 App Config

| Field | Type | Mode |
|-------|------|------|
| Key | Text | R/E |
| Value | Text | E |
| Description | Text | R |
| Save | Button | A |

### 16.3 RAG — Scheduled tasks

| Field | Type | Mode |
|-------|------|------|
| Job Name | Text | R/G |
| Schedule Type | Text | R/G | Daily / Monthly + time |
| RAG Status | Badge | R/G | Pass / Fail / Must Run |
| Last Run Date | DateTime | R/G |
| Job Status | Text | R/G |
| Run Date filter | Date | E | |

Example jobs (display labels): Renew Premium Schedule, Wall Service Daily, Final Slip Tasks Creator, Policy State Translate, Premium Forecast Targets, Document Deletion/Search, Bucket Cleanup, Targeted Peer Review Daily Task Selector, Policy Email Reminder, …

---

## 17. Cross-cutting UI rules

| ID | Rule |
|----|------|
| UI-X01 | Money fields honour selected **ROE** and show CCY where relevant |
| UI-X02 | Read grids support sort + column filter + optional Excel export |
| UI-X03 | Empty states: message + optional CTA (no fake sample rows in production) |
| UI-X04 | Loading: spinner inside pane (Risk Performance / Premiums pattern) |
| UI-X05 | Destructive/write actions confirm when spawning multiple tasks |
| UI-X06 | PII / user names may be masked in demos; production shows real identity |
| UI-X07 | Mobile not primary; desktop min width ~1280px for dual panes |
| UI-X08 | Keyboard: Enter submits focused search; Esc closes modal |
| UI-X09 | Accessibility: labels on all inputs; badge counts have aria-labels |
| UI-X10 | After Open Box write, show success toast then refresh affected panes |

---

## 18. Screen inventory ↔ UI IDs

| UI ID | Screen | FR refs |
|-------|--------|---------|
| UI-PIPE | Pipeline buckets + Queries | FR-01, FR-02 |
| UI-NEW | New Risk | FR-03 |
| UI-UWF | UW File shell | FR-04 |
| UI-RISK | Risk View | FR-05 |
| UI-SEC | Section View | FR-06 |
| UI-EDIT | Edit UW Information | FR-07 |
| UI-DOC | Documents + upload | FR-08 |
| UI-CLM | Claims | FR-09 |
| UI-ASC | Associations | FR-10 |
| UI-PREM | Premium Monitoring | FR-11 |
| UI-ACT | Activity Log | FR-12 |
| UI-TASK | Task View (+ questionnaires) | FR-12 |
| UI-SRCH | Advanced / Vessel / Query Search | FR-13 |
| UI-CON | Connect contacts | FR-14 |
| UI-SUP | Support health & integration | FR-15 |
| UI-ADM | Queues, App Config, RAG | FR-16 |

---

## 19. Wireframe priority (build UI first)

1. Shell + Pipeline grid (UI-PIPE)  
2. UW File Policy Summary + Sections + Section Summary (UI-UWF, UI-RISK, UI-SEC)  
3. Edit modal (UI-EDIT) + Document upload/viewer (UI-DOC)  
4. Activity Log + Task View (UI-ACT, UI-TASK)  
5. Claims / Associations / Premium (UI-CLM, UI-ASC, UI-PREM)  
6. Search + Support + Admin (UI-SRCH, UI-SUP, UI-ADM)

---

*Field lists mirror UW staging screens captured in the sample pack; Apex may rename labels but should preserve field semantics for Open Box parity.*
