(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["features-case-hub-case-hub-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/features/case-hub/case-hub-list.component.html":
/*!******************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/features/case-hub/case-hub-list.component.html ***!
  \******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"apex-page-header\">\n  <div class=\"apex-page-header__title\">\n    <h1>Underwriter's File</h1>\n    <div class=\"apex-page-header__subtitle\">Search submissions · column filters with operators · paged grid</div>\n  </div>\n</div>\n\n<form class=\"uw-list-toolbar\" (ngSubmit)=\"load()\">\n  <div class=\"uw-list-toolbar__row\">\n    <div class=\"uw-list-field uw-list-field--search\">\n      <label for=\"uwf-search\">Search</label>\n      <input id=\"uwf-search\" type=\"search\" name=\"search\" [(ngModel)]=\"filters.search\"\n             placeholder=\"Submission #, insured name…\">\n    </div>\n    <div class=\"uw-list-field\">\n      <label for=\"uwf-status\">Status</label>\n      <select id=\"uwf-status\" name=\"status\" [(ngModel)]=\"filters.status\">\n        <option value=\"\">All</option>\n        <option *ngFor=\"let s of statusOptions\" [value]=\"s\">{{ s }}</option>\n      </select>\n    </div>\n    <div class=\"uw-list-field\">\n      <label for=\"uwf-lob\">Business Area</label>\n      <select id=\"uwf-lob\" name=\"lineOfBusiness\" [(ngModel)]=\"filters.lineOfBusiness\">\n        <option value=\"\">All areas</option>\n        <option *ngFor=\"let l of lobOptions\" [value]=\"l\">{{ l }}</option>\n      </select>\n    </div>\n    <div class=\"uw-list-field uw-list-field--actions\">\n      <label class=\"uw-list-field__spacer\">&nbsp;</label>\n      <div class=\"uw-list-actions\">\n        <button type=\"submit\" class=\"apex-btn apex-btn--sm apex-btn--primary\">Apply</button>\n        <button type=\"button\" class=\"apex-btn apex-btn--ghost apex-btn--sm\" (click)=\"clearFilters()\">Clear</button>\n        <button type=\"button\" class=\"apex-btn apex-btn--ghost apex-btn--sm\" (click)=\"clearColumnFilters()\">Clear col filters</button>\n      </div>\n    </div>\n  </div>\n</form>\n\n<apex-loading *ngIf=\"loading\" label=\"Loading submissions…\"></apex-loading>\n<div class=\"apex-alert apex-alert--danger\" *ngIf=\"error && !loading\">{{ error }}</div>\n\n<div class=\"uw-list-meta\" *ngIf=\"!loading && !error\">\n  <span>{{ filteredCount }} row{{ filteredCount === 1 ? '' : 's' }} (paged)\n    <ng-container *ngIf=\"totalCount > submissions.length\"> · {{ totalCount }} match server filters</ng-container>\n  </span>\n  <span class=\"apex-text-muted\">Use header filters for operators · pager below the grid</span>\n</div>\n\n<div id=\"apex-uwf-list-grid\"\n     class=\"ag-theme-alpine uw-list-grid\"\n     *ngIf=\"!loading && !error && submissions.length > 0\"></div>\n\n<apex-empty-state *ngIf=\"!loading && !error && submissions.length === 0\"\n                   title=\"No submissions found\"\n                   message=\"Try widening your search or clearing the filters above.\"></apex-empty-state>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/features/case-hub/case-hub.component.html":
/*!*************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/features/case-hub/case-hub.component.html ***!
  \*************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"apex-breadcrumb\">\n  <a [href]=\"auth.shellUrl('/pipeline/upcoming')\">Pipeline</a> &rsaquo;\n  Underwriter's File &rsaquo; {{ uwReference }}\n</div>\n\n<apex-loading *ngIf=\"loading\" label=\"Loading underwriter file…\"></apex-loading>\n<div class=\"apex-alert apex-alert--danger\" *ngIf=\"error && !loading\">{{ error }}</div>\n<apex-empty-state *ngIf=\"notFound && !loading\" title=\"Submission not found\"\n                   message=\"No underwriter file exists for this id.\"></apex-empty-state>\n\n<div class=\"uw-layout\" *ngIf=\"file && !loading\">\n  <aside class=\"uw-rail\">\n    <button type=\"button\" [class.active]=\"nav === 'dashboard'\" (click)=\"setNav('dashboard')\">Dashboard</button>\n    <button type=\"button\" [class.active]=\"nav === 'policy'\" (click)=\"setNav('policy')\">Policy</button>\n    <button type=\"button\" [class.active]=\"nav === 'claim'\" (click)=\"setNav('claim')\">Claim</button>\n    <button type=\"button\" [class.active]=\"nav === 'activity'\" (click)=\"setNav('activity')\">Activity Log</button>\n    <button type=\"button\" [class.active]=\"nav === 'associations'\" (click)=\"setNav('associations')\">Associations</button>\n    <button type=\"button\" [class.active]=\"nav === 'premium'\" (click)=\"setNav('premium')\">Premium Monitoring</button>\n    <button type=\"button\" [class.active]=\"nav === 'documents'\" (click)=\"setNav('documents')\">Documents</button>\n  </aside>\n\n  <div class=\"uw-main\">\n    <div class=\"uw-header\">\n      <div class=\"uw-header__identity\">\n        <strong class=\"uw-account\">{{ file.insuredName || '—' }}</strong>\n        <apex-status-badge kind=\"submission\" [value]=\"file.status\"></apex-status-badge>\n        <span class=\"uw-meta\">\n          UW Ref: <span class=\"apex-mono\">{{ uwReference }}</span>\n          · YOA: {{ file.yoa != null ? file.yoa : '—' }}\n        </span>\n      </div>\n      <div class=\"uw-toolbar\">\n        <a class=\"apex-btn apex-btn--sm\" [href]=\"openBoxUrl()\" title=\"Open Box (placeholder)\" target=\"_blank\" rel=\"noopener\">Open Box</a>\n        <button type=\"button\" class=\"apex-btn apex-btn--sm\" (click)=\"setRiskTab('summary'); setNav('policy')\">Summary</button>\n        <button type=\"button\" class=\"apex-btn apex-btn--sm\" disabled title=\"CSR\">CSR</button>\n        <a class=\"apex-btn apex-btn--sm\" [href]=\"taskInboxUrl()\">Task</a>\n        <button type=\"button\" class=\"apex-btn apex-btn--sm\" (click)=\"setNav('activity')\">Log</button>\n        <button type=\"button\" class=\"apex-btn apex-btn--sm\" (click)=\"openEditModal()\">Edit / Note</button>\n        <button type=\"button\" class=\"apex-btn apex-btn--sm\" (click)=\"setNav('documents')\">Document</button>\n        <a class=\"apex-btn apex-btn--sm\" [href]=\"modellingUrl()\">Model</a>\n      </div>\n    </div>\n\n    <!-- DASHBOARD -->\n    <ng-container *ngIf=\"nav === 'dashboard'\">\n      <div class=\"apex-panel-red\">Dashboard | {{ file.insuredName }} | {{ uwReference }}</div>\n      <div class=\"apex-card apex-card--flat\">\n        <dl class=\"apex-kv apex-kv--dense\">\n          <dt>Account</dt><dd>{{ file.insuredName || '—' }}</dd>\n          <dt>Status</dt><dd>{{ file.status || '—' }}</dd>\n          <dt>UW Reference</dt><dd class=\"apex-mono\">{{ uwReference }}</dd>\n          <dt>YOA</dt><dd>{{ file.yoa != null ? file.yoa : '—' }}</dd>\n          <dt>Broker</dt><dd>{{ file.brokerName || '—' }}</dd>\n          <dt>Sections</dt><dd>{{ file.sections?.length || 0 }}</dd>\n          <dt>Gross premium</dt><dd>{{ file.grossPremium != null ? ('£' + (file.grossPremium | number:'1.0-0')) : '—' }}</dd>\n          <dt>Net premium</dt><dd>{{ file.netPremium != null ? ('£' + (file.netPremium | number:'1.0-0')) : '—' }}</dd>\n          <dt>Claims</dt><dd>{{ file.claims?.length || 0 }}</dd>\n          <dt>Open activities</dt><dd>{{ file.activityLog?.length || 0 }}</dd>\n        </dl>\n      </div>\n    </ng-container>\n\n    <!-- POLICY / RISK VIEW -->\n    <ng-container *ngIf=\"nav === 'policy'\">\n      <div class=\"apex-panel-red\">Risk View | {{ file.insuredName }} | {{ file.status }} | {{ uwReference }}</div>\n\n      <div class=\"apex-tabs\">\n        <div class=\"apex-tabs__tab\" [class.active]=\"riskTab === 'summary'\" (click)=\"setRiskTab('summary')\">Policy Summary</div>\n        <div class=\"apex-tabs__tab\" [class.active]=\"riskTab === 'notes'\" (click)=\"setRiskTab('notes')\">Notes</div>\n        <div class=\"apex-tabs__tab\" [class.active]=\"riskTab === 'performance'\" (click)=\"setRiskTab('performance')\">Performance</div>\n        <div class=\"apex-tabs__tab\" [class.active]=\"riskTab === 'quotes'\" (click)=\"setRiskTab('quotes')\">Quotes / Sections</div>\n      </div>\n\n      <div class=\"apex-card apex-card--flat\" *ngIf=\"riskTab === 'summary'\">\n        <h3 class=\"uw-subhead\">Policy identity</h3>\n        <dl class=\"apex-kv apex-kv--dense\">\n          <dt>Inception</dt><dd>{{ (file.policyEffectiveDate || file.requestedEffectiveDate) | date:'dd MMM yyyy' }}</dd>\n          <dt>Expiry</dt><dd>{{ file.policyExpiryDate ? (file.policyExpiryDate | date:'dd MMM yyyy') : '—' }}</dd>\n          <dt>Broker</dt><dd>{{ file.brokerName || '—' }}</dd>\n          <dt>Broker Contact</dt><dd>{{ file.brokerContact || '—' }}</dd>\n          <dt>UMR</dt><dd>{{ file.umr || '—' }}</dd>\n          <dt>Broker Reference</dt><dd>{{ file.brokerReference || '—' }}</dd>\n          <dt>MOP</dt><dd>{{ file.mop || '—' }}</dd>\n          <dt>Policy Description</dt><dd>{{ file.policyDescription || '—' }}</dd>\n          <dt>Insured</dt><dd>{{ file.insuredName || '—' }}</dd>\n          <dt>Reinsured</dt><dd>{{ file.reinsured || '—' }}</dd>\n          <dt>Domicile</dt><dd>{{ file.domicile || '—' }}</dd>\n          <dt>Slip Leader</dt><dd>{{ file.slipLeader || '—' }}</dd>\n          <dt>Policy Type</dt><dd>{{ file.policyType || '—' }}</dd>\n          <dt>Risk Appetite</dt><dd>{{ file.riskAppetite || '—' }}</dd>\n        </dl>\n\n        <h3 class=\"uw-subhead\">Policy / Apex Share metrics</h3>\n        <dl class=\"apex-kv apex-kv--dense\">\n          <dt>Gross Premium</dt><dd>{{ file.grossPremium != null ? ('£' + (file.grossPremium | number:'1.0-0')) : '—' }}</dd>\n          <dt>Net Premium</dt><dd>{{ file.netPremium != null ? ('£' + (file.netPremium | number:'1.0-0')) : '—' }}</dd>\n          <dt>Weighted TI</dt><dd>{{ file.weightedTi != null ? (file.weightedTi | number:'1.2-2') : '—' }}</dd>\n          <dt>Weighted RRM</dt><dd>{{ file.weightedRrm != null ? (file.weightedRrm | number:'1.2-2') : '—' }}</dd>\n          <dt>Long Term Loss Ratio</dt><dd>{{ file.longTermLossRatio != null ? (file.longTermLossRatio | number:'1.2-2') : '—' }}</dd>\n          <dt>Rate Adequacy</dt><dd>{{ file.rateAdequacy != null ? (file.rateAdequacy | number:'1.2-2') : '—' }}</dd>\n          <dt>Expected Premium</dt><dd>{{ file.expectedPremium != null ? ('£' + (file.expectedPremium | number:'1.0-0')) : '—' }}</dd>\n          <dt>Net Signed Premium</dt><dd>{{ file.netSignedPremium != null ? ('£' + (file.netSignedPremium | number:'1.0-0')) : '—' }}</dd>\n          <dt>Exposure</dt><dd>{{ file.sumInsured != null ? ('£' + (file.sumInsured | number:'1.0-0')) : '—' }}</dd>\n        </dl>\n      </div>\n\n      <div class=\"apex-card apex-card--flat\" *ngIf=\"riskTab === 'notes'\">\n        <p *ngIf=\"file.notesType\"><strong>Notes type:</strong> {{ file.notesType }}</p>\n        <p *ngIf=\"file.notes\">{{ file.notes }}</p>\n        <p class=\"apex-text-muted\" *ngIf=\"!file.notes\">No underwriting notes. Use Edit / Note to write through Open Box.</p>\n        <h3>Risk answers</h3>\n        <div class=\"apex-alert apex-alert--danger\" *ngIf=\"riskError\">{{ riskError }}</div>\n        <table class=\"apex-table apex-table--dense\" *ngIf=\"riskAnswers.length\">\n          <thead><tr><th>Code</th><th>Question</th><th>Answer</th><th></th></tr></thead>\n          <tbody>\n            <tr *ngFor=\"let a of riskAnswers; let i = index\">\n              <td><input [(ngModel)]=\"a.questionCode\"></td>\n              <td><input [(ngModel)]=\"a.questionText\"></td>\n              <td><input [(ngModel)]=\"a.answerText\"></td>\n              <td><button type=\"button\" class=\"apex-btn apex-btn--sm apex-btn--ghost\" (click)=\"removeRiskAnswer(i)\">Remove</button></td>\n            </tr>\n          </tbody>\n        </table>\n        <div class=\"apex-btn-row\">\n          <button type=\"button\" class=\"apex-btn apex-btn--ghost apex-btn--sm\" (click)=\"addRiskAnswer()\">+ Add</button>\n          <button type=\"button\" class=\"apex-btn apex-btn--primary apex-btn--sm\" [disabled]=\"riskSaving\" (click)=\"saveRiskAnswers()\">\n            {{ riskSaving ? 'Saving…' : 'Save notes / answers' }}\n          </button>\n        </div>\n      </div>\n\n      <div class=\"apex-card apex-card--flat\" *ngIf=\"riskTab === 'performance'\">\n        <div class=\"uw-perf-filters\">\n          <label>YOA <strong>{{ file.yoa != null ? file.yoa : '—' }}</strong></label>\n          <label>\n            CCY\n            <select [(ngModel)]=\"performanceCcy\" name=\"perfCcy\">\n              <option value=\"GBP\">GBP</option>\n              <option value=\"USD\">USD</option>\n              <option value=\"EUR\">EUR</option>\n            </select>\n          </label>\n          <span class=\"uw-roe-note\">ROE: rates as at settlement (Open Box replica)</span>\n        </div>\n\n        <h3 class=\"uw-subhead\">Apex Line Share</h3>\n        <table class=\"apex-table apex-table--dense\">\n          <thead>\n            <tr>\n              <th>YOA</th><th>CCY</th><th>Gross</th><th>Net</th>\n              <th>Paid</th><th>OS Reserve</th><th>Incurred</th><th>LR</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr *ngFor=\"let r of filteredPerformanceRows(file.performance?.lineShare)\">\n              <td>{{ r.yoa != null ? r.yoa : '—' }}</td>\n              <td>{{ r.ccy || '—' }}</td>\n              <td>£{{ r.grossPremium | number:'1.0-0' }}</td>\n              <td>£{{ r.netPremium | number:'1.0-0' }}</td>\n              <td>£{{ r.paidClaims | number:'1.0-0' }}</td>\n              <td>£{{ r.outstandingReserve | number:'1.0-0' }}</td>\n              <td>£{{ r.incurredClaims | number:'1.0-0' }}</td>\n              <td>{{ r.lossRatio != null ? (r.lossRatio | number:'1.2-2') : '—' }}</td>\n            </tr>\n            <tr *ngIf=\"!filteredPerformanceRows(file.performance?.lineShare)?.length\">\n              <td colspan=\"8\" class=\"uw-empty-row\">No Apex Line Share rows</td>\n            </tr>\n          </tbody>\n        </table>\n\n        <h3 class=\"uw-subhead\">100% Order</h3>\n        <table class=\"apex-table apex-table--dense\">\n          <thead>\n            <tr>\n              <th>YOA</th><th>CCY</th><th>Gross</th><th>Net</th>\n              <th>Paid</th><th>OS Reserve</th><th>Incurred</th><th>LR</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr *ngFor=\"let r of filteredPerformanceRows(file.performance?.fullOrder)\">\n              <td>{{ r.yoa != null ? r.yoa : '—' }}</td>\n              <td>{{ r.ccy || '—' }}</td>\n              <td>£{{ r.grossPremium | number:'1.0-0' }}</td>\n              <td>£{{ r.netPremium | number:'1.0-0' }}</td>\n              <td>£{{ r.paidClaims | number:'1.0-0' }}</td>\n              <td>£{{ r.outstandingReserve | number:'1.0-0' }}</td>\n              <td>£{{ r.incurredClaims | number:'1.0-0' }}</td>\n              <td>{{ r.lossRatio != null ? (r.lossRatio | number:'1.2-2') : '—' }}</td>\n            </tr>\n            <tr *ngIf=\"!filteredPerformanceRows(file.performance?.fullOrder)?.length\">\n              <td colspan=\"8\" class=\"uw-empty-row\">No 100% Order rows</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n\n      <div class=\"apex-card apex-card--flat\" *ngIf=\"riskTab === 'quotes'\">\n        <div class=\"apex-card__header\">\n          <h3>Sections (quotes)</h3>\n          <button type=\"button\" class=\"apex-btn apex-btn--sm\" *ngIf=\"file.status !== 'Bound'\" (click)=\"toggleQuoteForm()\">\n            {{ showQuoteForm ? 'Cancel' : '+ Create quote' }}\n          </button>\n        </div>\n        <div class=\"apex-alert apex-alert--danger\" *ngIf=\"quotesError\">{{ quotesError }}</div>\n        <form *ngIf=\"showQuoteForm\" (ngSubmit)=\"createQuote()\" class=\"apex-mt-16\">\n          <div class=\"apex-form-grid\">\n            <div class=\"apex-form-row\"><label>Sum insured</label><input type=\"number\" name=\"si\" [(ngModel)]=\"quoteDraft.sumInsured\"></div>\n            <div class=\"apex-form-row\"><label>Limit</label><input type=\"number\" name=\"lim\" [(ngModel)]=\"quoteDraft.limitOfIndemnity\"></div>\n            <div class=\"apex-form-row\"><label>Deductible</label><input type=\"number\" name=\"ded\" [(ngModel)]=\"quoteDraft.deductible\"></div>\n            <div class=\"apex-form-row\"><label>Commission %</label><input type=\"number\" name=\"comm\" [(ngModel)]=\"quoteDraft.commissionPercent\"></div>\n          </div>\n          <button type=\"submit\" class=\"apex-btn apex-btn--primary\" [disabled]=\"quoteCreating\">\n            {{ quoteCreating ? 'Rating…' : 'Rate &amp; save quote' }}\n          </button>\n        </form>\n        <table class=\"apex-table apex-table--dense\" *ngIf=\"file.sections?.length\">\n          <thead>\n            <tr>\n              <th>UW Ref</th><th>Ver</th><th>GoM Wind</th><th>LBS</th><th>LIC</th>\n              <th>Excess</th><th>Est Sign</th><th>Act Sign</th><th>Exposure</th>\n              <th>RRM</th><th>TI</th><th>Gross</th><th>Referral</th><th></th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr *ngFor=\"let s of file.sections\" (click)=\"selectSection(s)\" [class.apex-row--selected]=\"selectedSection?.quoteId === s.quoteId\">\n              <td class=\"apex-mono\">{{ s.quoteNumber }}</td>\n              <td>v{{ s.versionNumber }}</td>\n              <td>{{ s.gomWind || '—' }}</td>\n              <td>{{ s.lbs ? 'Y' : 'N' }}</td>\n              <td>{{ s.lic ? 'Y' : 'N' }}</td>\n              <td>£{{ s.deductible | number:'1.0-0' }}</td>\n              <td>{{ s.estSigning != null ? s.estSigning : '—' }}</td>\n              <td>{{ s.actSigning != null ? s.actSigning : '—' }}</td>\n              <td>£{{ (s.exposure != null ? s.exposure : s.sumInsured) | number:'1.0-0' }}</td>\n              <td>{{ s.rrm != null ? (s.rrm | number:'1.2-2') : '—' }}</td>\n              <td>{{ s.technicalIndex != null ? (s.technicalIndex | number:'1.2-2') : '—' }}</td>\n              <td>£{{ s.grossPremium | number:'1.0-0' }}</td>\n              <td>{{ s.isReferralRequired ? s.referralDecision : 'Clear' }}</td>\n              <td class=\"apex-btn-row\" (click)=\"$event.stopPropagation()\">\n                <span class=\"apex-badge apex-badge--success\" *ngIf=\"s.isSelected\">Selected</span>\n                <button type=\"button\" class=\"apex-btn apex-btn--sm apex-btn--ghost\" *ngIf=\"!s.isSelected && file.status !== 'Bound'\"\n                        [disabled]=\"quoteBusyId === s.quoteId\" (click)=\"selectQuote(s)\">Select</button>\n                <button type=\"button\" class=\"apex-btn apex-btn--sm apex-btn--primary\" *ngIf=\"file.status !== 'Bound' && canBind(s)\"\n                        [disabled]=\"quoteBusyId === s.quoteId\" (click)=\"bindQuote(s)\">Bind</button>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n\n      <div class=\"apex-panel-red\" *ngIf=\"selectedSection\">\n        Section View | {{ file.insuredName }} | {{ file.status }} | {{ selectedSection.quoteNumber }}\n      </div>\n      <div *ngIf=\"selectedSection\">\n        <div class=\"apex-tabs\">\n          <div class=\"apex-tabs__tab\" [class.active]=\"sectionTab === 'summary'\" (click)=\"setSectionTab('summary')\">Section Summary</div>\n          <div class=\"apex-tabs__tab\" [class.active]=\"sectionTab === 'limits'\" (click)=\"setSectionTab('limits')\">Limits</div>\n          <div class=\"apex-tabs__tab\" [class.active]=\"sectionTab === 'premiums'\" (click)=\"setSectionTab('premiums')\">Premiums</div>\n          <div class=\"apex-tabs__tab\" [class.active]=\"sectionTab === 'performance'\" (click)=\"setSectionTab('performance')\">Performance</div>\n          <div class=\"apex-tabs__tab\" [class.active]=\"sectionTab === 'bureau'\" (click)=\"setSectionTab('bureau')\">Bureau</div>\n          <div class=\"apex-tabs__tab\" [class.active]=\"sectionTab === 'deductions'\" (click)=\"setSectionTab('deductions')\">Deductions</div>\n          <div class=\"apex-tabs__tab\" [class.active]=\"sectionTab === 'outwardsRi'\" (click)=\"setSectionTab('outwardsRi')\">Outwards RI</div>\n          <div class=\"apex-tabs__tab\" [class.active]=\"sectionTab === 'declarations'\" (click)=\"setSectionTab('declarations')\">Declarations</div>\n        </div>\n\n        <div class=\"apex-card apex-card--flat\" *ngIf=\"sectionTab === 'summary'\">\n          <div class=\"uw-section-layout\">\n            <dl class=\"apex-kv apex-kv--dense\">\n              <dt>Business Area</dt><dd>{{ selectedSection.businessArea || file.businessArea || '—' }}</dd>\n              <dt>Stat1</dt><dd>{{ selectedSection.statCode1 || '—' }}</dd>\n              <dt>Stat2</dt><dd>{{ selectedSection.statCode2 || '—' }}</dd>\n              <dt>Sub Stat1</dt><dd>{{ selectedSection.subStat1 || '—' }}</dd>\n              <dt>Basis</dt><dd>{{ selectedSection.basis || '—' }}</dd>\n              <dt>Facility</dt><dd>{{ selectedSection.facility ? 'Y' : 'N' }}</dd>\n              <dt>LIC Secondee</dt><dd>{{ selectedSection.licSecondee || '—' }}</dd>\n              <dt>E-trading</dt><dd>{{ selectedSection.etradingPlatform || '—' }}</dd>\n              <dt>CCY</dt><dd>{{ selectedSection.ccy || '—' }}</dd>\n              <dt>FAC RI</dt><dd>{{ selectedSection.facRi ? 'Y' : 'N' }}</dd>\n              <dt>Syndicate</dt><dd>{{ selectedSection.syndicate || '—' }}</dd>\n              <dt>Written Line</dt><dd>{{ selectedSection.writtenLine != null ? selectedSection.writtenLine : '—' }}</dd>\n              <dt>Signed Line</dt><dd>{{ selectedSection.signedLine != null ? selectedSection.signedLine : '—' }}</dd>\n              <dt>Est Signing</dt><dd>{{ selectedSection.estSigning != null ? selectedSection.estSigning : '—' }}</dd>\n              <dt>Act Signing</dt><dd>{{ selectedSection.actSigning != null ? selectedSection.actSigning : '—' }}</dd>\n              <dt>Broker Order</dt><dd>{{ selectedSection.brokerOrder != null ? selectedSection.brokerOrder : '—' }}</dd>\n              <dt>Technical Index</dt><dd>{{ selectedSection.technicalIndex != null ? selectedSection.technicalIndex : '—' }}</dd>\n              <dt>Risk Code</dt><dd>{{ selectedSection.riskCode || '—' }}</dd>\n              <dt>Inception</dt><dd>{{ selectedSection.inception ? (selectedSection.inception | date:'dd MMM yyyy') : '—' }}</dd>\n              <dt>Expiry</dt><dd>{{ selectedSection.expiry ? (selectedSection.expiry | date:'dd MMM yyyy') : '—' }}</dd>\n              <dt>UW Principal</dt><dd>{{ selectedSection.uwPrincipal || file.underwriterName || '—' }}</dd>\n            </dl>\n            <div class=\"uw-kpi-strip\">\n              <div class=\"uw-kpi-strip__item\"><span class=\"uw-kpi-strip__label\">RRM</span><span class=\"uw-kpi-strip__value\">{{ selectedSection.rrm != null ? (selectedSection.rrm | number:'1.2-2') : '—' }}</span></div>\n              <div class=\"uw-kpi-strip__item\"><span class=\"uw-kpi-strip__label\">Ded X/S</span><span class=\"uw-kpi-strip__value\">{{ selectedSection.dedXs != null ? ('£' + (selectedSection.dedXs | number:'1.0-0')) : '—' }}</span></div>\n              <div class=\"uw-kpi-strip__item\"><span class=\"uw-kpi-strip__label\">Prem/Rate</span><span class=\"uw-kpi-strip__value\">{{ selectedSection.premRate != null ? (selectedSection.premRate | number:'1.2-4') : '—' }}</span></div>\n              <div class=\"uw-kpi-strip__item\"><span class=\"uw-kpi-strip__label\">Limit</span><span class=\"uw-kpi-strip__value\">£{{ selectedSection.limitOfIndemnity | number:'1.0-0' }}</span></div>\n              <div class=\"uw-kpi-strip__item\"><span class=\"uw-kpi-strip__label\">Risk Change</span><span class=\"uw-kpi-strip__value\">{{ selectedSection.riskChange != null ? (selectedSection.riskChange | number:'1.2-2') : '—' }}</span></div>\n              <div class=\"uw-kpi-strip__item\"><span class=\"uw-kpi-strip__label\">T&amp;C</span><span class=\"uw-kpi-strip__value\">{{ selectedSection.tcChange != null ? (selectedSection.tcChange | number:'1.2-2') : '—' }}</span></div>\n              <div class=\"uw-kpi-strip__item\"><span class=\"uw-kpi-strip__label\">Other</span><span class=\"uw-kpi-strip__value\">{{ selectedSection.otherChange != null ? (selectedSection.otherChange | number:'1.2-2') : '—' }}</span></div>\n              <div class=\"uw-kpi-strip__item uw-kpi-strip__item--total\"><span class=\"uw-kpi-strip__label\">Total</span><span class=\"uw-kpi-strip__value\">{{ selectedSection.kpiTotal != null ? (selectedSection.kpiTotal | number:'1.2-2') : '—' }}</span></div>\n            </div>\n          </div>\n        </div>\n\n        <div class=\"apex-card apex-card--flat\" *ngIf=\"sectionTab === 'limits'\">\n          <table class=\"apex-table apex-table--dense\">\n            <thead>\n              <tr>\n                <th>Agg</th><th>Type</th><th>Basis</th><th>Co-ins</th>\n                <th>Limit</th><th>Excess</th><th>Agg Limit</th><th>Desc</th>\n              </tr>\n            </thead>\n            <tbody>\n              <tr *ngFor=\"let r of selectedSection.limitsRows\">\n                <td>{{ r.col1 || '—' }}</td>\n                <td>{{ r.col2 || '—' }}</td>\n                <td>{{ r.col3 || '—' }}</td>\n                <td>{{ r.col4 || '—' }}</td>\n                <td>{{ r.col5 || '—' }}</td>\n                <td>{{ r.col6 || '—' }}</td>\n                <td>{{ r.col7 || '—' }}</td>\n                <td>{{ r.col8 || '—' }}</td>\n              </tr>\n              <tr *ngIf=\"!selectedSection.limitsRows?.length\">\n                <td colspan=\"8\" class=\"uw-empty-row\">No limits rows</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"apex-card apex-card--flat\" *ngIf=\"sectionTab === 'premiums'\">\n          <table class=\"apex-table apex-table--dense\">\n            <thead>\n              <tr>\n                <th>Type</th><th>Basis</th><th>CCY</th><th>EGPI</th>\n                <th>ENPI</th><th>Comm</th><th>SDI</th><th>Desc</th>\n              </tr>\n            </thead>\n            <tbody>\n              <tr *ngFor=\"let r of selectedSection.premiumRows\">\n                <td>{{ r.col1 || '—' }}</td>\n                <td>{{ r.col2 || '—' }}</td>\n                <td>{{ r.col3 || '—' }}</td>\n                <td>{{ r.col4 || '—' }}</td>\n                <td>{{ r.col5 || '—' }}</td>\n                <td>{{ r.col6 || '—' }}</td>\n                <td>{{ r.col7 || '—' }}</td>\n                <td>{{ r.col8 || '—' }}</td>\n              </tr>\n              <tr *ngIf=\"!selectedSection.premiumRows?.length\">\n                <td colspan=\"8\" class=\"uw-empty-row\">No premium rows</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"apex-card apex-card--flat\" *ngIf=\"sectionTab === 'performance'\">\n          <table class=\"apex-table apex-table--dense\">\n            <thead>\n              <tr><th>Status</th><th>YOA</th><th>Technical Premium</th><th>Signed Premium</th><th>PLR</th><th>ILR</th></tr>\n            </thead>\n            <tbody>\n              <tr *ngFor=\"let r of selectedSection.performanceRows\">\n                <td>{{ r.col1 || '—' }}</td>\n                <td>{{ r.col2 || '—' }}</td>\n                <td>{{ r.col3 || '—' }}</td>\n                <td>{{ r.col4 || '—' }}</td>\n                <td>{{ r.col5 || '—' }}</td>\n                <td>{{ r.col6 || '—' }}</td>\n              </tr>\n              <tr *ngIf=\"!selectedSection.performanceRows?.length\">\n                <td colspan=\"6\" class=\"uw-empty-row\">No performance rows</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"apex-card apex-card--flat\" *ngIf=\"sectionTab === 'bureau'\">\n          <table class=\"apex-table apex-table--dense\">\n            <thead>\n              <tr><th>Bureau Ref</th><th>Lloyd's PIN</th><th>Status</th><th>Detail</th></tr>\n            </thead>\n            <tbody>\n              <tr *ngFor=\"let r of selectedSection.bureauRows\">\n                <td>{{ r.col1 || '—' }}</td>\n                <td>{{ r.col2 || '—' }}</td>\n                <td>{{ r.col3 || '—' }}</td>\n                <td>{{ r.col4 || '—' }}</td>\n              </tr>\n              <tr *ngIf=\"!selectedSection.bureauRows?.length\">\n                <td colspan=\"4\" class=\"uw-empty-row\">No bureau rows</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"apex-card apex-card--flat\" *ngIf=\"sectionTab === 'deductions'\">\n          <table class=\"apex-table apex-table--dense\">\n            <thead>\n              <tr><th>Type</th><th>%</th><th>Amount</th><th>CCY</th></tr>\n            </thead>\n            <tbody>\n              <tr *ngFor=\"let r of selectedSection.deductionRows\">\n                <td>{{ r.col1 || '—' }}</td>\n                <td>{{ r.col2 || '—' }}</td>\n                <td>{{ r.col3 || '—' }}</td>\n                <td>{{ r.col4 || '—' }}</td>\n              </tr>\n              <tr *ngIf=\"!selectedSection.deductionRows?.length\">\n                <td colspan=\"4\" class=\"uw-empty-row\">No deduction rows</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"apex-card apex-card--flat\" *ngIf=\"sectionTab === 'outwardsRi'\">\n          <table class=\"apex-table apex-table--dense\">\n            <thead>\n              <tr><th>RI Type</th><th>Carrier</th><th>%</th><th>Premium</th><th>Exposure</th></tr>\n            </thead>\n            <tbody>\n              <tr *ngFor=\"let r of selectedSection.outwardsRiRows\">\n                <td>{{ r.col1 || '—' }}</td>\n                <td>{{ r.col2 || '—' }}</td>\n                <td>{{ r.col3 || '—' }}</td>\n                <td>{{ r.col4 || '—' }}</td>\n                <td>{{ r.col5 || '—' }}</td>\n              </tr>\n              <tr *ngIf=\"!selectedSection.outwardsRiRows?.length\">\n                <td colspan=\"5\" class=\"uw-empty-row\">No outwards RI rows</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n\n        <div class=\"apex-card apex-card--flat\" *ngIf=\"sectionTab === 'declarations'\">\n          <table class=\"apex-table apex-table--dense\">\n            <thead>\n              <tr><th>Declaration Date</th><th>Period</th><th>Premium</th><th>Status</th></tr>\n            </thead>\n            <tbody>\n              <tr *ngFor=\"let r of selectedSection.declarationRows\">\n                <td>{{ r.col1 || '—' }}</td>\n                <td>{{ r.col2 || '—' }}</td>\n                <td>{{ r.col3 || '—' }}</td>\n                <td>{{ r.col4 || '—' }}</td>\n              </tr>\n              <tr *ngIf=\"!selectedSection.declarationRows?.length\">\n                <td colspan=\"4\" class=\"uw-empty-row\">No declaration rows</td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </ng-container>\n\n    <!-- CLAIMS -->\n    <ng-container *ngIf=\"nav === 'claim'\">\n      <div class=\"apex-panel-red\">Claims | {{ file.insuredName }}</div>\n      <div class=\"uw-kpi-strip\" *ngIf=\"file.claims?.length\">\n        <div class=\"uw-kpi-strip__item\"><span class=\"uw-kpi-strip__label\">ILR</span><span class=\"uw-kpi-strip__value\">{{ claimKpis.ilr != null ? (claimKpis.ilr | number:'1.2-2') : '—' }}</span></div>\n        <div class=\"uw-kpi-strip__item\"><span class=\"uw-kpi-strip__label\">CAP</span><span class=\"uw-kpi-strip__value\">{{ claimKpis.cap != null ? claimKpis.cap : '—' }}</span></div>\n        <div class=\"uw-kpi-strip__item\"><span class=\"uw-kpi-strip__label\">Apex Share NP</span><span class=\"uw-kpi-strip__value\">{{ claimKpis.apexShareNp != null ? ('£' + (claimKpis.apexShareNp | number:'1.0-0')) : '—' }}</span></div>\n        <div class=\"uw-kpi-strip__item\"><span class=\"uw-kpi-strip__label\">Exposure</span><span class=\"uw-kpi-strip__value\">{{ claimKpis.exposure != null ? ('£' + (claimKpis.exposure | number:'1.0-0')) : '—' }}</span></div>\n      </div>\n      <apex-empty-state *ngIf=\"!file.claims?.length\" title=\"No claims reported\" message=\"Claims appear after FNOL on a bound policy.\"></apex-empty-state>\n      <table class=\"apex-table apex-table--dense\" *ngIf=\"file.claims?.length\">\n        <thead>\n          <tr>\n            <th>UCR</th><th>Claim #</th><th>Claimant</th><th>Location</th>\n            <th>DOL</th><th>DON</th><th>CCY</th><th>PTD</th>\n            <th>Status</th><th>Reserve</th><th>Paid</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr *ngFor=\"let c of file.claims\">\n            <td>{{ c.ucr || '—' }}</td>\n            <td><a class=\"apex-table__link\" [href]=\"auth.shellUrl('/claims/' + c.id)\">{{ c.claimNumber }}</a></td>\n            <td>{{ c.claimant || '—' }}</td>\n            <td>{{ c.location || '—' }}</td>\n            <td>{{ c.dateOfLoss ? (c.dateOfLoss | date:'dd MMM yyyy') : '—' }}</td>\n            <td>{{ c.dateOfNotification ? (c.dateOfNotification | date:'dd MMM yyyy') : '—' }}</td>\n            <td>{{ c.ccy || '—' }}</td>\n            <td>{{ c.ptd != null ? ('£' + (c.ptd | number:'1.0-0')) : '—' }}</td>\n            <td>{{ c.status }}</td>\n            <td>£{{ c.reserveAmount | number:'1.0-0' }}</td>\n            <td>£{{ c.paidAmount | number:'1.0-0' }}</td>\n          </tr>\n        </tbody>\n      </table>\n    </ng-container>\n\n    <!-- ACTIVITY -->\n    <ng-container *ngIf=\"nav === 'activity'\">\n      <div class=\"apex-panel-red\">Activity Log | {{ uwReference }}</div>\n      <apex-empty-state *ngIf=\"!file.activityLog?.length\" title=\"No activity\" message=\"Tasks, referrals, and audits appear here.\"></apex-empty-state>\n      <table class=\"apex-table apex-table--dense\" *ngIf=\"file.activityLog?.length\">\n        <thead>\n          <tr>\n            <th>Type</th><th>Title</th><th>Doc Info</th><th>Lloyd's PIN</th>\n            <th>Owner</th><th>Created By/Owner</th><th>Completed By</th><th>Reference</th>\n            <th>Created</th><th>Completed</th><th>Status</th><th>Detail &gt;</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr *ngFor=\"let a of file.activityLog\">\n            <td>{{ a.activityType }}</td>\n            <td>{{ a.title }}</td>\n            <td>{{ a.docInfo || '—' }}</td>\n            <td>{{ a.lloydsPin || '—' }}</td>\n            <td>{{ a.ownerName || '—' }}</td>\n            <td>{{ a.ownerName || '—' }}</td>\n            <td>{{ a.completedByName || '—' }}</td>\n            <td>{{ a.reference || '—' }}</td>\n            <td>{{ a.createdDate | date:'dd MMM yyyy HH:mm' }}</td>\n            <td>{{ a.completedDate ? (a.completedDate | date:'dd MMM yyyy HH:mm') : '—' }}</td>\n            <td>{{ a.status }}</td>\n            <td>\n              <a *ngIf=\"activityDetailUrl(a) as detailUrl\" class=\"apex-table__link\" [href]=\"detailUrl\">Detail &gt;</a>\n              <span *ngIf=\"!activityDetailUrl(a)\">{{ a.detail || '—' }}</span>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </ng-container>\n\n    <!-- ASSOCIATIONS -->\n    <ng-container *ngIf=\"nav === 'associations'\">\n      <div class=\"apex-panel-red\">Associations</div>\n      <table class=\"apex-table apex-table--dense\">\n        <thead>\n          <tr>\n            <th>Kind</th><th>Name</th><th>Description</th><th>YOA</th><th>Notes</th>\n            <th>Gross</th><th>Net</th><th>Exposure</th><th></th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr *ngFor=\"let a of file.associations\">\n            <td>{{ a.kind }}</td>\n            <td>{{ a.label || a.name || '—' }}</td>\n            <td>{{ a.description || '—' }}</td>\n            <td>{{ a.yoa != null ? a.yoa : '—' }}</td>\n            <td>{{ a.notes || '—' }}</td>\n            <td>{{ a.grossPremium != null ? ('£' + (a.grossPremium | number:'1.0-0')) : '—' }}</td>\n            <td>{{ a.netPremium != null ? ('£' + (a.netPremium | number:'1.0-0')) : '—' }}</td>\n            <td>{{ a.exposure != null ? ('£' + (a.exposure | number:'1.0-0')) : '—' }}</td>\n            <td><a *ngIf=\"a.link\" [href]=\"a.link\" class=\"apex-table__link\">Open</a></td>\n          </tr>\n          <tr *ngIf=\"!file.associations?.length\">\n            <td colspan=\"9\" class=\"uw-empty-row\">No associations</td>\n          </tr>\n        </tbody>\n      </table>\n    </ng-container>\n\n    <!-- PREMIUM MONITORING -->\n    <ng-container *ngIf=\"nav === 'premium'\">\n      <div class=\"apex-panel-red\">Premium Monitoring | {{ uwReference }}</div>\n      <apex-empty-state *ngIf=\"!file.premiumSchedule?.length\" title=\"No premium schedule\"\n                       message=\"Open Box replica — no rows.\"></apex-empty-state>\n      <table class=\"apex-table apex-table--dense\" *ngIf=\"file.premiumSchedule?.length\">\n        <thead>\n          <tr>\n            <th>UW Reference</th>\n            <th>Inception</th>\n            <th>Expiry</th>\n            <th>EGPI</th>\n            <th>Commission</th>\n            <th>Brokerage</th>\n            <th>PC</th>\n            <th>PC Paid to Date</th>\n            <th>ILR</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr *ngFor=\"let p of file.premiumSchedule\">\n            <td class=\"apex-mono\">{{ p.uwReference || '—' }}</td>\n            <td>{{ p.inception ? (p.inception | date:'dd MMM yyyy') : '—' }}</td>\n            <td>{{ p.expiry ? (p.expiry | date:'dd MMM yyyy') : '—' }}</td>\n            <td>{{ p.egpi != null ? ('£' + (p.egpi | number:'1.0-0')) : '—' }}</td>\n            <td>{{ p.commission != null ? ('£' + (p.commission | number:'1.0-0')) : '—' }}</td>\n            <td>{{ p.brokerage != null ? ('£' + (p.brokerage | number:'1.0-0')) : '—' }}</td>\n            <td>{{ p.pc != null ? ('£' + (p.pc | number:'1.0-0')) : '—' }}</td>\n            <td>{{ p.pcPaidToDate != null ? ('£' + (p.pcPaidToDate | number:'1.0-0')) : '—' }}</td>\n            <td>{{ p.ilr != null ? (p.ilr | number:'1.2-2') : '—' }}</td>\n          </tr>\n        </tbody>\n      </table>\n    </ng-container>\n\n    <!-- DOCUMENTS -->\n    <ng-container *ngIf=\"nav === 'documents'\">\n      <div class=\"apex-panel-red\">Documents | {{ file.insuredName }} | {{ uwReference }}</div>\n      <div class=\"apex-btn-row apex-mb-16\">\n        <a class=\"apex-btn apex-btn--sm apex-btn--primary\" [href]=\"shellDocumentsUrl()\">Manage / upload</a>\n      </div>\n      <apex-empty-state *ngIf=\"!file.documents?.length\" title=\"No documents\" message=\"Upload proposal forms and schedules from Documents.\"></apex-empty-state>\n      <div class=\"uw-docs-layout\" *ngIf=\"file.documents?.length\">\n        <div class=\"uw-docs-folders\">\n          <div class=\"uw-docs-folder\" *ngFor=\"let folder of documentFolders\">\n            <div class=\"uw-docs-folder__title\">{{ folder.type }}</div>\n            <ul class=\"uw-docs-folder__list\">\n              <li *ngFor=\"let d of folder.docs\" [class.uw-docs-folder__item--active]=\"previewDocId === d.id\">\n                <button type=\"button\" class=\"uw-docs-file\" (click)=\"previewDocument(d)\">{{ d.fileName }}</button>\n                <button type=\"button\" class=\"apex-btn apex-btn--sm apex-btn--ghost\" (click)=\"downloadDocument(d)\">Download</button>\n              </li>\n            </ul>\n          </div>\n        </div>\n        <div class=\"uw-docs-preview\" *ngIf=\"previewDoc\">\n          <div class=\"uw-docs-preview__header\">\n            <strong>{{ previewDoc.fileName }}</strong>\n            <span class=\"apex-text-muted\">{{ previewDoc.documentType }} · v{{ previewDoc.versionNumber }}</span>\n          </div>\n          <iframe *ngIf=\"isPdfDoc(previewDoc)\"\n                  class=\"uw-docs-preview__frame\"\n                  [src]=\"documentPreviewUrl(previewDoc)\"\n                  title=\"Document preview\"></iframe>\n          <p class=\"apex-text-muted\" *ngIf=\"!isPdfDoc(previewDoc)\">\n            Preview available for PDF only. Use Download for this file ({{ previewDoc.contentType || 'unknown type' }}).\n          </p>\n        </div>\n      </div>\n    </ng-container>\n  </div>\n</div>\n\n<!-- Edit / Note modal (UI-EDIT) -->\n<div class=\"uw-modal-backdrop\" *ngIf=\"showEditModal\" (click)=\"closeEditModal()\"></div>\n<div class=\"uw-modal\" *ngIf=\"showEditModal\" role=\"dialog\" aria-labelledby=\"uw-edit-title\">\n  <div class=\"uw-modal__header\">\n    <h2 id=\"uw-edit-title\">Add Underwriting Information to {{ uwReference }}</h2>\n    <button type=\"button\" class=\"apex-btn apex-btn--sm apex-btn--ghost\" (click)=\"closeEditModal()\" [disabled]=\"editSaving\">Close</button>\n  </div>\n  <p class=\"uw-modal__hint\">Writes go through Open Box. Display refreshes from the Open Box replica after submit.</p>\n  <div class=\"apex-alert apex-alert--danger\" *ngIf=\"editError\">{{ editError }}</div>\n  <form (ngSubmit)=\"submitEdit()\">\n    <div class=\"apex-form-grid\">\n      <div class=\"apex-form-row\">\n        <label>Risk Status</label>\n        <select name=\"riskStatus\" [(ngModel)]=\"editForm.riskStatus\">\n          <option value=\"\">—</option>\n          <option value=\"Received\">Received</option>\n          <option value=\"Quoted\">Quoted</option>\n          <option value=\"Bound\">Bound</option>\n          <option value=\"Declined\">Declined</option>\n          <option value=\"NotTakenUp\">Not Taken Up</option>\n        </select>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Broker Contact</label>\n        <input type=\"text\" name=\"brokerContact\" [(ngModel)]=\"editForm.brokerContact\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Inception</label>\n        <input type=\"date\" name=\"inception\" [(ngModel)]=\"editForm.inception\" required>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Expiry</label>\n        <input type=\"date\" name=\"expiry\" [(ngModel)]=\"editForm.expiry\" required>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Risk Appetite</label>\n        <input type=\"text\" name=\"riskAppetite\" [(ngModel)]=\"editForm.riskAppetite\">\n      </div>\n      <div class=\"apex-form-row apex-form-row--full\">\n        <label>Policy Description</label>\n        <textarea name=\"policyDescription\" rows=\"2\" [(ngModel)]=\"editForm.policyDescription\"></textarea>\n      </div>\n      <div class=\"apex-form-row\">\n        <label class=\"uw-check-label\">\n          <input type=\"checkbox\" name=\"renewalWarning\" [(ngModel)]=\"editForm.renewalWarning\">\n          Renewal Warning\n        </label>\n      </div>\n      <div class=\"apex-form-row\">\n        <label class=\"uw-check-label\">\n          <input type=\"checkbox\" name=\"isNonRenewable\" [(ngModel)]=\"editForm.isNonRenewable\">\n          Non Renewable\n        </label>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Principal UW</label>\n        <input type=\"text\" name=\"principalUw\" [(ngModel)]=\"editForm.principalUw\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Sub Stat1</label>\n        <input type=\"text\" name=\"subStat1\" [(ngModel)]=\"editForm.subStat1\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Sub Stat2</label>\n        <input type=\"text\" name=\"subStat2\" [(ngModel)]=\"editForm.subStat2\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>E-trading Platform</label>\n        <input type=\"text\" name=\"etradingPlatform\" [(ngModel)]=\"editForm.etradingPlatform\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>LIC Secondee</label>\n        <input type=\"text\" name=\"licSecondee\" [(ngModel)]=\"editForm.licSecondee\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>ESG Status</label>\n        <select name=\"esgStatus\" [(ngModel)]=\"editForm.esgStatus\">\n          <option value=\"\">—</option>\n          <option value=\"Not Assessed\">Not Assessed</option>\n          <option value=\"Exposed\">Exposed</option>\n          <option value=\"Not Exposed\">Not Exposed</option>\n          <option value=\"Transitioning\">Transitioning</option>\n        </select>\n      </div>\n      <div class=\"apex-form-row apex-form-row--full\" *ngIf=\"editForm.esgStatus === 'Exposed'\">\n        <div class=\"uw-esg-help\">\n          <strong>ESG Exposed</strong> — risk has material ESG exposure (e.g. fossil fuels, thermal coal, arctic drilling).\n          Confirm sector screening and any transition plan before binding.\n        </div>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Notes Type</label>\n        <select name=\"notesType\" [(ngModel)]=\"editForm.notesType\">\n          <option value=\"UWTR\">UWTR - Underwriter</option>\n          <option value=\"OPS\">OPS - Operations</option>\n          <option value=\"CSR\">CSR</option>\n        </select>\n      </div>\n      <div class=\"apex-form-row apex-form-row--full\">\n        <label>Notes</label>\n        <textarea name=\"notes\" rows=\"3\" [(ngModel)]=\"editForm.notes\"></textarea>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Est Signing</label>\n        <input type=\"number\" step=\"0.01\" name=\"estSigning\" [(ngModel)]=\"editForm.estSigning\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Ded X/S</label>\n        <input type=\"number\" step=\"0.01\" name=\"dedXs\" [(ngModel)]=\"editForm.dedXs\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Prem/Rate</label>\n        <input type=\"number\" step=\"0.0001\" name=\"premRate\" [(ngModel)]=\"editForm.premRate\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Risk Change</label>\n        <input type=\"number\" step=\"0.01\" name=\"riskChange\" [(ngModel)]=\"editForm.riskChange\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>T&amp;C Change</label>\n        <input type=\"number\" step=\"0.01\" name=\"tcChange\" [(ngModel)]=\"editForm.tcChange\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Other Change</label>\n        <input type=\"number\" step=\"0.01\" name=\"otherChange\" [(ngModel)]=\"editForm.otherChange\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Modelled LR</label>\n        <input type=\"number\" step=\"0.01\" name=\"modelledLr\" [(ngModel)]=\"editForm.modelledLr\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Long Term Loss Ratio</label>\n        <input type=\"number\" step=\"0.01\" name=\"longTermLossRatio\" [(ngModel)]=\"editForm.longTermLossRatio\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Rate Adequacy</label>\n        <input type=\"number\" step=\"0.01\" name=\"rateAdequacy\" [(ngModel)]=\"editForm.rateAdequacy\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Technical Index</label>\n        <input type=\"number\" step=\"0.01\" name=\"technicalIndex\" [(ngModel)]=\"editForm.technicalIndex\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label class=\"uw-check-label\">\n          <input type=\"checkbox\" name=\"facilityFlag\" [(ngModel)]=\"editForm.facilityFlag\">\n          Facility\n        </label>\n      </div>\n      <div class=\"apex-form-row\">\n        <label class=\"uw-check-label\">\n          <input type=\"checkbox\" name=\"lbsFlag\" [(ngModel)]=\"editForm.lbsFlag\">\n          LBS\n        </label>\n      </div>\n      <div class=\"apex-form-row\">\n        <label class=\"uw-check-label\">\n          <input type=\"checkbox\" name=\"licFlag\" [(ngModel)]=\"editForm.licFlag\">\n          LIC\n        </label>\n      </div>\n    </div>\n    <div class=\"uw-modal__footer\">\n      <button type=\"button\" class=\"apex-btn apex-btn--ghost\" (click)=\"closeEditModal()\" [disabled]=\"editSaving\">Cancel</button>\n      <button type=\"submit\" class=\"apex-btn apex-btn--primary\" [disabled]=\"editSaving\">\n        {{ editSaving ? 'Submitting…' : 'Submit' }}\n      </button>\n    </div>\n  </form>\n</div>\n");

/***/ }),

