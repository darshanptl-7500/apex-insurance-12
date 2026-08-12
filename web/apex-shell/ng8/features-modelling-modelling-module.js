(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["features-modelling-modelling-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/features/modelling/modelling.component.html":
/*!***************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/features/modelling/modelling.component.html ***!
  \***************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"apex-page-header\">\n  <div class=\"apex-page-header__title\">\n    <h1>Pricing</h1>\n    <div class=\"apex-page-header__subtitle\">\n      UW Pricing portal · risk modelling entry · technical rate view\n    </div>\n  </div>\n  <div class=\"apex-page-header__actions\">\n    <button type=\"button\" class=\"apex-btn apex-btn--danger apex-btn--sm\" (click)=\"openPricing()\">\n      Open Pricing portal ↗\n    </button>\n    <button type=\"button\" class=\"apex-btn apex-btn--ghost apex-btn--sm\" (click)=\"toggleEmbed()\">\n      {{ embedOpen ? 'Hide embed' : 'Embed portal' }}\n    </button>\n    <button type=\"button\" class=\"apex-btn apex-btn--ghost apex-btn--sm\" [disabled]=\"loading\" (click)=\"load()\">\n      {{ loading ? 'Refreshing…' : 'Refresh' }}\n    </button>\n  </div>\n</div>\n\n<!-- External Pricing (UI-SPEC: deep-link / embed) -->\n<div class=\"pricing-portal-card\">\n  <div class=\"pricing-portal-card__copy\">\n    <strong>External Pricing</strong>\n    <p>\n      UW Pricing is hosted outside the workbench. Launch the portal for full rating /\n      catastrophe modelling, or embed it below for side-by-side review with the UW File.\n    </p>\n    <code class=\"pricing-portal-card__url\">{{ pricingUrl }}</code>\n  </div>\n  <div class=\"pricing-portal-card__actions\">\n    <button type=\"button\" class=\"apex-btn apex-btn--primary apex-btn--sm\" (click)=\"openPricing()\">Launch</button>\n  </div>\n</div>\n\n<div class=\"pricing-embed\" *ngIf=\"embedOpen\">\n  <div class=\"pricing-embed__chrome\">\n    <span>Pricing portal (demo embed)</span>\n    <a [href]=\"pricingUrl\" target=\"_blank\" rel=\"noopener\">Open in new tab</a>\n  </div>\n  <iframe class=\"pricing-embed__frame\" [src]=\"embedUrl\" title=\"UW Pricing portal\"></iframe>\n  <p class=\"pricing-embed__note\">\n    Demo host may block iframe embedding — use <em>Open Pricing portal</em> if the frame stays blank.\n  </p>\n</div>\n\n<!-- Risk-scoped modelling (UW File → Model) -->\n<div class=\"apex-card pricing-risk\" *ngIf=\"submissionId\">\n  <div class=\"apex-card__header\">\n    <h3>Risk modelling — {{ accountName || ('Submission #' + submissionId) }}</h3>\n    <div class=\"pricing-risk__actions\">\n      <a class=\"apex-btn apex-btn--sm\" [href]=\"uwFileUrl\">Underwriter's File</a>\n      <button type=\"button\" class=\"apex-btn apex-btn--danger apex-btn--sm\" (click)=\"openPricing()\">\n        Model in Pricing ↗\n      </button>\n    </div>\n  </div>\n\n  <apex-loading *ngIf=\"riskLoading\" label=\"Loading risk pricing context…\"></apex-loading>\n  <div class=\"apex-alert apex-alert--danger\" *ngIf=\"riskError && !riskLoading\">{{ riskError }}</div>\n\n  <ng-container *ngIf=\"file && !riskLoading\">\n    <div class=\"pricing-risk__meta\">\n      <div class=\"apex-kv\"><dt>UW Reference</dt><dd class=\"apex-mono\">{{ reference || '—' }}</dd></div>\n      <div class=\"apex-kv\"><dt>Status</dt><dd>{{ file.status || '—' }}</dd></div>\n      <div class=\"apex-kv\"><dt>LOB</dt><dd>{{ file.lineOfBusiness || '—' }}</dd></div>\n      <div class=\"apex-kv\"><dt>Broker</dt><dd>{{ file.brokerName || '—' }}</dd></div>\n      <div class=\"apex-kv\"><dt>Inception</dt><dd>{{ file.inception || file.requestedEffectiveDate || '—' }}</dd></div>\n      <div class=\"apex-kv\"><dt>YOA</dt><dd>{{ file.yoa || '—' }}</dd></div>\n    </div>\n\n    <h4 class=\"pricing-section-title\">Technical pricing (section grid)</h4>\n    <p class=\"apex-text-muted pricing-hint\">\n      Aligns to UW technical fields: Prem/Rate, Modelled LR, Technical Index, Rate Adequacy, Facility / LBS / LIC.\n    </p>\n\n    <apex-empty-state *ngIf=\"!sections.length\"\n                       title=\"No sections\"\n                       message=\"Open the Underwriter's File to add sections before modelling.\"></apex-empty-state>\n\n    <div class=\"apex-table-wrap\" *ngIf=\"sections.length\">\n      <table class=\"apex-table apex-table--dense\">\n        <thead>\n        <tr>\n          <th>Section / UW Ref</th>\n          <th>Limit</th>\n          <th>Ded / XS</th>\n          <th>Prem / Rate</th>\n          <th>Gross</th>\n          <th>Net</th>\n          <th>Technical Index</th>\n          <th>Modelled LR</th>\n          <th>Rate Adequacy</th>\n          <th>LTLR</th>\n          <th>Flags</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr *ngFor=\"let s of sections\">\n          <td class=\"apex-mono\">{{ s.uwReference || s.sectionName || s.id }}</td>\n          <td>{{ money(s.limit || s.limitOfIndemnity) }}</td>\n          <td>{{ money(s.dedXs || s.deductible) }}</td>\n          <td>{{ s.premRate != null ? s.premRate : '—' }}</td>\n          <td>{{ money(s.grossPremium || s.gross) }}</td>\n          <td>{{ money(s.netPremium || s.net) }}</td>\n          <td>{{ s.technicalIndex != null ? s.technicalIndex : '—' }}</td>\n          <td>{{ pct(s.modelledLr) }}</td>\n          <td>{{ pct(s.rateAdequacy) }}</td>\n          <td>{{ pct(s.longTermLossRatio) }}</td>\n          <td>\n            <span class=\"apex-chip\" *ngIf=\"s.facilityFlag\">FAC</span>\n            <span class=\"apex-chip\" *ngIf=\"s.lbsFlag\">LBS</span>\n            <span class=\"apex-chip\" *ngIf=\"s.licFlag\">LIC</span>\n            <span *ngIf=\"!s.facilityFlag && !s.lbsFlag && !s.licFlag\">—</span>\n          </td>\n        </tr>\n        </tbody>\n      </table>\n    </div>\n  </ng-container>\n</div>\n\n<div class=\"apex-alert apex-alert--info\" *ngIf=\"!submissionId\">\n  Open <strong>Model</strong> from an Underwriter's File to load risk-scoped technical pricing here,\n  or launch the external Pricing portal above.\n</div>\n\n<!-- Modelling task queue -->\n<div class=\"apex-card\">\n  <div class=\"apex-card__header\">\n    <h3>Modelling / Second Sight queue</h3>\n    <button type=\"button\" class=\"apex-btn apex-btn--ghost apex-btn--sm\" (click)=\"loadTasks()\" [disabled]=\"tasksLoading\">\n      {{ tasksLoading ? 'Loading…' : 'Refresh' }}\n    </button>\n  </div>\n  <apex-empty-state *ngIf=\"!tasksLoading && tasks.length === 0\"\n                     title=\"No open modelling tasks\"\n                     message=\"Upload docs with Modelling / Second Sight spawn, or create tasks from the UW File.\"></apex-empty-state>\n  <div class=\"apex-table-wrap\" *ngIf=\"tasks.length\">\n    <table class=\"apex-table apex-table--dense\">\n      <thead>\n      <tr>\n        <th>Task</th><th>Type</th><th>Risk</th><th>Account</th><th>Assigned</th><th>Due</th><th></th>\n      </tr>\n      </thead>\n      <tbody>\n      <tr *ngFor=\"let t of tasks\">\n        <td>{{ t.title }}</td>\n        <td>{{ t.taskType || '—' }}</td>\n        <td class=\"apex-mono\">{{ t.submissionNumber || t.submissionId || '—' }}</td>\n        <td>{{ t.insuredName || '—' }}</td>\n        <td>{{ t.assignedToName || '—' }}</td>\n        <td>{{ t.dueDate ? (t.dueDate | date:'dd MMM yyyy') : '—' }}</td>\n        <td>\n          <a class=\"apex-btn apex-btn--sm apex-btn--ghost\" [href]=\"taskUrl(t)\">Open task</a>\n          <a *ngIf=\"t.submissionId\" class=\"apex-btn apex-btn--sm apex-btn--ghost\"\n             [href]=\"'/ng8/modelling?submissionId=' + t.submissionId\">Price</a>\n        </td>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n</div>\n\n<!-- Secondary: portfolio exposure (previous modelling view) -->\n<div class=\"apex-card pricing-portfolio\">\n  <button type=\"button\" class=\"pricing-portfolio__toggle\" (click)=\"togglePortfolio()\">\n    <span>Portfolio exposure (supporting view)</span>\n    <span>{{ showPortfolio ? '▾' : '▸' }}</span>\n  </button>\n\n  <div *ngIf=\"showPortfolio\">\n    <apex-loading *ngIf=\"loading\" label=\"Loading exposure data…\"></apex-loading>\n    <div class=\"apex-alert apex-alert--danger\" *ngIf=\"error && !loading\">{{ error }}</div>\n\n    <ng-container *ngIf=\"!loading && !error\">\n      <div class=\"apex-grid-4\" *ngIf=\"concentration\">\n        <div class=\"apex-kpi\">\n          <div class=\"apex-kpi__label\">Total sum insured</div>\n          <div class=\"apex-kpi__value\">£{{ concentration.totalSumInsured | number:'1.0-0' }}</div>\n        </div>\n        <div class=\"apex-kpi\">\n          <div class=\"apex-kpi__label\">Total gross premium</div>\n          <div class=\"apex-kpi__value\">£{{ concentration.totalGrossPremium | number:'1.0-0' }}</div>\n        </div>\n        <div class=\"apex-kpi\">\n          <div class=\"apex-kpi__label\">Largest single risk</div>\n          <div class=\"apex-kpi__value\">£{{ concentration.largestSingleRiskSumInsured | number:'1.0-0' }}</div>\n          <div class=\"apex-kpi__delta\">{{ concentration.largestRiskPolicyNumber || '—' }}</div>\n        </div>\n        <div class=\"apex-kpi\">\n          <div class=\"apex-kpi__label\">Top LOB share</div>\n          <div class=\"apex-kpi__value\">{{ concentration.topLobSharePercent | number:'1.0-1' }}%</div>\n          <div class=\"apex-kpi__delta\">{{ concentration.topLob || '—' }}</div>\n        </div>\n      </div>\n\n      <div class=\"apex-tabs\">\n        <div class=\"apex-tabs__tab\" *ngFor=\"let g of groupOptions\"\n             [class.active]=\"activeTab === g.value\" (click)=\"setTab(g.value)\">\n          {{ g.label }}\n        </div>\n      </div>\n\n      <apex-empty-state *ngIf=\"activeRows.length === 0\" title=\"No exposure data\"\n                         message=\"No bound policies contribute to this view yet.\"></apex-empty-state>\n\n      <ng-container *ngIf=\"activeRows.length > 0\">\n        <div class=\"apex-bar-chart apex-mb-16\">\n          <div class=\"apex-bar-row\" *ngFor=\"let r of activeRows\">\n            <div class=\"apex-bar-row__label\">{{ r.dimension }}</div>\n            <div class=\"apex-bar-row__track\">\n              <div class=\"apex-bar-row__fill\" [style.width]=\"barWidth(r)\"></div>\n            </div>\n            <div class=\"apex-bar-row__value\">£{{ r.sumInsured | number:'1.0-0' }}</div>\n          </div>\n        </div>\n        <div class=\"apex-table-wrap\">\n          <table class=\"apex-table\">\n            <thead><tr><th>Dimension</th><th>Sum insured</th><th>Gross premium</th><th>Policies</th><th>Share of SI</th></tr></thead>\n            <tbody>\n            <tr *ngFor=\"let r of activeRows\">\n              <td>{{ r.dimension }}</td>\n              <td>£{{ r.sumInsured | number:'1.0-0' }}</td>\n              <td>£{{ r.grossPremium | number:'1.0-0' }}</td>\n              <td>{{ r.policyCount }}</td>\n              <td>{{ concentrationPct(r) | number:'1.0-1' }}%</td>\n            </tr>\n            </tbody>\n          </table>\n        </div>\n      </ng-container>\n    </ng-container>\n  </div>\n</div>\n");

/***/ }),