/***/ "./src/app/features/case-hub/case-hub-list.component.css":
/*!***************************************************************!*\
  !*** ./src/app/features/case-hub/case-hub-list.component.css ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (":host {\n  display: block;\n}\n\n.uw-list-toolbar {\n  background: #fff;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  padding: 12px 14px;\n  margin-bottom: 10px;\n}\n\n.uw-list-toolbar__row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px 16px;\n  align-items: flex-end;\n}\n\n.uw-list-field {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  min-width: 0;\n  flex: 0 0 160px;\n}\n\n.uw-list-field label {\n  font-size: 11px;\n  font-weight: 700;\n  color: var(--apex-text-muted, #5B5B5B);\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n}\n\n.uw-list-field__spacer {\n  visibility: hidden;\n  height: 14px;\n}\n\n.uw-list-field--search {\n  flex: 1 1 220px;\n  min-width: 180px;\n  max-width: 360px;\n}\n\n.uw-list-field--actions {\n  flex: 0 0 auto;\n}\n\n.uw-list-field input,\n.uw-list-field select {\n  width: 100%;\n  height: 32px;\n  padding: 0 10px;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  border-radius: 2px;\n  font-size: 13px;\n  background: #fff;\n}\n\n.uw-list-actions {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n}\n\n.uw-list-meta {\n  display: flex;\n  justify-content: space-between;\n  gap: 12px;\n  flex-wrap: wrap;\n  font-size: 12px;\n  margin-bottom: 6px;\n}\n\n.uw-list-grid {\n  width: 100%;\n  height: calc(100vh - 280px);\n  min-height: 420px;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  background: #fff;\n}\n\n.uw-list-grid.ag-theme-alpine {\n  --ag-font-family: \"Segoe UI\", Arial, Helvetica, sans-serif;\n  --ag-font-size: 12px;\n  --ag-header-background-color: #EEF2F6;\n  --ag-header-foreground-color: #0B1F33;\n  --ag-border-color: var(--apex-border, #C8C8C8);\n  --ag-row-hover-color: #FFF3F3;\n  --ag-selected-row-background-color: #FFE8E8;\n  --ag-alpine-active-color: #C62828;\n}\n\n:host ::ng-deep .uw-list-grid .apex-table__link {\n  color: #1565C0;\n  font-weight: 600;\n  cursor: pointer;\n}\n\n:host ::ng-deep .uw-list-grid .ag-header-cell-filtered {\n  background: #FFE8E8;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZmVhdHVyZXMvY2FzZS1odWIvY2FzZS1odWItbGlzdC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsY0FBYztBQUNoQjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQiw2Q0FBNkM7RUFDN0Msa0JBQWtCO0VBQ2xCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixlQUFlO0VBQ2YsY0FBYztFQUNkLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsUUFBUTtFQUNSLFlBQVk7RUFDWixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixzQ0FBc0M7RUFDdEMseUJBQXlCO0VBQ3pCLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsZ0JBQWdCO0VBQ2hCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7O0VBRUUsV0FBVztFQUNYLFlBQVk7RUFDWixlQUFlO0VBQ2YsNkNBQTZDO0VBQzdDLGtCQUFrQjtFQUNsQixlQUFlO0VBQ2YsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLGVBQWU7RUFDZixRQUFRO0FBQ1Y7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsOEJBQThCO0VBQzlCLFNBQVM7RUFDVCxlQUFlO0VBQ2YsZUFBZTtFQUNmLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLFdBQVc7RUFDWCwyQkFBMkI7RUFDM0IsaUJBQWlCO0VBQ2pCLDZDQUE2QztFQUM3QyxnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSwwREFBMEQ7RUFDMUQsb0JBQW9CO0VBQ3BCLHFDQUFxQztFQUNyQyxxQ0FBcUM7RUFDckMsOENBQThDO0VBQzlDLDZCQUE2QjtFQUM3QiwyQ0FBMkM7RUFDM0MsaUNBQWlDO0FBQ25DOztBQUVBO0VBQ0UsY0FBYztFQUNkLGdCQUFnQjtFQUNoQixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsbUJBQW1CO0FBQ3JCIiwiZmlsZSI6InNyYy9hcHAvZmVhdHVyZXMvY2FzZS1odWIvY2FzZS1odWItbGlzdC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLnV3LWxpc3QtdG9vbGJhciB7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWFwZXgtYm9yZGVyLCAjQzhDOEM4KTtcbiAgcGFkZGluZzogMTJweCAxNHB4O1xuICBtYXJnaW4tYm90dG9tOiAxMHB4O1xufVxuXG4udXctbGlzdC10b29sYmFyX19yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGdhcDogMTJweCAxNnB4O1xuICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG59XG5cbi51dy1saXN0LWZpZWxkIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiA0cHg7XG4gIG1pbi13aWR0aDogMDtcbiAgZmxleDogMCAwIDE2MHB4O1xufVxuXG4udXctbGlzdC1maWVsZCBsYWJlbCB7XG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgY29sb3I6IHZhcigtLWFwZXgtdGV4dC1tdXRlZCwgIzVCNUI1Qik7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGxldHRlci1zcGFjaW5nOiAwLjA0ZW07XG59XG5cbi51dy1saXN0LWZpZWxkX19zcGFjZXIge1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIGhlaWdodDogMTRweDtcbn1cblxuLnV3LWxpc3QtZmllbGQtLXNlYXJjaCB7XG4gIGZsZXg6IDEgMSAyMjBweDtcbiAgbWluLXdpZHRoOiAxODBweDtcbiAgbWF4LXdpZHRoOiAzNjBweDtcbn1cblxuLnV3LWxpc3QtZmllbGQtLWFjdGlvbnMge1xuICBmbGV4OiAwIDAgYXV0bztcbn1cblxuLnV3LWxpc3QtZmllbGQgaW5wdXQsXG4udXctbGlzdC1maWVsZCBzZWxlY3Qge1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAzMnB4O1xuICBwYWRkaW5nOiAwIDEwcHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWFwZXgtYm9yZGVyLCAjQzhDOEM4KTtcbiAgYm9yZGVyLXJhZGl1czogMnB4O1xuICBmb250LXNpemU6IDEzcHg7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG59XG5cbi51dy1saXN0LWFjdGlvbnMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGdhcDogNnB4O1xufVxuXG4udXctbGlzdC1tZXRhIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBnYXA6IDEycHg7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBtYXJnaW4tYm90dG9tOiA2cHg7XG59XG5cbi51dy1saXN0LWdyaWQge1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiBjYWxjKDEwMHZoIC0gMjgwcHgpO1xuICBtaW4taGVpZ2h0OiA0MjBweDtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYXBleC1ib3JkZXIsICNDOEM4QzgpO1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xufVxuXG4udXctbGlzdC1ncmlkLmFnLXRoZW1lLWFscGluZSB7XG4gIC0tYWctZm9udC1mYW1pbHk6IFwiU2Vnb2UgVUlcIiwgQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcbiAgLS1hZy1mb250LXNpemU6IDEycHg7XG4gIC0tYWctaGVhZGVyLWJhY2tncm91bmQtY29sb3I6ICNFRUYyRjY7XG4gIC0tYWctaGVhZGVyLWZvcmVncm91bmQtY29sb3I6ICMwQjFGMzM7XG4gIC0tYWctYm9yZGVyLWNvbG9yOiB2YXIoLS1hcGV4LWJvcmRlciwgI0M4QzhDOCk7XG4gIC0tYWctcm93LWhvdmVyLWNvbG9yOiAjRkZGM0YzO1xuICAtLWFnLXNlbGVjdGVkLXJvdy1iYWNrZ3JvdW5kLWNvbG9yOiAjRkZFOEU4O1xuICAtLWFnLWFscGluZS1hY3RpdmUtY29sb3I6ICNDNjI4Mjg7XG59XG5cbjpob3N0IDo6bmctZGVlcCAudXctbGlzdC1ncmlkIC5hcGV4LXRhYmxlX19saW5rIHtcbiAgY29sb3I6ICMxNTY1QzA7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuOmhvc3QgOjpuZy1kZWVwIC51dy1saXN0LWdyaWQgLmFnLWhlYWRlci1jZWxsLWZpbHRlcmVkIHtcbiAgYmFja2dyb3VuZDogI0ZGRThFODtcbn1cbiJdfQ== */");

/***/ }),

/***/ "./src/app/features/case-hub/case-hub-list.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/features/case-hub/case-hub-list.component.ts ***!
  \**************************************************************/
/*! exports provided: CaseHubListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CaseHubListComponent", function() { return CaseHubListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _case_hub_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./case-hub.service */ "./src/app/features/case-hub/case-hub.service.ts");
/* harmony import */ var _core_models__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/models */ "./src/app/core/models.ts");





let CaseHubListComponent = class CaseHubListComponent {
    constructor(caseHubService, router) {
        this.caseHubService = caseHubService;
        this.router = router;
        this.loading = true;
        this.error = null;
        this.result = null;
        this.filteredCount = 0;
        this.pageSize = 25;
        this.filters = {
            status: '',
            lineOfBusiness: '',
            search: ''
        };
        this.statusOptions = ['Received', 'Triaged', 'Quoted', 'Referred', 'Bound', 'Declined', 'NotTakenUp'];
        this.lobOptions = _core_models__WEBPACK_IMPORTED_MODULE_4__["LOB_OPTIONS"];
        this.gridApi = null;
    }
    ngOnInit() {
        this.load();
    }
    ngOnDestroy() {
        this.destroyGrid();
    }
    load() {
        this.loading = true;
        this.error = null;
        this.destroyGrid();
        this.caseHubService.listSubmissions({
            status: this.filters.status || undefined,
            lineOfBusiness: this.filters.lineOfBusiness || undefined,
            search: this.filters.search || undefined,
            page: 1,
            pageSize: 200
        }).subscribe((result) => {
            this.result = result;
            this.filteredCount = (result && result.items && result.items.length) || 0;
            this.loading = false;
            setTimeout(() => this.ensureGrid(), 0);
        }, (err) => {
            this.error = err.message;
            this.result = null;
            this.filteredCount = 0;
            this.loading = false;
        });
    }
    get submissions() {
        return (this.result && this.result.items) || [];
    }
    get totalCount() {
        return (this.result && this.result.totalCount) || 0;
    }
    clearFilters() {
        this.filters = { status: '', lineOfBusiness: '', search: '' };
        this.load();
    }
    clearColumnFilters() {
        if (this.gridApi) {
            this.gridApi.setFilterModel(null);
            this.updateFilteredCount();
        }
    }
    openCase(submission) {
        this.router.navigate(['/case-hub', submission.id]);
    }
    updateFilteredCount() {
        if (!this.gridApi) {
            this.filteredCount = this.submissions.length;
            return;
        }
        let count = 0;
        this.gridApi.forEachNodeAfterFilter(() => { count += 1; });
        this.filteredCount = count;
    }
    textFilter() {
        return {
            filter: 'agTextColumnFilter',
            filterParams: {
                filterOptions: [
                    'contains', 'notContains', 'equals', 'notEqual',
                    'startsWith', 'endsWith', 'blank', 'notBlank'
                ],
                defaultOption: 'contains',
                buttons: ['apply', 'reset'],
                closeOnApply: true
            }
        };
    }
    dateFilter() {
        return {
            filter: 'agDateColumnFilter',
            filterParams: {
                filterOptions: [
                    'equals', 'notEqual', 'lessThan', 'greaterThan',
                    'inRange', 'blank', 'notBlank'
                ],
                defaultOption: 'equals',
                buttons: ['apply', 'reset'],
                closeOnApply: true,
                comparator: (filterLocalDateAtMidnight, cellValue) => {
                    if (!cellValue) {
                        return -1;
                    }
                    const cell = new Date(cellValue);
                    cell.setHours(0, 0, 0, 0);
                    if (cell.getTime() === filterLocalDateAtMidnight.getTime()) {
                        return 0;
                    }
                    return cell < filterLocalDateAtMidnight ? -1 : 1;
                }
            }
        };
    }
    dateFormatter(params) {
        if (!params.value) {
            return '—';
        }
        const d = new Date(params.value);
        if (isNaN(d.getTime())) {
            return '—';
        }
        const dd = ('0' + d.getDate()).slice(-2);
        const mm = ('0' + (d.getMonth() + 1)).slice(-2);
        return dd + '/' + mm + '/' + d.getFullYear();
    }
    buildColumnDefs() {
        return [
            Object.assign({
                colId: 'submissionNumber', headerName: 'Submission #', field: 'submissionNumber',
                width: 140, cellClass: 'apex-table__link'
            }, this.textFilter()),
            Object.assign({
                colId: 'insuredName', headerName: 'Insured', field: 'insuredName',
                minWidth: 160, flex: 1
            }, this.textFilter()),
            Object.assign({
                colId: 'brokerName', headerName: 'Broker', field: 'brokerName', width: 150
            }, this.textFilter()),
            Object.assign({
                colId: 'lineOfBusiness', headerName: 'LOB', field: 'lineOfBusiness', width: 130
            }, this.textFilter()),
            Object.assign({
                colId: 'status', headerName: 'Status', field: 'status', width: 120
            }, this.textFilter()),
            Object.assign({
                colId: 'underwriterName', headerName: 'Underwriter', field: 'underwriterName',
                width: 140,
                valueGetter: (p) => (p.data && p.data.underwriterName) || 'Unassigned'
            }, this.textFilter()),
            Object.assign({
                colId: 'receivedDate', headerName: 'Received', field: 'receivedDate',
                width: 120, valueFormatter: (p) => this.dateFormatter(p)
            }, this.dateFilter()),
            Object.assign({
                colId: 'dueDate', headerName: 'Due', field: 'dueDate',
                width: 120, valueFormatter: (p) => this.dateFormatter(p)
            }, this.dateFilter())
        ];
    }
    ensureGrid() {
        const el = document.getElementById('apex-uwf-list-grid');
        if (!el || typeof agGrid === 'undefined') {
            return;
        }
        if (this.gridApi) {
            this.gridApi.setGridOption('rowData', this.submissions);
            this.updateFilteredCount();
            return;
        }
        const options = {
            columnDefs: this.buildColumnDefs(),
            rowData: this.submissions,
            defaultColDef: {
                sortable: true,
                resizable: true,
                floatingFilter: true,
                filter: true
            },
            animateRows: true,
            rowSelection: 'single',
            suppressCellFocus: true,
            pagination: true,
            paginationPageSize: this.pageSize || 25,
            paginationPageSizeSelector: [10, 25, 50, 100],
            popupParent: document.body,
            onGridReady: (e) => {
                this.gridApi = e.api;
                this.updateFilteredCount();
            },
            onFilterChanged: () => this.updateFilteredCount(),
            onPaginationChanged: () => {
                if (this.gridApi) {
                    this.pageSize = this.gridApi.paginationGetPageSize();
                }
            },
            onRowClicked: (e) => {
                if (e && e.data) {
                    this.openCase(e.data);
                }
            }
        };
        if (typeof agGrid.createGrid === 'function') {
            this.gridApi = agGrid.createGrid(el, options);
        }
        else {
            new agGrid.Grid(el, options);
        }
    }
    destroyGrid() {
        if (this.gridApi && typeof this.gridApi.destroy === 'function') {
            this.gridApi.destroy();
        }
        this.gridApi = null;
    }
};
CaseHubListComponent.ctorParameters = () => [
    { type: _case_hub_service__WEBPACK_IMPORTED_MODULE_3__["CaseHubService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }
];
CaseHubListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'apex-case-hub-list',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./case-hub-list.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/features/case-hub/case-hub-list.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./case-hub-list.component.css */ "./src/app/features/case-hub/case-hub-list.component.css")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_case_hub_service__WEBPACK_IMPORTED_MODULE_3__["CaseHubService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
], CaseHubListComponent);