/***/ "./src/app/features/modelling/modelling-routing.module.ts":
/*!****************************************************************!*\
  !*** ./src/app/features/modelling/modelling-routing.module.ts ***!
  \****************************************************************/
/*! exports provided: ModellingRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModellingRoutingModule", function() { return ModellingRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _modelling_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modelling.component */ "./src/app/features/modelling/modelling.component.ts");




const routes = [
    { path: '', component: _modelling_component__WEBPACK_IMPORTED_MODULE_3__["ModellingComponent"] }
];
let ModellingRoutingModule = class ModellingRoutingModule {
};
ModellingRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })
], ModellingRoutingModule);



/***/ }),

/***/ "./src/app/features/modelling/modelling.component.css":
/*!************************************************************!*\
  !*** ./src/app/features/modelling/modelling.component.css ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (":host {\n  display: block;\n}\n\n.pricing-portal-card {\n  display: flex;\n  gap: 16px;\n  align-items: flex-start;\n  justify-content: space-between;\n  flex-wrap: wrap;\n  background: #fff;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  border-left: 4px solid var(--apex-uw-red, #C62828);\n  padding: 14px 16px;\n  margin-bottom: 12px;\n}\n\n.pricing-portal-card__copy {\n  flex: 1 1 280px;\n  min-width: 0;\n}\n\n.pricing-portal-card__copy p {\n  margin: 6px 0 8px;\n  font-size: 13px;\n  color: var(--apex-text-muted, #5B5B5B);\n}\n\n.pricing-portal-card__url {\n  display: block;\n  font-size: 11px;\n  word-break: break-all;\n  color: #1565C0;\n  background: #F5F7FA;\n  padding: 6px 8px;\n}\n\n.pricing-portal-card__actions {\n  flex: 0 0 auto;\n}\n\n.pricing-embed {\n  margin-bottom: 12px;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  background: #fff;\n}\n\n.pricing-embed__chrome {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 8px 12px;\n  background: #EEF2F6;\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.pricing-embed__frame {\n  display: block;\n  width: 100%;\n  height: 420px;\n  border: 0;\n  background: #Fafafa;\n}\n\n.pricing-embed__note {\n  margin: 0;\n  padding: 8px 12px;\n  font-size: 12px;\n  color: var(--apex-text-muted, #5B5B5B);\n}\n\n.pricing-risk__actions {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n\n.pricing-risk__meta {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));\n  gap: 10px 16px;\n  margin-bottom: 14px;\n}\n\n.pricing-section-title {\n  margin: 8px 0 4px;\n  font-size: 14px;\n}\n\n.pricing-hint {\n  font-size: 12px;\n  margin: 0 0 10px;\n}\n\n.pricing-portfolio__toggle {\n  width: 100%;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border: 0;\n  background: transparent;\n  padding: 4px 0;\n  font-size: 14px;\n  font-weight: 700;\n  cursor: pointer;\n  color: var(--apex-text, #1C1C1C);\n}\n\n.apex-chip {\n  display: inline-block;\n  font-size: 10px;\n  font-weight: 700;\n  padding: 2px 5px;\n  margin-right: 3px;\n  background: #FFF3F3;\n  border: 1px solid #E57373;\n  color: #8B1A1A;\n}\n\n.apex-mono {\n  font-family: \"Courier New\", monospace;\n  font-size: 12px;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZmVhdHVyZXMvbW9kZWxsaW5nL21vZGVsbGluZy5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsY0FBYztBQUNoQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixTQUFTO0VBQ1QsdUJBQXVCO0VBQ3ZCLDhCQUE4QjtFQUM5QixlQUFlO0VBQ2YsZ0JBQWdCO0VBQ2hCLDZDQUE2QztFQUM3QyxrREFBa0Q7RUFDbEQsa0JBQWtCO0VBQ2xCLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGVBQWU7RUFDZixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsZUFBZTtFQUNmLHNDQUFzQztBQUN4Qzs7QUFFQTtFQUNFLGNBQWM7RUFDZCxlQUFlO0VBQ2YscUJBQXFCO0VBQ3JCLGNBQWM7RUFDZCxtQkFBbUI7RUFDbkIsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsY0FBYztBQUNoQjs7QUFFQTtFQUNFLG1CQUFtQjtFQUNuQiw2Q0FBNkM7RUFDN0MsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLDhCQUE4QjtFQUM5QixtQkFBbUI7RUFDbkIsaUJBQWlCO0VBQ2pCLG1CQUFtQjtFQUNuQixlQUFlO0VBQ2YsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsY0FBYztFQUNkLFdBQVc7RUFDWCxhQUFhO0VBQ2IsU0FBUztFQUNULG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLFNBQVM7RUFDVCxpQkFBaUI7RUFDakIsZUFBZTtFQUNmLHNDQUFzQztBQUN4Qzs7QUFFQTtFQUNFLGFBQWE7RUFDYixRQUFRO0VBQ1IsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLGFBQWE7RUFDYiw0REFBNEQ7RUFDNUQsY0FBYztFQUNkLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsZUFBZTtFQUNmLGdCQUFnQjtBQUNsQjs7QUFFQTtFQUNFLFdBQVc7RUFDWCxhQUFhO0VBQ2IsOEJBQThCO0VBQzlCLG1CQUFtQjtFQUNuQixTQUFTO0VBQ1QsdUJBQXVCO0VBQ3ZCLGNBQWM7RUFDZCxlQUFlO0VBQ2YsZ0JBQWdCO0VBQ2hCLGVBQWU7RUFDZixnQ0FBZ0M7QUFDbEM7O0FBRUE7RUFDRSxxQkFBcUI7RUFDckIsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixnQkFBZ0I7RUFDaEIsaUJBQWlCO0VBQ2pCLG1CQUFtQjtFQUNuQix5QkFBeUI7RUFDekIsY0FBYztBQUNoQjs7QUFFQTtFQUNFLHFDQUFxQztFQUNyQyxlQUFlO0FBQ2pCIiwiZmlsZSI6InNyYy9hcHAvZmVhdHVyZXMvbW9kZWxsaW5nL21vZGVsbGluZy5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuLnByaWNpbmctcG9ydGFsLWNhcmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDE2cHg7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgYmFja2dyb3VuZDogI2ZmZjtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYXBleC1ib3JkZXIsICNDOEM4QzgpO1xuICBib3JkZXItbGVmdDogNHB4IHNvbGlkIHZhcigtLWFwZXgtdXctcmVkLCAjQzYyODI4KTtcbiAgcGFkZGluZzogMTRweCAxNnB4O1xuICBtYXJnaW4tYm90dG9tOiAxMnB4O1xufVxuXG4ucHJpY2luZy1wb3J0YWwtY2FyZF9fY29weSB7XG4gIGZsZXg6IDEgMSAyODBweDtcbiAgbWluLXdpZHRoOiAwO1xufVxuXG4ucHJpY2luZy1wb3J0YWwtY2FyZF9fY29weSBwIHtcbiAgbWFyZ2luOiA2cHggMCA4cHg7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgY29sb3I6IHZhcigtLWFwZXgtdGV4dC1tdXRlZCwgIzVCNUI1Qik7XG59XG5cbi5wcmljaW5nLXBvcnRhbC1jYXJkX191cmwge1xuICBkaXNwbGF5OiBibG9jaztcbiAgZm9udC1zaXplOiAxMXB4O1xuICB3b3JkLWJyZWFrOiBicmVhay1hbGw7XG4gIGNvbG9yOiAjMTU2NUMwO1xuICBiYWNrZ3JvdW5kOiAjRjVGN0ZBO1xuICBwYWRkaW5nOiA2cHggOHB4O1xufVxuXG4ucHJpY2luZy1wb3J0YWwtY2FyZF9fYWN0aW9ucyB7XG4gIGZsZXg6IDAgMCBhdXRvO1xufVxuXG4ucHJpY2luZy1lbWJlZCB7XG4gIG1hcmdpbi1ib3R0b206IDEycHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWFwZXgtYm9yZGVyLCAjQzhDOEM4KTtcbiAgYmFja2dyb3VuZDogI2ZmZjtcbn1cblxuLnByaWNpbmctZW1iZWRfX2Nocm9tZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcGFkZGluZzogOHB4IDEycHg7XG4gIGJhY2tncm91bmQ6ICNFRUYyRjY7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbn1cblxuLnByaWNpbmctZW1iZWRfX2ZyYW1lIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDQyMHB4O1xuICBib3JkZXI6IDA7XG4gIGJhY2tncm91bmQ6ICNGYWZhZmE7XG59XG5cbi5wcmljaW5nLWVtYmVkX19ub3RlIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiA4cHggMTJweDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBjb2xvcjogdmFyKC0tYXBleC10ZXh0LW11dGVkLCAjNUI1QjVCKTtcbn1cblxuLnByaWNpbmctcmlza19fYWN0aW9ucyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogOHB4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG59XG5cbi5wcmljaW5nLXJpc2tfX21ldGEge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgxNjBweCwgMWZyKSk7XG4gIGdhcDogMTBweCAxNnB4O1xuICBtYXJnaW4tYm90dG9tOiAxNHB4O1xufVxuXG4ucHJpY2luZy1zZWN0aW9uLXRpdGxlIHtcbiAgbWFyZ2luOiA4cHggMCA0cHg7XG4gIGZvbnQtc2l6ZTogMTRweDtcbn1cblxuLnByaWNpbmctaGludCB7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgbWFyZ2luOiAwIDAgMTBweDtcbn1cblxuLnByaWNpbmctcG9ydGZvbGlvX190b2dnbGUge1xuICB3aWR0aDogMTAwJTtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBib3JkZXI6IDA7XG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICBwYWRkaW5nOiA0cHggMDtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGNvbG9yOiB2YXIoLS1hcGV4LXRleHQsICMxQzFDMUMpO1xufVxuXG4uYXBleC1jaGlwIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBmb250LXNpemU6IDEwcHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIHBhZGRpbmc6IDJweCA1cHg7XG4gIG1hcmdpbi1yaWdodDogM3B4O1xuICBiYWNrZ3JvdW5kOiAjRkZGM0YzO1xuICBib3JkZXI6IDFweCBzb2xpZCAjRTU3MzczO1xuICBjb2xvcjogIzhCMUExQTtcbn1cblxuLmFwZXgtbW9ubyB7XG4gIGZvbnQtZmFtaWx5OiBcIkNvdXJpZXIgTmV3XCIsIG1vbm9zcGFjZTtcbiAgZm9udC1zaXplOiAxMnB4O1xufVxuIl19 */");