/***/ }),

/***/ "./src/app/features/case-hub/case-hub-routing.module.ts":
/*!**************************************************************!*\
  !*** ./src/app/features/case-hub/case-hub-routing.module.ts ***!
  \**************************************************************/
/*! exports provided: CaseHubRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CaseHubRoutingModule", function() { return CaseHubRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _case_hub_list_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./case-hub-list.component */ "./src/app/features/case-hub/case-hub-list.component.ts");
/* harmony import */ var _case_hub_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./case-hub.component */ "./src/app/features/case-hub/case-hub.component.ts");





const routes = [
    { path: '', component: _case_hub_list_component__WEBPACK_IMPORTED_MODULE_3__["CaseHubListComponent"] },
    { path: ':id', component: _case_hub_component__WEBPACK_IMPORTED_MODULE_4__["CaseHubComponent"] }
];
let CaseHubRoutingModule = class CaseHubRoutingModule {
};
CaseHubRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })
], CaseHubRoutingModule);



/***/ }),

/***/ "./src/app/features/case-hub/case-hub.component.css":
/*!**********************************************************!*\
  !*** ./src/app/features/case-hub/case-hub.component.css ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (":host { display: block; }\n\n.uw-layout {\n  display: flex;\n  gap: 0;\n  min-height: calc(100vh - 140px);\n  border: 1px solid #c8c8c8;\n  background: #fff;\n  overflow: hidden;\n}\n\n.uw-rail {\n  width: 168px;\n  flex: 0 0 168px;\n  background: #f4f4f4;\n  border-right: 1px solid #c8c8c8;\n  display: flex;\n  flex-direction: column;\n  padding: 8px 0;\n  overflow-y: auto;\n  max-height: calc(100vh - 140px);\n}\n\n.uw-rail button {\n  border: 0;\n  background: transparent;\n  text-align: left;\n  padding: 10px 12px;\n  font-size: 12px;\n  cursor: pointer;\n  color: #333;\n}\n\n.uw-rail button.active {\n  background: #C62828;\n  color: #fff;\n  font-weight: 700;\n  position: relative;\n}\n\n.uw-rail button.active::after {\n  content: '';\n  position: absolute;\n  right: -8px;\n  top: 50%;\n  margin-top: -8px;\n  border: 8px solid transparent;\n  border-left-color: #C62828;\n}\n\n.uw-main {\n  flex: 1;\n  min-width: 0;\n  padding: 0 0 16px;\n  overflow-x: auto;\n  overflow-y: auto;\n  max-height: calc(100vh - 140px);\n}\n\n.uw-header {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 12px;\n  padding: 10px 12px;\n  border-bottom: 1px solid #ddd;\n}\n\n.uw-header__identity {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 8px;\n}\n\n.uw-account {\n  font-size: 15px;\n}\n\n.uw-meta {\n  display: block;\n  width: 100%;\n  font-size: 12px;\n  color: #666;\n  margin-top: 2px;\n}\n\n.uw-toolbar { display: flex; flex-wrap: wrap; gap: 4px; justify-content: flex-end; }\n\n.uw-subhead {\n  margin: 8px 0 6px;\n  font-size: 12px;\n  font-weight: 700;\n  color: #444;\n  text-transform: uppercase;\n  letter-spacing: 0.02em;\n}\n\n.uw-subhead:first-child { margin-top: 0; }\n\n.uw-empty-row {\n  text-align: center;\n  color: #888;\n  font-style: italic;\n  padding: 12px 6px !important;\n}\n\n.apex-card--flat {\n  border-radius: 0;\n  box-shadow: none;\n  border-left: 0;\n  border-right: 0;\n  margin: 0;\n}\n\n.apex-kv--dense {\n  display: grid;\n  grid-template-columns: 140px 1fr 140px 1fr;\n  gap: 4px 12px;\n  font-size: 12px;\n}\n\n.apex-kv--dense dt { color: #666; font-weight: 600; }\n\n.apex-kv--dense dd { margin: 0; }\n\n.apex-row--selected td { background: #FFF3F3; }\n\n.apex-panel-red {\n  background: #C62828;\n  color: #fff;\n  padding: 8px 12px;\n  font-weight: 700;\n  font-size: 13px;\n}\n\n.apex-table--dense th,\n.apex-table--dense td {\n  padding: 4px 6px;\n  font-size: 11.5px;\n}\n\n.apex-mb-16 { margin-bottom: 16px; }\n\n.apex-mt-16 { margin-top: 16px; }\n\n.apex-form-row--full {\n  grid-column: 1 / -1;\n}\n\n.uw-check-label {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-weight: 600;\n  margin-top: 22px;\n}\n\n.uw-modal-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background: rgba(0, 0, 0, 0.45);\n  z-index: 1000;\n}\n\n.uw-section-layout {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n  align-items: flex-start;\n}\n\n.uw-section-layout .apex-kv--dense {\n  flex: 1 1 420px;\n  min-width: 0;\n}\n\n.uw-kpi-strip {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  padding: 8px 12px;\n}\n\n.uw-section-layout > .uw-kpi-strip {\n  flex: 0 1 280px;\n}\n\n.uw-kpi-strip__item {\n  border: 1px solid #c8c8c8;\n  background: #fafafa;\n  padding: 6px 10px;\n  min-width: 88px;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.uw-kpi-strip__item--total {\n  background: #FFF3F3;\n  border-color: #C62828;\n  font-weight: 700;\n}\n\n.uw-kpi-strip__label {\n  font-size: 10px;\n  text-transform: uppercase;\n  letter-spacing: 0.03em;\n  color: #666;\n}\n\n.uw-kpi-strip__value {\n  font-size: 13px;\n  color: #222;\n}\n\n.uw-perf-filters {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 16px;\n  margin-bottom: 12px;\n  font-size: 12px;\n}\n\n.uw-perf-filters select {\n  margin-left: 6px;\n}\n\n.uw-roe-note {\n  color: #666;\n  font-style: italic;\n}\n\n.uw-docs-layout {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n  padding: 0 12px 12px;\n}\n\n.uw-docs-folders {\n  flex: 1 1 280px;\n  min-width: 0;\n}\n\n.uw-docs-folder {\n  margin-bottom: 12px;\n  border: 1px solid #ddd;\n}\n\n.uw-docs-folder__title {\n  background: #f4f4f4;\n  padding: 6px 10px;\n  font-size: 12px;\n  font-weight: 700;\n  border-bottom: 1px solid #ddd;\n}\n\n.uw-docs-folder__list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n.uw-docs-folder__list li {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 4px 8px;\n  border-bottom: 1px solid #eee;\n  font-size: 12px;\n}\n\n.uw-docs-folder__item--active {\n  background: #FFF3F3;\n}\n\n.uw-docs-file {\n  border: 0;\n  background: transparent;\n  text-align: left;\n  cursor: pointer;\n  color: #1565C0;\n  padding: 2px 0;\n  font-size: 12px;\n}\n\n.uw-docs-preview {\n  flex: 1 1 360px;\n  min-width: 0;\n  border: 1px solid #ddd;\n  padding: 8px;\n}\n\n.uw-docs-preview__header {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  align-items: baseline;\n  margin-bottom: 8px;\n  font-size: 12px;\n}\n\n.uw-docs-preview__frame {\n  width: 100%;\n  height: 420px;\n  border: 1px solid #ccc;\n  background: #f9f9f9;\n}\n\n.uw-esg-help {\n  background: #FFF8E1;\n  border: 1px solid #F9A825;\n  padding: 10px 12px;\n  font-size: 12px;\n  line-height: 1.4;\n}\n\n.uw-modal {\n  position: fixed;\n  z-index: 1001;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: min(900px, calc(100vw - 32px));\n  max-height: calc(100vh - 48px);\n  overflow: auto;\n  background: #fff;\n  border: 1px solid #c8c8c8;\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);\n  padding: 16px;\n}\n\n.uw-modal__header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 12px;\n  margin-bottom: 8px;\n}\n\n.uw-modal__header h2 {\n  margin: 0;\n  font-size: 16px;\n}\n\n.uw-modal__hint {\n  margin: 0 0 12px;\n  font-size: 12px;\n  color: #666;\n}\n\n.uw-modal__footer {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n  margin-top: 16px;\n  padding-top: 12px;\n  border-top: 1px solid #eee;\n}\n\n@media (max-width: 900px) {\n  .uw-layout { flex-direction: column; }\n  .uw-rail {\n    width: 100%;\n    flex: none;\n    flex-direction: row;\n    flex-wrap: wrap;\n    border-right: 0;\n    border-bottom: 1px solid #c8c8c8;\n  }\n  .uw-rail button.active::after { display: none; }\n  .apex-kv--dense {\n    grid-template-columns: 120px 1fr;\n  }\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZmVhdHVyZXMvY2FzZS1odWIvY2FzZS1odWIuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxRQUFRLGNBQWMsRUFBRTs7QUFFeEI7RUFDRSxhQUFhO0VBQ2IsTUFBTTtFQUNOLCtCQUErQjtFQUMvQix5QkFBeUI7RUFDekIsZ0JBQWdCO0VBQ2hCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLFlBQVk7RUFDWixlQUFlO0VBQ2YsbUJBQW1CO0VBQ25CLCtCQUErQjtFQUMvQixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLGNBQWM7RUFDZCxnQkFBZ0I7RUFDaEIsK0JBQStCO0FBQ2pDOztBQUVBO0VBQ0UsU0FBUztFQUNULHVCQUF1QjtFQUN2QixnQkFBZ0I7RUFDaEIsa0JBQWtCO0VBQ2xCLGVBQWU7RUFDZixlQUFlO0VBQ2YsV0FBVztBQUNiOztBQUVBO0VBQ0UsbUJBQW1CO0VBQ25CLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsV0FBVztFQUNYLGtCQUFrQjtFQUNsQixXQUFXO0VBQ1gsUUFBUTtFQUNSLGdCQUFnQjtFQUNoQiw2QkFBNkI7RUFDN0IsMEJBQTBCO0FBQzVCOztBQUVBO0VBQ0UsT0FBTztFQUNQLFlBQVk7RUFDWixpQkFBaUI7RUFDakIsZ0JBQWdCO0VBQ2hCLGdCQUFnQjtFQUNoQiwrQkFBK0I7QUFDakM7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsZUFBZTtFQUNmLDhCQUE4QjtFQUM5Qix1QkFBdUI7RUFDdkIsU0FBUztFQUNULGtCQUFrQjtFQUNsQiw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsZUFBZTtFQUNmLG1CQUFtQjtFQUNuQixRQUFRO0FBQ1Y7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsY0FBYztFQUNkLFdBQVc7RUFDWCxlQUFlO0VBQ2YsV0FBVztFQUNYLGVBQWU7QUFDakI7O0FBRUEsY0FBYyxhQUFhLEVBQUUsZUFBZSxFQUFFLFFBQVEsRUFBRSx5QkFBeUIsRUFBRTs7QUFFbkY7RUFDRSxpQkFBaUI7RUFDakIsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixXQUFXO0VBQ1gseUJBQXlCO0VBQ3pCLHNCQUFzQjtBQUN4Qjs7QUFFQSwwQkFBMEIsYUFBYSxFQUFFOztBQUV6QztFQUNFLGtCQUFrQjtFQUNsQixXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLDRCQUE0QjtBQUM5Qjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixnQkFBZ0I7RUFDaEIsY0FBYztFQUNkLGVBQWU7RUFDZixTQUFTO0FBQ1g7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsMENBQTBDO0VBQzFDLGFBQWE7RUFDYixlQUFlO0FBQ2pCOztBQUVBLHFCQUFxQixXQUFXLEVBQUUsZ0JBQWdCLEVBQUU7O0FBQ3BELHFCQUFxQixTQUFTLEVBQUU7O0FBRWhDLHlCQUF5QixtQkFBbUIsRUFBRTs7QUFFOUM7RUFDRSxtQkFBbUI7RUFDbkIsV0FBVztFQUNYLGlCQUFpQjtFQUNqQixnQkFBZ0I7RUFDaEIsZUFBZTtBQUNqQjs7QUFFQTs7RUFFRSxnQkFBZ0I7RUFDaEIsaUJBQWlCO0FBQ25COztBQUVBLGNBQWMsbUJBQW1CLEVBQUU7O0FBQ25DLGNBQWMsZ0JBQWdCLEVBQUU7O0FBRWhDO0VBQ0UsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixRQUFRO0VBQ1IsZ0JBQWdCO0VBQ2hCLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLGVBQWU7RUFDZixNQUFNO0VBQ04sUUFBUTtFQUNSLFNBQVM7RUFDVCxPQUFPO0VBQ1AsK0JBQStCO0VBQy9CLGFBQWE7QUFDZjs7QUFFQTtFQUNFLGFBQWE7RUFDYixlQUFlO0VBQ2YsU0FBUztFQUNULHVCQUF1QjtBQUN6Qjs7QUFFQTtFQUNFLGVBQWU7RUFDZixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsZUFBZTtFQUNmLFFBQVE7RUFDUixpQkFBaUI7QUFDbkI7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UseUJBQXlCO0VBQ3pCLG1CQUFtQjtFQUNuQixpQkFBaUI7RUFDakIsZUFBZTtFQUNmLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsUUFBUTtBQUNWOztBQUVBO0VBQ0UsbUJBQW1CO0VBQ25CLHFCQUFxQjtFQUNyQixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YseUJBQXlCO0VBQ3pCLHNCQUFzQjtFQUN0QixXQUFXO0FBQ2I7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsV0FBVztBQUNiOztBQUVBO0VBQ0UsYUFBYTtFQUNiLGVBQWU7RUFDZixtQkFBbUI7RUFDbkIsU0FBUztFQUNULG1CQUFtQjtFQUNuQixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsV0FBVztFQUNYLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixlQUFlO0VBQ2YsU0FBUztFQUNULG9CQUFvQjtBQUN0Qjs7QUFFQTtFQUNFLGVBQWU7RUFDZixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxtQkFBbUI7RUFDbkIsc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsbUJBQW1CO0VBQ25CLGlCQUFpQjtFQUNqQixlQUFlO0VBQ2YsZ0JBQWdCO0VBQ2hCLDZCQUE2QjtBQUMvQjs7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQixTQUFTO0VBQ1QsVUFBVTtBQUNaOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQiw4QkFBOEI7RUFDOUIsUUFBUTtFQUNSLGdCQUFnQjtFQUNoQiw2QkFBNkI7RUFDN0IsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLFNBQVM7RUFDVCx1QkFBdUI7RUFDdkIsZ0JBQWdCO0VBQ2hCLGVBQWU7RUFDZixjQUFjO0VBQ2QsY0FBYztFQUNkLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsWUFBWTtFQUNaLHNCQUFzQjtFQUN0QixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsZUFBZTtFQUNmLFFBQVE7RUFDUixxQkFBcUI7RUFDckIsa0JBQWtCO0VBQ2xCLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxtQkFBbUI7RUFDbkIseUJBQXlCO0VBQ3pCLGtCQUFrQjtFQUNsQixlQUFlO0VBQ2YsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLGFBQWE7RUFDYixRQUFRO0VBQ1IsU0FBUztFQUNULGdDQUFnQztFQUNoQyxxQ0FBcUM7RUFDckMsOEJBQThCO0VBQzlCLGNBQWM7RUFDZCxnQkFBZ0I7RUFDaEIseUJBQXlCO0VBQ3pCLHlDQUF5QztFQUN6QyxhQUFhO0FBQ2Y7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsOEJBQThCO0VBQzlCLHVCQUF1QjtFQUN2QixTQUFTO0VBQ1Qsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsU0FBUztFQUNULGVBQWU7QUFDakI7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsZUFBZTtFQUNmLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGFBQWE7RUFDYix5QkFBeUI7RUFDekIsUUFBUTtFQUNSLGdCQUFnQjtFQUNoQixpQkFBaUI7RUFDakIsMEJBQTBCO0FBQzVCOztBQUVBO0VBQ0UsYUFBYSxzQkFBc0IsRUFBRTtFQUNyQztJQUNFLFdBQVc7SUFDWCxVQUFVO0lBQ1YsbUJBQW1CO0lBQ25CLGVBQWU7SUFDZixlQUFlO0lBQ2YsZ0NBQWdDO0VBQ2xDO0VBQ0EsZ0NBQWdDLGFBQWEsRUFBRTtFQUMvQztJQUNFLGdDQUFnQztFQUNsQztBQUNGIiwiZmlsZSI6InNyYy9hcHAvZmVhdHVyZXMvY2FzZS1odWIvY2FzZS1odWIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHsgZGlzcGxheTogYmxvY2s7IH1cblxuLnV3LWxheW91dCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogMDtcbiAgbWluLWhlaWdodDogY2FsYygxMDB2aCAtIDE0MHB4KTtcbiAgYm9yZGVyOiAxcHggc29saWQgI2M4YzhjODtcbiAgYmFja2dyb3VuZDogI2ZmZjtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuLnV3LXJhaWwge1xuICB3aWR0aDogMTY4cHg7XG4gIGZsZXg6IDAgMCAxNjhweDtcbiAgYmFja2dyb3VuZDogI2Y0ZjRmNDtcbiAgYm9yZGVyLXJpZ2h0OiAxcHggc29saWQgI2M4YzhjODtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgcGFkZGluZzogOHB4IDA7XG4gIG92ZXJmbG93LXk6IGF1dG87XG4gIG1heC1oZWlnaHQ6IGNhbGMoMTAwdmggLSAxNDBweCk7XG59XG5cbi51dy1yYWlsIGJ1dHRvbiB7XG4gIGJvcmRlcjogMDtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIHBhZGRpbmc6IDEwcHggMTJweDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGNvbG9yOiAjMzMzO1xufVxuXG4udXctcmFpbCBidXR0b24uYWN0aXZlIHtcbiAgYmFja2dyb3VuZDogI0M2MjgyODtcbiAgY29sb3I6ICNmZmY7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbn1cblxuLnV3LXJhaWwgYnV0dG9uLmFjdGl2ZTo6YWZ0ZXIge1xuICBjb250ZW50OiAnJztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogLThweDtcbiAgdG9wOiA1MCU7XG4gIG1hcmdpbi10b3A6IC04cHg7XG4gIGJvcmRlcjogOHB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBib3JkZXItbGVmdC1jb2xvcjogI0M2MjgyODtcbn1cblxuLnV3LW1haW4ge1xuICBmbGV4OiAxO1xuICBtaW4td2lkdGg6IDA7XG4gIHBhZGRpbmc6IDAgMCAxNnB4O1xuICBvdmVyZmxvdy14OiBhdXRvO1xuICBvdmVyZmxvdy15OiBhdXRvO1xuICBtYXgtaGVpZ2h0OiBjYWxjKDEwMHZoIC0gMTQwcHgpO1xufVxuXG4udXctaGVhZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBnYXA6IDEycHg7XG4gIHBhZGRpbmc6IDEwcHggMTJweDtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XG59XG5cbi51dy1oZWFkZXJfX2lkZW50aXR5IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDhweDtcbn1cblxuLnV3LWFjY291bnQge1xuICBmb250LXNpemU6IDE1cHg7XG59XG5cbi51dy1tZXRhIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBmb250LXNpemU6IDEycHg7XG4gIGNvbG9yOiAjNjY2O1xuICBtYXJnaW4tdG9wOiAycHg7XG59XG5cbi51dy10b29sYmFyIHsgZGlzcGxheTogZmxleDsgZmxleC13cmFwOiB3cmFwOyBnYXA6IDRweDsganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDsgfVxuXG4udXctc3ViaGVhZCB7XG4gIG1hcmdpbjogOHB4IDAgNnB4O1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGNvbG9yOiAjNDQ0O1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBsZXR0ZXItc3BhY2luZzogMC4wMmVtO1xufVxuXG4udXctc3ViaGVhZDpmaXJzdC1jaGlsZCB7IG1hcmdpbi10b3A6IDA7IH1cblxuLnV3LWVtcHR5LXJvdyB7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6ICM4ODg7XG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgcGFkZGluZzogMTJweCA2cHggIWltcG9ydGFudDtcbn1cblxuLmFwZXgtY2FyZC0tZmxhdCB7XG4gIGJvcmRlci1yYWRpdXM6IDA7XG4gIGJveC1zaGFkb3c6IG5vbmU7XG4gIGJvcmRlci1sZWZ0OiAwO1xuICBib3JkZXItcmlnaHQ6IDA7XG4gIG1hcmdpbjogMDtcbn1cblxuLmFwZXgta3YtLWRlbnNlIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxNDBweCAxZnIgMTQwcHggMWZyO1xuICBnYXA6IDRweCAxMnB4O1xuICBmb250LXNpemU6IDEycHg7XG59XG5cbi5hcGV4LWt2LS1kZW5zZSBkdCB7IGNvbG9yOiAjNjY2OyBmb250LXdlaWdodDogNjAwOyB9XG4uYXBleC1rdi0tZGVuc2UgZGQgeyBtYXJnaW46IDA7IH1cblxuLmFwZXgtcm93LS1zZWxlY3RlZCB0ZCB7IGJhY2tncm91bmQ6ICNGRkYzRjM7IH1cblxuLmFwZXgtcGFuZWwtcmVkIHtcbiAgYmFja2dyb3VuZDogI0M2MjgyODtcbiAgY29sb3I6ICNmZmY7XG4gIHBhZGRpbmc6IDhweCAxMnB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBmb250LXNpemU6IDEzcHg7XG59XG5cbi5hcGV4LXRhYmxlLS1kZW5zZSB0aCxcbi5hcGV4LXRhYmxlLS1kZW5zZSB0ZCB7XG4gIHBhZGRpbmc6IDRweCA2cHg7XG4gIGZvbnQtc2l6ZTogMTEuNXB4O1xufVxuXG4uYXBleC1tYi0xNiB7IG1hcmdpbi1ib3R0b206IDE2cHg7IH1cbi5hcGV4LW10LTE2IHsgbWFyZ2luLXRvcDogMTZweDsgfVxuXG4uYXBleC1mb3JtLXJvdy0tZnVsbCB7XG4gIGdyaWQtY29sdW1uOiAxIC8gLTE7XG59XG5cbi51dy1jaGVjay1sYWJlbCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogOHB4O1xuICBmb250LXdlaWdodDogNjAwO1xuICBtYXJnaW4tdG9wOiAyMnB4O1xufVxuXG4udXctbW9kYWwtYmFja2Ryb3Age1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgbGVmdDogMDtcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjQ1KTtcbiAgei1pbmRleDogMTAwMDtcbn1cblxuLnV3LXNlY3Rpb24tbGF5b3V0IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC13cmFwOiB3cmFwO1xuICBnYXA6IDE2cHg7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xufVxuXG4udXctc2VjdGlvbi1sYXlvdXQgLmFwZXgta3YtLWRlbnNlIHtcbiAgZmxleDogMSAxIDQyMHB4O1xuICBtaW4td2lkdGg6IDA7XG59XG5cbi51dy1rcGktc3RyaXAge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGdhcDogOHB4O1xuICBwYWRkaW5nOiA4cHggMTJweDtcbn1cblxuLnV3LXNlY3Rpb24tbGF5b3V0ID4gLnV3LWtwaS1zdHJpcCB7XG4gIGZsZXg6IDAgMSAyODBweDtcbn1cblxuLnV3LWtwaS1zdHJpcF9faXRlbSB7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNjOGM4Yzg7XG4gIGJhY2tncm91bmQ6ICNmYWZhZmE7XG4gIHBhZGRpbmc6IDZweCAxMHB4O1xuICBtaW4td2lkdGg6IDg4cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGdhcDogMnB4O1xufVxuXG4udXcta3BpLXN0cmlwX19pdGVtLS10b3RhbCB7XG4gIGJhY2tncm91bmQ6ICNGRkYzRjM7XG4gIGJvcmRlci1jb2xvcjogI0M2MjgyODtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbn1cblxuLnV3LWtwaS1zdHJpcF9fbGFiZWwge1xuICBmb250LXNpemU6IDEwcHg7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGxldHRlci1zcGFjaW5nOiAwLjAzZW07XG4gIGNvbG9yOiAjNjY2O1xufVxuXG4udXcta3BpLXN0cmlwX192YWx1ZSB7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgY29sb3I6ICMyMjI7XG59XG5cbi51dy1wZXJmLWZpbHRlcnMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMTZweDtcbiAgbWFyZ2luLWJvdHRvbTogMTJweDtcbiAgZm9udC1zaXplOiAxMnB4O1xufVxuXG4udXctcGVyZi1maWx0ZXJzIHNlbGVjdCB7XG4gIG1hcmdpbi1sZWZ0OiA2cHg7XG59XG5cbi51dy1yb2Utbm90ZSB7XG4gIGNvbG9yOiAjNjY2O1xuICBmb250LXN0eWxlOiBpdGFsaWM7XG59XG5cbi51dy1kb2NzLWxheW91dCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgZ2FwOiAxNnB4O1xuICBwYWRkaW5nOiAwIDEycHggMTJweDtcbn1cblxuLnV3LWRvY3MtZm9sZGVycyB7XG4gIGZsZXg6IDEgMSAyODBweDtcbiAgbWluLXdpZHRoOiAwO1xufVxuXG4udXctZG9jcy1mb2xkZXIge1xuICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xufVxuXG4udXctZG9jcy1mb2xkZXJfX3RpdGxlIHtcbiAgYmFja2dyb3VuZDogI2Y0ZjRmNDtcbiAgcGFkZGluZzogNnB4IDEwcHg7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XG59XG5cbi51dy1kb2NzLWZvbGRlcl9fbGlzdCB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbn1cblxuLnV3LWRvY3MtZm9sZGVyX19saXN0IGxpIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBnYXA6IDhweDtcbiAgcGFkZGluZzogNHB4IDhweDtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNlZWU7XG4gIGZvbnQtc2l6ZTogMTJweDtcbn1cblxuLnV3LWRvY3MtZm9sZGVyX19pdGVtLS1hY3RpdmUge1xuICBiYWNrZ3JvdW5kOiAjRkZGM0YzO1xufVxuXG4udXctZG9jcy1maWxlIHtcbiAgYm9yZGVyOiAwO1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBjb2xvcjogIzE1NjVDMDtcbiAgcGFkZGluZzogMnB4IDA7XG4gIGZvbnQtc2l6ZTogMTJweDtcbn1cblxuLnV3LWRvY3MtcHJldmlldyB7XG4gIGZsZXg6IDEgMSAzNjBweDtcbiAgbWluLXdpZHRoOiAwO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICBwYWRkaW5nOiA4cHg7XG59XG5cbi51dy1kb2NzLXByZXZpZXdfX2hlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgZ2FwOiA4cHg7XG4gIGFsaWduLWl0ZW1zOiBiYXNlbGluZTtcbiAgbWFyZ2luLWJvdHRvbTogOHB4O1xuICBmb250LXNpemU6IDEycHg7XG59XG5cbi51dy1kb2NzLXByZXZpZXdfX2ZyYW1lIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogNDIwcHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG4gIGJhY2tncm91bmQ6ICNmOWY5Zjk7XG59XG5cbi51dy1lc2ctaGVscCB7XG4gIGJhY2tncm91bmQ6ICNGRkY4RTE7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNGOUE4MjU7XG4gIHBhZGRpbmc6IDEwcHggMTJweDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBsaW5lLWhlaWdodDogMS40O1xufVxuXG4udXctbW9kYWwge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHotaW5kZXg6IDEwMDE7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICB3aWR0aDogbWluKDkwMHB4LCBjYWxjKDEwMHZ3IC0gMzJweCkpO1xuICBtYXgtaGVpZ2h0OiBjYWxjKDEwMHZoIC0gNDhweCk7XG4gIG92ZXJmbG93OiBhdXRvO1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBib3JkZXI6IDFweCBzb2xpZCAjYzhjOGM4O1xuICBib3gtc2hhZG93OiAwIDhweCAyNHB4IHJnYmEoMCwgMCwgMCwgMC4yKTtcbiAgcGFkZGluZzogMTZweDtcbn1cblxuLnV3LW1vZGFsX19oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBnYXA6IDEycHg7XG4gIG1hcmdpbi1ib3R0b206IDhweDtcbn1cblxuLnV3LW1vZGFsX19oZWFkZXIgaDIge1xuICBtYXJnaW46IDA7XG4gIGZvbnQtc2l6ZTogMTZweDtcbn1cblxuLnV3LW1vZGFsX19oaW50IHtcbiAgbWFyZ2luOiAwIDAgMTJweDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBjb2xvcjogIzY2Njtcbn1cblxuLnV3LW1vZGFsX19mb290ZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICBnYXA6IDhweDtcbiAgbWFyZ2luLXRvcDogMTZweDtcbiAgcGFkZGluZy10b3A6IDEycHg7XG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCAjZWVlO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogOTAwcHgpIHtcbiAgLnV3LWxheW91dCB7IGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47IH1cbiAgLnV3LXJhaWwge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGZsZXg6IG5vbmU7XG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICBmbGV4LXdyYXA6IHdyYXA7XG4gICAgYm9yZGVyLXJpZ2h0OiAwO1xuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjYzhjOGM4O1xuICB9XG4gIC51dy1yYWlsIGJ1dHRvbi5hY3RpdmU6OmFmdGVyIHsgZGlzcGxheTogbm9uZTsgfVxuICAuYXBleC1rdi0tZGVuc2Uge1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMTIwcHggMWZyO1xuICB9XG59XG4iXX0= */");

/***/ }),

/***/ "./src/app/features/case-hub/case-hub.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/features/case-hub/case-hub.component.ts ***!
  \*********************************************************/
/*! exports provided: CaseHubComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CaseHubComponent", function() { return CaseHubComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm2015/platform-browser.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _case_hub_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./case-hub.service */ "./src/app/features/case-hub/case-hub.service.ts");
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../core/auth.service */ "./src/app/core/auth.service.ts");






let CaseHubComponent = class CaseHubComponent {
    constructor(route, caseHubService, sanitizer, auth) {
        this.route = route;
        this.caseHubService = caseHubService;
        this.sanitizer = sanitizer;
        this.auth = auth;
        this.loading = true;
        this.error = null;
        this.notFound = false;
        this.file = null;
        this.selectedSection = null;
        this.nav = 'policy';
        this.riskTab = 'summary';
        this.sectionTab = 'summary';
        this.performanceCcy = 'GBP';
        this.riskAnswers = [];
        this.riskSaving = false;
        this.riskError = null;
        this.quoteDraft = {
            sumInsured: 1000000,
            limitOfIndemnity: 1000000,
            deductible: 1000,
            commissionPercent: 15
        };
        this.showQuoteForm = false;
        this.quoteCreating = false;
        this.quoteBusyId = null;
        this.quotesError = null;
        this.showEditModal = false;
        this.editSaving = false;
        this.editError = null;
        this.editForm = this.emptyEditForm();
        this.previewDocId = null;
    }
    ngOnInit() {
        this.submissionId = Number(this.route.snapshot.paramMap.get('id'));
        this.reload();
    }
    get uwReference() {
        if (!this.file) {
            return String(this.submissionId);
        }
        return this.file.uwReference || this.file.submissionNumber || String(this.submissionId);
    }
    /** Document types as simple folders + files for the Documents pane. */
    get documentFolders() {
        const docs = (this.file && this.file.documents) || [];
        const map = {};
        for (let i = 0; i < docs.length; i++) {
            const d = docs[i];
            const t = d.documentType || 'Other';
            if (!map[t]) {
                map[t] = [];
            }
            map[t].push(d);
        }
        return Object.keys(map).sort().map(type => ({ type: type, docs: map[type] }));
    }
    get previewDoc() {
        if (this.previewDocId == null || !this.file || !this.file.documents) {
            return null;
        }
        return this.file.documents.find((d) => d.id === this.previewDocId) || null;
    }
    /** Claim KPI strip values from first claim (or nulls when none). */
    get claimKpis() {
        const claims = (this.file && this.file.claims) || [];
        const c = claims.length ? claims[0] : null;
        if (!c) {
            return { ilr: null, cap: null, apexShareNp: null, exposure: null };
        }
        return {
            ilr: c.ilr,
            cap: c.cap,
            apexShareNp: c.apexShareNp,
            exposure: c.exposure != null ? c.exposure : this.file.sumInsured
        };
    }
    reload() {
        this.loading = true;
        this.error = null;
        this.notFound = false;
        this.caseHubService.getUnderwriterFile(this.submissionId).subscribe((file) => {
            const prevQuoteId = this.selectedSection && this.selectedSection.quoteId;
            this.file = file;
            if (prevQuoteId && file.sections) {
                this.selectedSection = file.sections.find((s) => s.quoteId === prevQuoteId) || file.sections[0] || null;
            }
            else {
                this.selectedSection = (file.sections && file.sections[0]) || null;
            }
            this.loading = false;
            this.caseHubService.getRiskAnswers(this.submissionId).subscribe((answers) => { this.riskAnswers = answers || []; }, () => { this.riskAnswers = []; });
        }, (err) => {
            this.loading = false;
            if (err.status === 404) {
                this.notFound = true;
            }
            else {
                this.error = err.message;
            }
        });
    }
    setNav(nav) { this.nav = nav; }
    setRiskTab(tab) { this.riskTab = tab; }
    setSectionTab(tab) { this.sectionTab = tab; }
    selectSection(section) {
        this.selectedSection = section;
        this.nav = 'policy';
        this.riskTab = 'summary';
        this.sectionTab = 'summary';
    }
    shellDocumentsUrl() {
        return this.auth.shellUrl('/documents?submissionId=' + this.submissionId);
    }
    modellingUrl() {
        return '/ng8/modelling?submissionId=' + this.submissionId;
    }
    taskInboxUrl() {
        return this.auth.shellUrl('/inbox?submissionId=' + this.submissionId);
    }
    openBoxUrl() {
        return this.auth.shellUrl('/openbox');
    }
    filteredPerformanceRows(rows) {
        if (!rows || !rows.length) {
            return [];
        }
        if (!this.performanceCcy) {
            return rows;
        }
        return rows.filter((r) => !r.ccy || r.ccy === this.performanceCcy);
    }
    activityDetailUrl(a) {
        if (!a || a.relatedEntityId == null) {
            return null;
        }
        if (!this.isTaskLikeActivity(a)) {
            return null;
        }
        return this.auth.shellUrl('/tasks/' + a.relatedEntityId);
    }
    isTaskLikeActivity(a) {
        if (!a) {
            return false;
        }
        const t = String(a.activityType || '').toLowerCase();
        return t.indexOf('task') >= 0
            || t === 'modelling'
            || t === 'second sight'
            || t === 'front sheet'
            || t === 'line slip'
            || t === 'referral'
            || t === 'wording'
            || t === 'data entry';
    }
    previewDocument(doc) {
        this.previewDocId = doc ? doc.id : null;
    }
    isPdfDoc(doc) {
        if (!doc) {
            return false;
        }
        const ct = String(doc.contentType || '').toLowerCase();
        const name = String(doc.fileName || '').toLowerCase();
        return ct.indexOf('pdf') >= 0 || name.endsWith('.pdf');
    }
    openEditModal() {
        this.editError = null;
        const s = this.selectedSection;
        this.editForm = {
            riskStatus: this.file.status || '',
            brokerContact: this.file.brokerContact || '',
            inception: this.toDateInput(this.file.policyEffectiveDate || this.file.requestedEffectiveDate),
            expiry: this.toDateInput(this.file.policyExpiryDate),
            riskAppetite: this.file.riskAppetite || '',
            renewalWarning: !!this.file.renewalWarning,
            policyDescription: this.file.policyDescription || '',
            isNonRenewable: !!this.file.isNonRenewable,
            principalUw: (s && s.uwPrincipal) || this.file.underwriterName || '',
            subStat1: (s && s.subStat1) || '',
            subStat2: (s && s.subStat2) || '',
            etradingPlatform: (s && s.etradingPlatform) || '',
            licSecondee: (s && s.licSecondee) || '',
            esgStatus: this.file.esgStatus || '',
            notesType: this.file.notesType || 'UWTR',
            notes: this.file.notes || '',
            estSigning: s && s.estSigning != null ? s.estSigning : null,
            dedXs: s && s.dedXs != null ? s.dedXs : (s && s.deductible != null ? s.deductible : null),
            premRate: s && s.premRate != null ? s.premRate : null,
            riskChange: s && s.riskChange != null ? s.riskChange : null,
            tcChange: s && s.tcChange != null ? s.tcChange : null,
            otherChange: s && s.otherChange != null ? s.otherChange : null,
            modelledLr: s && s.modelledLr != null ? s.modelledLr : null,
            facilityFlag: !!(s && s.facility),
            lbsFlag: !!(s && s.lbs),
            licFlag: !!(s && s.lic),
            longTermLossRatio: this.file.longTermLossRatio != null ? this.file.longTermLossRatio : null,
            rateAdequacy: this.file.rateAdequacy != null ? this.file.rateAdequacy : null,
            technicalIndex: s && s.technicalIndex != null ? s.technicalIndex : null
        };
        this.showEditModal = true;
    }
    closeEditModal() {
        if (this.editSaving) {
            return;
        }
        this.showEditModal = false;
        this.editError = null;
    }
    submitEdit() {
        this.editSaving = true;
        this.editError = null;
        const body = {
            riskStatus: this.editForm.riskStatus,
            brokerContact: this.editForm.brokerContact,
            inception: this.editForm.inception || undefined,
            expiry: this.editForm.expiry || undefined,
            riskAppetite: this.editForm.riskAppetite,
            renewalWarning: !!this.editForm.renewalWarning,
            policyDescription: this.editForm.policyDescription,
            isNonRenewable: !!this.editForm.isNonRenewable,
            principalUw: this.editForm.principalUw,
            subStat1: this.editForm.subStat1,
            subStat2: this.editForm.subStat2,
            etradingPlatform: this.editForm.etradingPlatform,
            licSecondee: this.editForm.licSecondee,
            esgStatus: this.editForm.esgStatus,
            notesType: this.editForm.notesType,
            notes: this.editForm.notes,
            estSigning: this.toOptionalNumber(this.editForm.estSigning),
            dedXs: this.toOptionalNumber(this.editForm.dedXs),
            premRate: this.toOptionalNumber(this.editForm.premRate),
            riskChange: this.toOptionalNumber(this.editForm.riskChange),
            tcChange: this.toOptionalNumber(this.editForm.tcChange),
            otherChange: this.toOptionalNumber(this.editForm.otherChange),
            modelledLr: this.toOptionalNumber(this.editForm.modelledLr),
            facilityFlag: !!this.editForm.facilityFlag,
            lbsFlag: !!this.editForm.lbsFlag,
            licFlag: !!this.editForm.licFlag,
            longTermLossRatio: this.toOptionalNumber(this.editForm.longTermLossRatio),
            rateAdequacy: this.toOptionalNumber(this.editForm.rateAdequacy),
            technicalIndex: this.toOptionalNumber(this.editForm.technicalIndex)
        };
        this.caseHubService.editUnderwriting(this.submissionId, body).subscribe(() => {
            this.editSaving = false;
            this.showEditModal = false;
            this.reload();
        }, (err) => {
            this.editError = err.message;
            this.editSaving = false;
        });
    }
    addRiskAnswer() {
        this.riskAnswers = [...this.riskAnswers, { questionCode: '', questionText: '', answerText: '' }];
    }
    removeRiskAnswer(index) {
        this.riskAnswers = this.riskAnswers.filter((_, i) => i !== index);
    }
    saveRiskAnswers() {
        this.riskSaving = true;
        this.riskError = null;
        this.caseHubService.saveRiskAnswers(this.submissionId, this.riskAnswers).subscribe((answers) => { this.riskAnswers = answers || []; this.riskSaving = false; }, (err) => { this.riskError = err.message; this.riskSaving = false; });
    }
    toggleQuoteForm() {
        this.showQuoteForm = !this.showQuoteForm;
        this.quotesError = null;
    }
    createQuote() {
        this.quoteCreating = true;
        this.quotesError = null;
        this.caseHubService.createQuote({
            submissionId: this.submissionId,
            sumInsured: Number(this.quoteDraft.sumInsured),
            limitOfIndemnity: Number(this.quoteDraft.limitOfIndemnity),
            deductible: Number(this.quoteDraft.deductible) || 0,
            commissionPercent: Number(this.quoteDraft.commissionPercent) || 0
        }).subscribe(() => {
            this.quoteCreating = false;
            this.showQuoteForm = false;
            this.reload();
            this.riskTab = 'quotes';
        }, (err) => { this.quotesError = err.message; this.quoteCreating = false; });
    }
    canBind(section) {
        if (!section) {
            return false;
        }
        if (!section.isReferralRequired) {
            return true;
        }
        return section.referralDecision === 'Approved' || section.referralDecision === 2;
    }
    selectQuote(section) {
        this.quoteBusyId = section.quoteId;
        this.caseHubService.selectQuote(section.quoteId).subscribe(() => { this.quoteBusyId = null; this.reload(); }, (err) => { this.quotesError = err.message; this.quoteBusyId = null; });
    }
    bindQuote(section) {
        this.quoteBusyId = section.quoteId;
        this.caseHubService.bindQuote(section.quoteId).subscribe((_policy) => { this.quoteBusyId = null; this.reload(); }, (err) => { this.quotesError = err.message; this.quoteBusyId = null; });
    }
    downloadDocument(doc) {
        window.open(this.caseHubService.downloadUrl(doc.id), '_blank');
    }
    documentDownloadUrl(doc) {
        return this.caseHubService.downloadUrl(doc.id);
    }
    documentPreviewUrl(doc) {
        if (!doc || !this.isPdfDoc(doc)) {
            return null;
        }
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.caseHubService.downloadUrl(doc.id));
    }
    emptyEditForm() {
        return {
            riskStatus: '',
            brokerContact: '',
            inception: '',
            expiry: '',
            riskAppetite: '',
            renewalWarning: false,
            policyDescription: '',
            isNonRenewable: false,
            principalUw: '',
            subStat1: '',
            subStat2: '',
            etradingPlatform: '',
            licSecondee: '',
            esgStatus: '',
            notesType: 'UWTR',
            notes: '',
            estSigning: null,
            dedXs: null,
            premRate: null,
            riskChange: null,
            tcChange: null,
            otherChange: null,
            modelledLr: null,
            facilityFlag: false,
            lbsFlag: false,
            licFlag: false,
            longTermLossRatio: null,
            rateAdequacy: null,
            technicalIndex: null
        };
    }
    toDateInput(value) {
        if (!value) {
            return '';
        }
        const d = value instanceof Date ? value : new Date(value);
        if (isNaN(d.getTime())) {
            return '';
        }
        const yyyy = d.getFullYear();
        const mm = ('0' + (d.getMonth() + 1)).slice(-2);
        const dd = ('0' + d.getDate()).slice(-2);
        return yyyy + '-' + mm + '-' + dd;
    }
    toOptionalNumber(value) {
        if (value === null || value === undefined || value === '') {
            return null;
        }
        const n = Number(value);
        return isNaN(n) ? null : n;
    }
};
CaseHubComponent.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"] },
    { type: _case_hub_service__WEBPACK_IMPORTED_MODULE_4__["CaseHubService"] },
    { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["DomSanitizer"] },
    { type: _core_auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"] }
];
CaseHubComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'apex-case-hub',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./case-hub.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/features/case-hub/case-hub.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./case-hub.component.css */ "./src/app/features/case-hub/case-hub.component.css")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"],
        _case_hub_service__WEBPACK_IMPORTED_MODULE_4__["CaseHubService"],
        _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["DomSanitizer"],
        _core_auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"]])
], CaseHubComponent);