/***/ }),

/***/ "./src/app/features/modelling/modelling.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/features/modelling/modelling.component.ts ***!
  \***********************************************************/
/*! exports provided: ModellingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModellingComponent", function() { return ModellingComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm2015/platform-browser.js");
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/auth.service */ "./src/app/core/auth.service.ts");
/* harmony import */ var _modelling_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modelling.service */ "./src/app/features/modelling/modelling.service.ts");






let ModellingComponent = class ModellingComponent {
    constructor(modellingService, route, sanitizer, auth) {
        this.modellingService = modellingService;
        this.route = route;
        this.sanitizer = sanitizer;
        this.auth = auth;
        this.loading = true;
        this.error = null;
        this.riskLoading = false;
        this.riskError = null;
        this.submissionId = null;
        this.file = null;
        this.embedOpen = false;
        this.embedUrl = null;
        this.tasks = [];
        this.tasksLoading = false;
        this.concentration = null;
        this.showPortfolio = false;
        this.activeTab = 'lob';
        this.groupOptions = [
            { value: 'lob', label: 'Line of Business' },
            { value: 'territory', label: 'Territory' },
            { value: 'broker', label: 'Broker' }
        ];
        this.rowsByGroup = {};
        this.routeSub = null;
    }
    ngOnInit() {
        this.routeSub = this.route.queryParamMap.subscribe(params => {
            const raw = params.get('submissionId');
            const id = raw ? Number(raw) : NaN;
            this.submissionId = !isNaN(id) && id > 0 ? id : null;
            this.refreshEmbedUrl();
            this.load();
        });
    }
    ngOnDestroy() {
        if (this.routeSub) {
            this.routeSub.unsubscribe();
        }
    }
    get reference() {
        if (!this.file) {
            return '';
        }
        return this.file.uwReference || this.file.submissionNumber || '';
    }
    get accountName() {
        return (this.file && (this.file.accountName || this.file.insuredName)) || '';
    }
    get sections() {
        return (this.file && this.file.sections) || [];
    }
    get pricingUrl() {
        return this.modellingService.pricingPortalUrl({
            reference: this.reference || undefined,
            submissionId: this.submissionId || undefined
        });
    }
    get uwFileUrl() {
        if (!this.submissionId) {
            return '/ng8/case-hub';
        }
        return '/ng8/case-hub/' + this.submissionId;
    }
    taskUrl(task) {
        return this.auth.shellUrl('/tasks/' + task.id);
    }
    refreshEmbedUrl() {
        this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pricingUrl);
    }
    load() {
        this.loading = true;
        this.error = null;
        this.rowsByGroup = {};
        this.refreshEmbedUrl();
        this.modellingService.getConcentrationSummary().subscribe((summary) => { this.concentration = summary; }, () => { this.concentration = null; });
        this.loadTasks();
        if (this.submissionId) {
            this.loadRisk(this.submissionId);
        }
        else {
            this.file = null;
            this.riskError = null;
        }
        this.modellingService.getExposure(this.activeTab).subscribe((rows) => {
            this.rowsByGroup[this.activeTab] = rows || [];
            this.loading = false;
        }, (err) => {
            this.error = err.message;
            this.loading = false;
        });
    }
    loadRisk(id) {
        this.riskLoading = true;
        this.riskError = null;
        this.modellingService.getUnderwriterFile(id).subscribe((file) => {
            this.file = file;
            this.refreshEmbedUrl();
            this.riskLoading = false;
        }, (err) => {
            this.file = null;
            this.riskError = err.message;
            this.riskLoading = false;
        });
    }
    loadTasks() {
        this.tasksLoading = true;
        this.modellingService.getModellingTasks().subscribe((tasks) => {
            this.tasks = tasks || [];
            this.tasksLoading = false;
        }, () => {
            this.tasks = [];
            this.tasksLoading = false;
        });
    }
    openPricing() {
        window.open(this.pricingUrl, '_blank', 'noopener');
    }
    toggleEmbed() {
        this.embedOpen = !this.embedOpen;
        if (this.embedOpen) {
            this.refreshEmbedUrl();
        }
    }
    togglePortfolio() {
        this.showPortfolio = !this.showPortfolio;
    }
    setTab(tab) {
        this.activeTab = tab;
        if (!this.rowsByGroup[tab]) {
            this.modellingService.getExposure(tab).subscribe((rows) => { this.rowsByGroup[tab] = rows || []; }, () => { this.rowsByGroup[tab] = []; });
        }
    }
    get activeRows() {
        return this.rowsByGroup[this.activeTab] || [];
    }
    maxSumInsured() {
        return Math.max(1, ...this.activeRows.map(r => r.sumInsured));
    }
    barWidth(row) {
        return Math.round((row.sumInsured / this.maxSumInsured()) * 100) + '%';
    }
    concentrationPct(row) {
        const total = this.activeRows.reduce((sum, r) => sum + (r.sumInsured || 0), 0);
        return total > 0 ? (row.sumInsured / total) * 100 : 0;
    }
    money(v) {
        if (v == null || v === '') {
            return '—';
        }
        const n = Number(v);
        if (isNaN(n)) {
            return '—';
        }
        return '£' + n.toLocaleString('en-GB', { maximumFractionDigits: 0 });
    }
    pct(v) {
        if (v == null || v === '') {
            return '—';
        }
        const n = Number(v);
        if (isNaN(n)) {
            return String(v);
        }
        return (n <= 1 ? n * 100 : n).toFixed(1) + '%';
    }
};
ModellingComponent.ctorParameters = () => [
    { type: _modelling_service__WEBPACK_IMPORTED_MODULE_5__["ModellingService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"] },
    { type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["DomSanitizer"] },
    { type: _core_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"] }
];
ModellingComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'apex-modelling',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./modelling.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/features/modelling/modelling.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./modelling.component.css */ "./src/app/features/modelling/modelling.component.css")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_modelling_service__WEBPACK_IMPORTED_MODULE_5__["ModellingService"],
        _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
        _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__["DomSanitizer"],
        _core_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"]])
], ModellingComponent);