/***/ }),

/***/ "./src/app/features/case-hub/case-hub.module.ts":
/*!******************************************************!*\
  !*** ./src/app/features/case-hub/case-hub.module.ts ***!
  \******************************************************/
/*! exports provided: CaseHubModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CaseHubModule", function() { return CaseHubModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _case_hub_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./case-hub-routing.module */ "./src/app/features/case-hub/case-hub-routing.module.ts");
/* harmony import */ var _case_hub_list_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./case-hub-list.component */ "./src/app/features/case-hub/case-hub-list.component.ts");
/* harmony import */ var _case_hub_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./case-hub.component */ "./src/app/features/case-hub/case-hub.component.ts");






let CaseHubModule = class CaseHubModule {
};
CaseHubModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [_case_hub_list_component__WEBPACK_IMPORTED_MODULE_4__["CaseHubListComponent"], _case_hub_component__WEBPACK_IMPORTED_MODULE_5__["CaseHubComponent"]],
        imports: [_shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"], _case_hub_routing_module__WEBPACK_IMPORTED_MODULE_3__["CaseHubRoutingModule"]]
    })
], CaseHubModule);



/***/ }),

/***/ "./src/app/features/case-hub/case-hub.service.ts":
/*!*******************************************************!*\
  !*** ./src/app/features/case-hub/case-hub.service.ts ***!
  \*******************************************************/