/***/ }),

/***/ "./src/app/features/modelling/modelling.module.ts":
/*!********************************************************!*\
  !*** ./src/app/features/modelling/modelling.module.ts ***!
  \********************************************************/
/*! exports provided: ModellingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModellingModule", function() { return ModellingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _modelling_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modelling-routing.module */ "./src/app/features/modelling/modelling-routing.module.ts");
/* harmony import */ var _modelling_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modelling.component */ "./src/app/features/modelling/modelling.component.ts");





let ModellingModule = class ModellingModule {
};
ModellingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [_modelling_component__WEBPACK_IMPORTED_MODULE_4__["ModellingComponent"]],
        imports: [_shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"], _modelling_routing_module__WEBPACK_IMPORTED_MODULE_3__["ModellingRoutingModule"]]
    })
], ModellingModule);



/***/ }),

/***/ "./src/app/features/modelling/modelling.service.ts":
/*!*********************************************************!*\
  !*** ./src/app/features/modelling/modelling.service.ts ***!
  \*********************************************************/
/*! exports provided: ModellingService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ModellingService", function() { return ModellingService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _core_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/api.service */ "./src/app/core/api.service.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");





let ModellingService = class ModellingService {
    constructor(api) {
        this.api = api;
    }
    /** External UW Pricing portal URL (deep-link / embed target). */
    pricingPortalUrl(context) {
        const base = _environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].pricingUrl
            || 'https://example.invalid/pricing';
        const params = [];
        if (context && context.reference) {
            params.push('ref=' + encodeURIComponent(String(context.reference)));
        }
        if (context && context.submissionId != null) {
            params.push('submissionId=' + encodeURIComponent(String(context.submissionId)));
        }
        params.push('source=apex-workbench');
        return base + (base.indexOf('?') >= 0 ? '&' : '?') + params.join('&');
    }
    getExposure(groupBy) {
        return this.api.get('/modelling/exposure', { groupBy });
    }
    getConcentrationSummary() {
        return this.api.get('/modelling/concentration-summary');
    }
    getUnderwriterFile(submissionId) {
        return this.api.get(`/underwriter-file/${submissionId}`);
    }
    /** Open modelling / pricing-related workflow tasks for the current UW. */
    getModellingTasks() {
        return this.api.get('/workflow/tasks', { status: 'Open', pageSize: 100 }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])((tasks) => {
            const list = tasks || [];
            return list
                .filter((t) => {
                const type = String(t.taskType || t.type || t.title || '').toLowerCase();
                return type.indexOf('model') >= 0
                    || type.indexOf('pricing') >= 0
                    || type.indexOf('second sight') >= 0
                    || type.indexOf('rate') >= 0;
            })
                .map((t) => ({
                id: t.id,
                title: t.title || t.taskType || 'Modelling',
                taskType: t.taskType || t.type,
                status: t.status,
                submissionId: t.submissionId,
                submissionNumber: t.submissionNumber || t.reference,
                insuredName: t.insuredName || t.accountName,
                assignedToName: t.assignedToName || t.assignedTo,
                dueDate: t.dueDate,
                createdUtc: t.createdUtc || t.createdDate
            }));
        }));
    }
};
ModellingService.ctorParameters = () => [
    { type: _core_api_service__WEBPACK_IMPORTED_MODULE_3__["ApiService"] }
];
ModellingService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_core_api_service__WEBPACK_IMPORTED_MODULE_3__["ApiService"]])
], ModellingService);



/***/ })

}]);
//# sourceMappingURL=features-modelling-modelling-module.js.map