/*! exports provided: CaseHubService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CaseHubService", function() { return CaseHubService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _core_api_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/api.service */ "./src/app/core/api.service.ts");
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../core/auth.service */ "./src/app/core/auth.service.ts");






let CaseHubService = class CaseHubService {
    constructor(api, auth) {
        this.api = api;
        this.auth = auth;
    }
    listSubmissions(filters) {
        return this.api.get('/submissions', filters);
    }
    getSubmission(id) {
        return this.api.get(`/submissions/${id}`);
    }
    getUnderwriterFile(submissionId) {
        return this.api.get(`/underwriter-file/${submissionId}`);
    }
    /** POST allowed UW edit fields through Open Box write path. */
    editUnderwriting(submissionId, body) {
        return this.api.post(`/underwriter-file/${submissionId}/edit`, body);
    }
    getRiskAnswers(submissionId) {
        return this.api.get(`/submissions/${submissionId}/risk-answers`);
    }
    saveRiskAnswers(submissionId, answers) {
        return this.api.put(`/submissions/${submissionId}/risk-answers`, { answers });
    }
    getQuotes(submissionId) {
        return this.api.get(`/quotes/by-submission/${submissionId}`);
    }
    createQuote(body) {
        return this.api.post('/quotes', body);
    }
    selectQuote(quoteId) {
        return this.api.put(`/quotes/${quoteId}/select`);
    }
    bindQuote(quoteId) {
        return this.api.post('/policies/bind', { quoteId });
    }
    /**
     * There's no `GET /policies?submissionId=` filter on the API (PolicyDto has a
     * submissionId field, but PoliciesController.List doesn't expose it as a query
     * param), so this pulls a generous page of policies and filters client-side.
     * Tolerates failure (e.g. no bound policy yet) by resolving to an empty array.
     */
    findPolicyForSubmission(submissionId) {
        return this.api.get('/policies', { pageSize: 500 }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(result => {
            const items = (result && result.items) || [];
            return items.find(p => String(p.submissionId) === String(submissionId)) || null;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(() => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(null)));
    }
    getPolicy(id) {
        return this.api.get(`/policies/${id}`);
    }
    getClaimsForPolicy(policyId) {
        return this.api.get('/claims', { policyId }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(() => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])([])));
    }
    getDocuments(kind, id) {
        const path = kind === 'submission' ? `/documents/by-submission/${id}`
            : kind === 'policy' ? `/documents/by-policy/${id}`
                : `/documents/by-claim/${id}`;
        return this.api.get(path).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(() => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])([])));
    }
    /** Audit is restricted to Admin/UnderwritingManager on the API; callers should tolerate a 403. */
    getAudit(entityName, entityId) {
        return this.api.get('/audit/logs', { entityName, entityId });
    }
    downloadUrl(documentId) {
        const base = `${this.api.baseUrl}/documents/${documentId}/download`;
        const token = this.auth.getToken();
        return token ? `${base}?access_token=${encodeURIComponent(token)}` : base;
    }
};
CaseHubService.ctorParameters = () => [
    { type: _core_api_service__WEBPACK_IMPORTED_MODULE_4__["ApiService"] },
    { type: _core_auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"] }
];
CaseHubService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_core_api_service__WEBPACK_IMPORTED_MODULE_4__["ApiService"], _core_auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"]])
], CaseHubService);



/***/ })

}]);
//# sourceMappingURL=features-case-hub-case-hub-module.js.map