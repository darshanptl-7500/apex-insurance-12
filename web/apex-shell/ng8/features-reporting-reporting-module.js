(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["features-reporting-reporting-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/features/reporting/reporting.component.html":
/*!***************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/features/reporting/reporting.component.html ***!
  \***************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"mi-page\">\n  <div class=\"apex-page-header\">\n    <div class=\"apex-page-header__title\">\n      <h1>Reporting &amp; MI</h1>\n      <div class=\"apex-page-header__subtitle\">\n        Production, broker league, pipeline aging and loss ratio — underwriter management information\n      </div>\n    </div>\n    <div class=\"apex-page-header__actions\">\n      <button type=\"button\" class=\"apex-btn apex-btn--ghost apex-btn--sm\"\n              (click)=\"exportCurrentTab()\" [disabled]=\"currentRowCount() === 0\">\n        Export CSV\n      </button>\n      <button type=\"button\" class=\"apex-btn apex-btn--ghost apex-btn--sm\" (click)=\"load()\">Refresh</button>\n    </div>\n  </div>\n\n  <div class=\"mi-toolbar\">\n    <div class=\"mi-period__pills\">\n      <button type=\"button\" class=\"mi-pill\" [class.active]=\"period==='mtd'\" (click)=\"applyPeriod('mtd')\">MTD</button>\n      <button type=\"button\" class=\"mi-pill\" [class.active]=\"period==='qtd'\" (click)=\"applyPeriod('qtd')\">QTD</button>\n      <button type=\"button\" class=\"mi-pill\" [class.active]=\"period==='ytd'\" (click)=\"applyPeriod('ytd')\">YTD</button>\n      <button type=\"button\" class=\"mi-pill\" [class.active]=\"period==='12m'\" (click)=\"applyPeriod('12m')\">12M</button>\n    </div>\n    <form class=\"mi-dates\" (ngSubmit)=\"applyDateFilter()\">\n      <label>From <input type=\"date\" name=\"fromDate\" [(ngModel)]=\"fromDate\"></label>\n      <label>To <input type=\"date\" name=\"toDate\" [(ngModel)]=\"toDate\"></label>\n      <button type=\"submit\" class=\"apex-btn apex-btn--sm apex-btn--primary\">Apply</button>\n    </form>\n  </div>\n\n  <!-- Snapshot strip -->\n  <div class=\"mi-snap\" *ngIf=\"!loading\">\n    <div class=\"mi-snap__tile\">\n      <div class=\"mi-snap__label\">Written</div>\n      <div class=\"mi-snap__value\">{{ premiumWrittenTotal | currency:'GBP':'symbol':'1.0-0' }}</div>\n    </div>\n    <div class=\"mi-snap__tile\">\n      <div class=\"mi-snap__label\">Target</div>\n      <div class=\"mi-snap__value\">{{ premiumTargetTotal | currency:'GBP':'symbol':'1.0-0' }}</div>\n    </div>\n    <div class=\"mi-snap__tile\" [ngClass]=\"premiumVariancePct >= 0 ? 'mi-snap__tile--ok' : 'mi-snap__tile--bad'\">\n      <div class=\"mi-snap__label\">Variance</div>\n      <div class=\"mi-snap__value\">{{ premiumVariancePct | number:'1.0-1' }}%</div>\n    </div>\n    <div class=\"mi-snap__tile\">\n      <div class=\"mi-snap__label\">Broker GWP</div>\n      <div class=\"mi-snap__value\">{{ leagueGwpTotal | currency:'GBP':'symbol':'1.0-0' }}</div>\n    </div>\n    <div class=\"mi-snap__tile\">\n      <div class=\"mi-snap__label\">Pipeline risks</div>\n      <div class=\"mi-snap__value\">{{ pipelineTotal }}</div>\n    </div>\n    <div class=\"mi-snap__tile\" [ngClass]=\"avgLossRatio > 65 ? 'mi-snap__tile--bad' : 'mi-snap__tile--ok'\">\n      <div class=\"mi-snap__label\">Avg loss ratio</div>\n      <div class=\"mi-snap__value\">{{ avgLossRatio | number:'1.0-1' }}%</div>\n    </div>\n  </div>\n\n  <div class=\"mi-workbench\">\n    <aside class=\"mi-catalog\">\n      <div class=\"mi-catalog__title\">Report catalog</div>\n      <button type=\"button\" class=\"mi-catalog__item\"\n              *ngFor=\"let c of catalog\"\n              [class.active]=\"activeTab === c.id\"\n              (click)=\"setTab(c.id)\">\n        <strong>{{ c.title }}</strong>\n        <span>{{ c.blurb }}</span>\n      </button>\n    </aside>\n\n    <section class=\"mi-canvas\">\n      <apex-loading *ngIf=\"loading\" label=\"Loading management information…\"></apex-loading>\n      <div class=\"apex-alert apex-alert--danger\" *ngIf=\"error && !loading\">{{ error }}</div>\n\n      <!-- Premium -->\n      <div class=\"apex-card mi-card\" *ngIf=\"!loading && !error && activeTab === 'premium'\">\n        <div class=\"apex-card__header\">\n          <h3>Premium vs Target</h3>\n          <span class=\"mi-muted\">{{ fromDate }} → {{ toDate }}</span>\n        </div>\n        <apex-empty-state *ngIf=\"!premiumVsTarget.length\" title=\"No premium data\"\n                           message=\"No premium vs target figures for this period.\"></apex-empty-state>\n        <ng-container *ngIf=\"premiumVsTarget.length\">\n          <div class=\"mi-legend\">\n            <span><i class=\"mi-swatch mi-swatch--written\"></i> Written</span>\n            <span><i class=\"mi-swatch mi-swatch--target\"></i> Target</span>\n          </div>\n          <div class=\"mi-dual-chart mi-dual-chart--tall\">\n            <div class=\"mi-dual-col\" *ngFor=\"let row of premiumVsTarget\">\n              <div class=\"mi-dual-col__bars\">\n                <div class=\"mi-dual-col__bar mi-dual-col__bar--target\" [style.height]=\"targetHeight(row)\"></div>\n                <div class=\"mi-dual-col__bar mi-dual-col__bar--written\"\n                     [class.mi-dual-col__bar--under]=\"row.premiumWritten < row.target\"\n                     [style.height]=\"writtenHeight(row)\"></div>\n              </div>\n              <div class=\"mi-dual-col__label\">{{ row.periodLabel }}</div>\n            </div>\n          </div>\n          <div class=\"apex-table-wrap apex-mt-16\">\n            <table class=\"apex-table apex-table--dense\">\n              <thead>\n              <tr>\n                <th>Period</th><th>Written</th><th>Target</th><th>Variance</th><th>Attainment</th>\n              </tr>\n              </thead>\n              <tbody>\n              <tr *ngFor=\"let row of premiumVsTarget\">\n                <td>{{ row.periodLabel }}</td>\n                <td>{{ row.premiumWritten | currency:'GBP':'symbol':'1.0-0' }}</td>\n                <td>{{ row.target | currency:'GBP':'symbol':'1.0-0' }}</td>\n                <td [ngClass]=\"row.variancePercent >= 0 ? 'apex-text-success' : 'apex-text-danger'\">\n                  {{ row.variancePercent | number:'1.0-1' }}%\n                </td>\n                <td>\n                  <div class=\"mi-mini-track\">\n                    <span [style.width]=\"(row.target ? (row.premiumWritten / row.target * 100) : 0) + '%'\"\n                          [ngClass]=\"row.premiumWritten >= row.target ? 'ok' : 'bad'\"></span>\n                  </div>\n                </td>\n              </tr>\n              </tbody>\n            </table>\n          </div>\n        </ng-container>\n      </div>\n\n      <!-- League -->\n      <div class=\"apex-card mi-card\" *ngIf=\"!loading && !error && activeTab === 'league'\">\n        <div class=\"apex-card__header\"><h3>Broker League Table</h3></div>\n        <apex-empty-state *ngIf=\"!brokerLeague.length\" title=\"No broker data\"\n                           message=\"No broker performance for this period.\"></apex-empty-state>\n        <div *ngIf=\"brokerLeague.length\">\n          <div class=\"mi-rank-row\" *ngFor=\"let row of brokerLeague; let i = index\">\n            <div class=\"mi-rank\"\n                 [ngClass]=\"{'mi-rank--gold': i===0, 'mi-rank--silver': i===1, 'mi-rank--bronze': i===2}\">\n              {{ row.rank || (i + 1) }}\n            </div>\n            <div class=\"mi-rank-row__body\">\n              <div class=\"mi-rank-row__top\">\n                <strong>{{ row.brokerName }}</strong>\n                <span>{{ row.grossWrittenPremium | currency:'GBP':'symbol':'1.0-0' }}</span>\n              </div>\n              <div class=\"mi-rank-row__track\"><span [style.width]=\"leagueBar(row)\"></span></div>\n              <div class=\"mi-rank-row__meta\">\n                {{ row.submissionCount }} submissions · {{ row.boundCount }} bound · hit ratio {{ row.hitRatio | number:'1.0-1' }}%\n              </div>\n            </div>\n          </div>\n          <div class=\"apex-table-wrap apex-mt-16\">\n            <table class=\"apex-table apex-table--dense\">\n              <thead>\n              <tr><th>Rank</th><th>Broker</th><th>GWP</th><th>Subs</th><th>Bound</th><th>Hit %</th></tr>\n              </thead>\n              <tbody>\n              <tr *ngFor=\"let row of brokerLeague\">\n                <td>{{ row.rank }}</td>\n                <td>{{ row.brokerName }}</td>\n                <td>{{ row.grossWrittenPremium | currency:'GBP':'symbol':'1.0-0' }}</td>\n                <td>{{ row.submissionCount }}</td>\n                <td>{{ row.boundCount }}</td>\n                <td>{{ row.hitRatio | number:'1.0-1' }}%</td>\n              </tr>\n              </tbody>\n            </table>\n          </div>\n        </div>\n      </div>\n\n      <!-- Pipeline aging heatmap -->\n      <div class=\"apex-card mi-card\" *ngIf=\"!loading && !error && activeTab === 'pipeline'\">\n        <div class=\"apex-card__header\">\n          <h3>Pipeline aging heatmap</h3>\n          <span class=\"mi-muted\">{{ pipelineTotal }} risks</span>\n        </div>\n        <apex-empty-state *ngIf=\"!pipeline.length\" title=\"No pipeline data\"\n                           message=\"No submissions currently in the pipeline.\"></apex-empty-state>\n        <div class=\"mi-heat-wrap\" *ngIf=\"pipeline.length\">\n          <table class=\"mi-heat\">\n            <thead>\n            <tr>\n              <th>Status \\ Age</th>\n              <th *ngFor=\"let b of agingBuckets\">{{ b }}</th>\n              <th>Total</th>\n            </tr>\n            </thead>\n            <tbody>\n            <tr *ngFor=\"let s of agingStatuses\">\n              <th>{{ s }}</th>\n              <td *ngFor=\"let b of agingBuckets\" [ngClass]=\"heatClass(agingCount(s, b))\">\n                {{ agingCount(s, b) || '·' }}\n              </td>\n              <td class=\"mi-heat__total\">{{ rowTotal(s) }}</td>\n            </tr>\n            </tbody>\n          </table>\n          <div class=\"mi-heat-legend\">\n            <span>Low</span>\n            <i class=\"mi-heat--1\"></i><i class=\"mi-heat--2\"></i><i class=\"mi-heat--3\"></i><i class=\"mi-heat--4\"></i>\n            <span>High</span>\n          </div>\n        </div>\n      </div>\n\n      <!-- Loss ratio -->\n      <div class=\"apex-card mi-card\" *ngIf=\"!loading && !error && activeTab === 'lossRatio'\">\n        <div class=\"apex-card__header\"><h3>Loss ratio by line of business</h3></div>\n        <apex-empty-state *ngIf=\"!lossRatioRows.length\" title=\"No loss ratio data\"\n                           message=\"No claims experience for this period.\"></apex-empty-state>\n        <div class=\"mi-lr-grid\" *ngIf=\"lossRatioRows.length\">\n          <div class=\"mi-lr-card\" *ngFor=\"let row of lossRatioRows\"\n               [ngClass]=\"row.lossRatioPercent > 65 ? 'mi-lr-card--bad' : 'mi-lr-card--ok'\">\n            <svg class=\"mi-lr-gauge\" viewBox=\"0 0 100 100\">\n              <circle cx=\"50\" cy=\"50\" r=\"36\" class=\"mi-gauge__track\"></circle>\n              <circle cx=\"50\" cy=\"50\" r=\"36\" class=\"mi-gauge__value\"\n                      [attr.stroke-dasharray]=\"lrGauge(row)\"\n                      transform=\"rotate(-90 50 50)\"></circle>\n              <text x=\"50\" y=\"52\" text-anchor=\"middle\" class=\"mi-gauge__pct\">{{ row.lossRatioPercent | number:'1.0-0' }}%</text>\n            </svg>\n            <div>\n              <strong>{{ row.lineOfBusiness }}</strong>\n              <div class=\"mi-muted\">Earned {{ row.earnedPremium | currency:'GBP':'symbol':'1.0-0' }}</div>\n              <div class=\"mi-muted\">Incurred {{ row.incurredLosses | currency:'GBP':'symbol':'1.0-0' }}</div>\n            </div>\n          </div>\n        </div>\n        <div class=\"apex-table-wrap apex-mt-16\" *ngIf=\"lossRatioRows.length\">\n          <table class=\"apex-table apex-table--dense\">\n            <thead>\n            <tr><th>LOB</th><th>Earned</th><th>Incurred</th><th>Loss ratio</th></tr>\n            </thead>\n            <tbody>\n            <tr *ngFor=\"let row of lossRatioRows\">\n              <td>{{ row.lineOfBusiness }}</td>\n              <td>{{ row.earnedPremium | currency:'GBP':'symbol':'1.0-0' }}</td>\n              <td>{{ row.incurredLosses | currency:'GBP':'symbol':'1.0-0' }}</td>\n              <td [ngClass]=\"row.lossRatioPercent > 65 ? 'apex-text-danger' : 'apex-text-success'\">\n                {{ row.lossRatioPercent | number:'1.0-1' }}%\n              </td>\n            </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    </section>\n  </div>\n</div>\n");

/***/ }),

/***/ "./src/app/features/reporting/reporting-routing.module.ts":
/*!****************************************************************!*\
  !*** ./src/app/features/reporting/reporting-routing.module.ts ***!
  \****************************************************************/
/*! exports provided: ReportingRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportingRoutingModule", function() { return ReportingRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _reporting_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reporting.component */ "./src/app/features/reporting/reporting.component.ts");




const routes = [
    { path: '', component: _reporting_component__WEBPACK_IMPORTED_MODULE_3__["ReportingComponent"] }
];
let ReportingRoutingModule = class ReportingRoutingModule {
};
ReportingRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })
], ReportingRoutingModule);



/***/ }),

/***/ "./src/app/features/reporting/reporting.component.css":
/*!************************************************************!*\
  !*** ./src/app/features/reporting/reporting.component.css ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (":host { display: block; }\n\n.mi-page { max-width: 1280px; }\n\n.mi-toolbar {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px 18px;\n  align-items: center;\n  justify-content: space-between;\n  background: #fff;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  padding: 10px 12px;\n  margin-bottom: 12px;\n}\n\n.mi-period__pills {\n  display: inline-flex;\n  border: 1px solid var(--apex-border, #C8C8C8);\n}\n\n.mi-pill {\n  border: 0;\n  background: transparent;\n  padding: 6px 12px;\n  font-size: 12px;\n  font-weight: 700;\n  cursor: pointer;\n  color: #555;\n}\n\n.mi-pill.active {\n  background: var(--apex-uw-red, #C62828);\n  color: #fff;\n}\n\n.mi-dates {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 10px;\n  align-items: flex-end;\n  font-size: 12px;\n}\n\n.mi-dates label {\n  display: flex;\n  flex-direction: column;\n  gap: 3px;\n  font-weight: 600;\n  color: #5B5B5B;\n}\n\n.mi-dates input {\n  height: 30px;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  padding: 0 8px;\n}\n\n.mi-snap {\n  display: grid;\n  grid-template-columns: repeat(6, 1fr);\n  gap: 8px;\n  margin-bottom: 14px;\n}\n\n@media (max-width: 1000px) {\n  .mi-snap { grid-template-columns: repeat(3, 1fr); }\n}\n\n@media (max-width: 560px) {\n  .mi-snap { grid-template-columns: repeat(2, 1fr); }\n}\n\n.mi-snap__tile {\n  background: #fff;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  border-top: 3px solid #0B1F33;\n  padding: 10px 12px;\n}\n\n.mi-snap__tile--ok { border-top-color: #1E7145; }\n\n.mi-snap__tile--bad { border-top-color: #C62828; }\n\n.mi-snap__label {\n  font-size: 10px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  color: #5B5B5B;\n}\n\n.mi-snap__value {\n  font-size: 18px;\n  font-weight: 700;\n  font-family: 'Libre Baskerville', Georgia, serif;\n  margin-top: 2px;\n}\n\n.mi-workbench {\n  display: grid;\n  grid-template-columns: 220px 1fr;\n  gap: 12px;\n  align-items: start;\n}\n\n@media (max-width: 860px) {\n  .mi-workbench { grid-template-columns: 1fr; }\n}\n\n.mi-catalog {\n  background: #fff;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  padding: 10px;\n  position: -webkit-sticky;\n  position: sticky;\n  top: 8px;\n}\n\n.mi-catalog__title {\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  color: #5B5B5B;\n  padding: 4px 8px 10px;\n}\n\n.mi-catalog__item {\n  display: block;\n  width: 100%;\n  text-align: left;\n  border: 0;\n  background: transparent;\n  padding: 10px 8px;\n  cursor: pointer;\n  border-left: 3px solid transparent;\n  margin-bottom: 4px;\n}\n\n.mi-catalog__item strong {\n  display: block;\n  font-size: 13px;\n  color: #0B1F33;\n}\n\n.mi-catalog__item span {\n  display: block;\n  font-size: 11px;\n  color: #5B5B5B;\n  margin-top: 2px;\n}\n\n.mi-catalog__item.active {\n  background: #FFF5F5;\n  border-left-color: #C62828;\n}\n\n.mi-catalog__item:hover { background: #F7F9FB; }\n\n.mi-canvas { min-width: 0; }\n\n.mi-card { margin: 0; }\n\n.mi-muted { font-size: 12px; color: #5B5B5B; }\n\n.mi-legend {\n  display: flex;\n  gap: 14px;\n  font-size: 11px;\n  color: #5B5B5B;\n  margin-bottom: 10px;\n}\n\n.mi-swatch {\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  margin-right: 4px;\n  vertical-align: middle;\n}\n\n.mi-swatch--written { background: #C62828; }\n\n.mi-swatch--target { background: #90A4AE; }\n\n.mi-dual-chart {\n  display: flex;\n  align-items: flex-end;\n  gap: 6px;\n  height: 160px;\n  padding-top: 8px;\n  border-bottom: 1px solid #EEF2F6;\n}\n\n.mi-dual-chart--tall { height: 220px; }\n\n.mi-dual-col {\n  flex: 1 1 0;\n  min-width: 0;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n\n.mi-dual-col__bars {\n  flex: 1;\n  width: 100%;\n  display: flex;\n  align-items: flex-end;\n  justify-content: center;\n  gap: 2px;\n}\n\n.mi-dual-col__bar {\n  width: 42%;\n  max-width: 16px;\n  min-height: 2px;\n  border-radius: 2px 2px 0 0;\n}\n\n.mi-dual-col__bar--written { background: linear-gradient(180deg, #E57373, #C62828); }\n\n.mi-dual-col__bar--under { background: linear-gradient(180deg, #FFB74D, #C62828); }\n\n.mi-dual-col__bar--target { background: #B0BEC5; }\n\n.mi-dual-col__label {\n  font-size: 9px;\n  color: #5B5B5B;\n  margin-top: 6px;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.mi-mini-track {\n  height: 6px;\n  background: #EEF2F6;\n  border-radius: 3px;\n  overflow: hidden;\n  min-width: 80px;\n}\n\n.mi-mini-track span {\n  display: block;\n  height: 100%;\n  max-width: 100%;\n  background: #C62828;\n}\n\n.mi-mini-track span.ok { background: #1E7145; }\n\n.mi-mini-track span.bad { background: #C62828; }\n\n.mi-rank-row {\n  display: flex;\n  gap: 10px;\n  padding: 10px 0;\n  border-bottom: 1px solid #F0F0F0;\n}\n\n.mi-rank {\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  background: #EEF2F6;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 12px;\n  font-weight: 700;\n  flex: 0 0 auto;\n}\n\n.mi-rank--gold { background: #F5D76E; }\n\n.mi-rank--silver { background: #CFD8DC; }\n\n.mi-rank--bronze { background: #E0B089; }\n\n.mi-rank-row__body { flex: 1; min-width: 0; }\n\n.mi-rank-row__top {\n  display: flex;\n  justify-content: space-between;\n  gap: 8px;\n  font-size: 13px;\n}\n\n.mi-rank-row__track {\n  margin: 6px 0 4px;\n  height: 8px;\n  background: #EEF2F6;\n  border-radius: 4px;\n  overflow: hidden;\n}\n\n.mi-rank-row__track span {\n  display: block;\n  height: 100%;\n  background: linear-gradient(90deg, #0B1F33, #C62828);\n}\n\n.mi-rank-row__meta { font-size: 11px; color: #5B5B5B; }\n\n.mi-heat-wrap { overflow-x: auto; }\n\n.mi-heat {\n  width: 100%;\n  border-collapse: collapse;\n  font-size: 12px;\n}\n\n.mi-heat th, .mi-heat td {\n  border: 1px solid #E0E0E0;\n  padding: 8px 10px;\n  text-align: center;\n  min-width: 64px;\n}\n\n.mi-heat th:first-child, .mi-heat td:first-child,\n.mi-heat tbody th {\n  text-align: left;\n  background: #F7F9FB;\n  font-weight: 700;\n}\n\n.mi-heat__total { font-weight: 700; background: #F7F9FB; }\n\n.mi-heat--0 { background: #FAFAFA; color: #BDBDBD; }\n\n.mi-heat--1 { background: #FFECB3; }\n\n.mi-heat--2 { background: #FFCC80; }\n\n.mi-heat--3 { background: #FF8A65; color: #fff; }\n\n.mi-heat--4 { background: #C62828; color: #fff; }\n\n.mi-heat-legend {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-top: 10px;\n  font-size: 11px;\n  color: #5B5B5B;\n}\n\n.mi-heat-legend i {\n  display: inline-block;\n  width: 18px;\n  height: 12px;\n  border: 1px solid #ddd;\n}\n\n.mi-lr-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));\n  gap: 12px;\n}\n\n.mi-lr-card {\n  display: flex;\n  gap: 12px;\n  align-items: center;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  padding: 12px;\n  background: #fff;\n}\n\n.mi-lr-card--ok { border-left: 3px solid #1E7145; }\n\n.mi-lr-card--bad { border-left: 3px solid #C62828; }\n\n.mi-lr-gauge { width: 72px; height: 72px; flex: 0 0 auto; }\n\n.mi-gauge__track { fill: none; stroke: #EEF2F6; stroke-width: 8; }\n\n.mi-gauge__value {\n  fill: none;\n  stroke: #C62828;\n  stroke-width: 8;\n  stroke-linecap: round;\n}\n\n.mi-lr-card--ok .mi-gauge__value { stroke: #1E7145; }\n\n.mi-gauge__pct {\n  font-size: 12px;\n  font-weight: 700;\n  fill: #0B1F33;\n}\n\n.apex-mt-16 { margin-top: 16px; }\n\n.apex-text-success { color: #1E7145; font-weight: 600; }\n\n.apex-text-danger { color: #C62828; font-weight: 600; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZmVhdHVyZXMvcmVwb3J0aW5nL3JlcG9ydGluZy5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQVEsY0FBYyxFQUFFOztBQUV4QixXQUFXLGlCQUFpQixFQUFFOztBQUU5QjtFQUNFLGFBQWE7RUFDYixlQUFlO0VBQ2YsY0FBYztFQUNkLG1CQUFtQjtFQUNuQiw4QkFBOEI7RUFDOUIsZ0JBQWdCO0VBQ2hCLDZDQUE2QztFQUM3QyxrQkFBa0I7RUFDbEIsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0Usb0JBQW9CO0VBQ3BCLDZDQUE2QztBQUMvQzs7QUFFQTtFQUNFLFNBQVM7RUFDVCx1QkFBdUI7RUFDdkIsaUJBQWlCO0VBQ2pCLGVBQWU7RUFDZixnQkFBZ0I7RUFDaEIsZUFBZTtFQUNmLFdBQVc7QUFDYjs7QUFFQTtFQUNFLHVDQUF1QztFQUN2QyxXQUFXO0FBQ2I7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsZUFBZTtFQUNmLFNBQVM7RUFDVCxxQkFBcUI7RUFDckIsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsUUFBUTtFQUNSLGdCQUFnQjtFQUNoQixjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsWUFBWTtFQUNaLDZDQUE2QztFQUM3QyxjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHFDQUFxQztFQUNyQyxRQUFRO0VBQ1IsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsV0FBVyxxQ0FBcUMsRUFBRTtBQUNwRDs7QUFDQTtFQUNFLFdBQVcscUNBQXFDLEVBQUU7QUFDcEQ7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsNkNBQTZDO0VBQzdDLDZCQUE2QjtFQUM3QixrQkFBa0I7QUFDcEI7O0FBRUEscUJBQXFCLHlCQUF5QixFQUFFOztBQUNoRCxzQkFBc0IseUJBQXlCLEVBQUU7O0FBRWpEO0VBQ0UsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQix5QkFBeUI7RUFDekIsc0JBQXNCO0VB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QUFFOztBQUVuRCxlQUFlLFdBQVcsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFOztBQUMxRCxtQkFBbUIsVUFBVSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUU7O0FBQ2pFO0VBQ0UsVUFBVTtFQUNWLGVBQWU7RUFDZixlQUFlO0VBQ2YscUJBQXFCO0FBQ3ZCOztBQUNBLG1DQUFtQyxlQUFlLEVBQUU7O0FBQ3BEO0VBQ0UsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixhQUFhO0FBQ2Y7O0FBRUEsY0FBYyxnQkFBZ0IsRUFBRTs7QUFDaEMscUJBQXFCLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRTs7QUFDdkQsb0JBQW9CLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSIsImZpbGUiOiJzcmMvYXBwL2ZlYXR1cmVzL3JlcG9ydGluZy9yZXBvcnRpbmcuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHsgZGlzcGxheTogYmxvY2s7IH1cblxuLm1pLXBhZ2UgeyBtYXgtd2lkdGg6IDEyODBweDsgfVxuXG4ubWktdG9vbGJhciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgZ2FwOiAxMnB4IDE4cHg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYmFja2dyb3VuZDogI2ZmZjtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYXBleC1ib3JkZXIsICNDOEM4QzgpO1xuICBwYWRkaW5nOiAxMHB4IDEycHg7XG4gIG1hcmdpbi1ib3R0b206IDEycHg7XG59XG5cbi5taS1wZXJpb2RfX3BpbGxzIHtcbiAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWFwZXgtYm9yZGVyLCAjQzhDOEM4KTtcbn1cblxuLm1pLXBpbGwge1xuICBib3JkZXI6IDA7XG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICBwYWRkaW5nOiA2cHggMTJweDtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGNvbG9yOiAjNTU1O1xufVxuXG4ubWktcGlsbC5hY3RpdmUge1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1hcGV4LXV3LXJlZCwgI0M2MjgyOCk7XG4gIGNvbG9yOiAjZmZmO1xufVxuXG4ubWktZGF0ZXMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGdhcDogMTBweDtcbiAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuICBmb250LXNpemU6IDEycHg7XG59XG5cbi5taS1kYXRlcyBsYWJlbCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGdhcDogM3B4O1xuICBmb250LXdlaWdodDogNjAwO1xuICBjb2xvcjogIzVCNUI1Qjtcbn1cblxuLm1pLWRhdGVzIGlucHV0IHtcbiAgaGVpZ2h0OiAzMHB4O1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1hcGV4LWJvcmRlciwgI0M4QzhDOCk7XG4gIHBhZGRpbmc6IDAgOHB4O1xufVxuXG4ubWktc25hcCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDYsIDFmcik7XG4gIGdhcDogOHB4O1xuICBtYXJnaW4tYm90dG9tOiAxNHB4O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMTAwMHB4KSB7XG4gIC5taS1zbmFwIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMywgMWZyKTsgfVxufVxuQG1lZGlhIChtYXgtd2lkdGg6IDU2MHB4KSB7XG4gIC5taS1zbmFwIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgMWZyKTsgfVxufVxuXG4ubWktc25hcF9fdGlsZSB7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWFwZXgtYm9yZGVyLCAjQzhDOEM4KTtcbiAgYm9yZGVyLXRvcDogM3B4IHNvbGlkICMwQjFGMzM7XG4gIHBhZGRpbmc6IDEwcHggMTJweDtcbn1cblxuLm1pLXNuYXBfX3RpbGUtLW9rIHsgYm9yZGVyLXRvcC1jb2xvcjogIzFFNzE0NTsgfVxuLm1pLXNuYXBfX3RpbGUtLWJhZCB7IGJvcmRlci10b3AtY29sb3I6ICNDNjI4Mjg7IH1cblxuLm1pLXNuYXBfX2xhYmVsIHtcbiAgZm9udC1zaXplOiAxMHB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBsZXR0ZXItc3BhY2luZzogMC4wNGVtO1xuICBjb2xvcjogIzVCNUI1Qjtcbn1cblxuLm1pLXNuYXBfX3ZhbHVlIHtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBmb250LWZhbWlseTogJ0xpYnJlIEJhc2tlcnZpbGxlJywgR2VvcmdpYSwgc2VyaWY7XG4gIG1hcmdpbi10b3A6IDJweDtcbn1cblxuLm1pLXdvcmtiZW5jaCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMjIwcHggMWZyO1xuICBnYXA6IDEycHg7XG4gIGFsaWduLWl0ZW1zOiBzdGFydDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDg2MHB4KSB7XG4gIC5taS13b3JrYmVuY2ggeyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjsgfVxufVxuXG4ubWktY2F0YWxvZyB7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWFwZXgtYm9yZGVyLCAjQzhDOEM4KTtcbiAgcGFkZGluZzogMTBweDtcbiAgcG9zaXRpb246IHN0aWNreTtcbiAgdG9wOiA4cHg7XG59XG5cbi5taS1jYXRhbG9nX190aXRsZSB7XG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMDZlbTtcbiAgY29sb3I6ICM1QjVCNUI7XG4gIHBhZGRpbmc6IDRweCA4cHggMTBweDtcbn1cblxuLm1pLWNhdGFsb2dfX2l0ZW0ge1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2lkdGg6IDEwMCU7XG4gIHRleHQtYWxpZ246IGxlZnQ7XG4gIGJvcmRlcjogMDtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIHBhZGRpbmc6IDEwcHggOHB4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJvcmRlci1sZWZ0OiAzcHggc29saWQgdHJhbnNwYXJlbnQ7XG4gIG1hcmdpbi1ib3R0b206IDRweDtcbn1cblxuLm1pLWNhdGFsb2dfX2l0ZW0gc3Ryb25nIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZvbnQtc2l6ZTogMTNweDtcbiAgY29sb3I6ICMwQjFGMzM7XG59XG5cbi5taS1jYXRhbG9nX19pdGVtIHNwYW4ge1xuICBkaXNwbGF5OiBibG9jaztcbiAgZm9udC1zaXplOiAxMXB4O1xuICBjb2xvcjogIzVCNUI1QjtcbiAgbWFyZ2luLXRvcDogMnB4O1xufVxuXG4ubWktY2F0YWxvZ19faXRlbS5hY3RpdmUge1xuICBiYWNrZ3JvdW5kOiAjRkZGNUY1O1xuICBib3JkZXItbGVmdC1jb2xvcjogI0M2MjgyODtcbn1cblxuLm1pLWNhdGFsb2dfX2l0ZW06aG92ZXIgeyBiYWNrZ3JvdW5kOiAjRjdGOUZCOyB9XG5cbi5taS1jYW52YXMgeyBtaW4td2lkdGg6IDA7IH1cbi5taS1jYXJkIHsgbWFyZ2luOiAwOyB9XG4ubWktbXV0ZWQgeyBmb250LXNpemU6IDEycHg7IGNvbG9yOiAjNUI1QjVCOyB9XG5cbi5taS1sZWdlbmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDE0cHg7XG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgY29sb3I6ICM1QjVCNUI7XG4gIG1hcmdpbi1ib3R0b206IDEwcHg7XG59XG5cbi5taS1zd2F0Y2gge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHdpZHRoOiAxMHB4O1xuICBoZWlnaHQ6IDEwcHg7XG4gIG1hcmdpbi1yaWdodDogNHB4O1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xufVxuLm1pLXN3YXRjaC0td3JpdHRlbiB7IGJhY2tncm91bmQ6ICNDNjI4Mjg7IH1cbi5taS1zd2F0Y2gtLXRhcmdldCB7IGJhY2tncm91bmQ6ICM5MEE0QUU7IH1cblxuLm1pLWR1YWwtY2hhcnQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gIGdhcDogNnB4O1xuICBoZWlnaHQ6IDE2MHB4O1xuICBwYWRkaW5nLXRvcDogOHB4O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI0VFRjJGNjtcbn1cbi5taS1kdWFsLWNoYXJ0LS10YWxsIHsgaGVpZ2h0OiAyMjBweDsgfVxuXG4ubWktZHVhbC1jb2wge1xuICBmbGV4OiAxIDEgMDtcbiAgbWluLXdpZHRoOiAwO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG4ubWktZHVhbC1jb2xfX2JhcnMge1xuICBmbGV4OiAxO1xuICB3aWR0aDogMTAwJTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZ2FwOiAycHg7XG59XG4ubWktZHVhbC1jb2xfX2JhciB7XG4gIHdpZHRoOiA0MiU7XG4gIG1heC13aWR0aDogMTZweDtcbiAgbWluLWhlaWdodDogMnB4O1xuICBib3JkZXItcmFkaXVzOiAycHggMnB4IDAgMDtcbn1cbi5taS1kdWFsLWNvbF9fYmFyLS13cml0dGVuIHsgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDE4MGRlZywgI0U1NzM3MywgI0M2MjgyOCk7IH1cbi5taS1kdWFsLWNvbF9fYmFyLS11bmRlciB7IGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNGRkI3NEQsICNDNjI4MjgpOyB9XG4ubWktZHVhbC1jb2xfX2Jhci0tdGFyZ2V0IHsgYmFja2dyb3VuZDogI0IwQkVDNTsgfVxuLm1pLWR1YWwtY29sX19sYWJlbCB7XG4gIGZvbnQtc2l6ZTogOXB4O1xuICBjb2xvcjogIzVCNUI1QjtcbiAgbWFyZ2luLXRvcDogNnB4O1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xufVxuXG4ubWktbWluaS10cmFjayB7XG4gIGhlaWdodDogNnB4O1xuICBiYWNrZ3JvdW5kOiAjRUVGMkY2O1xuICBib3JkZXItcmFkaXVzOiAzcHg7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIG1pbi13aWR0aDogODBweDtcbn1cbi5taS1taW5pLXRyYWNrIHNwYW4ge1xuICBkaXNwbGF5OiBibG9jaztcbiAgaGVpZ2h0OiAxMDAlO1xuICBtYXgtd2lkdGg6IDEwMCU7XG4gIGJhY2tncm91bmQ6ICNDNjI4Mjg7XG59XG4ubWktbWluaS10cmFjayBzcGFuLm9rIHsgYmFja2dyb3VuZDogIzFFNzE0NTsgfVxuLm1pLW1pbmktdHJhY2sgc3Bhbi5iYWQgeyBiYWNrZ3JvdW5kOiAjQzYyODI4OyB9XG5cbi5taS1yYW5rLXJvdyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogMTBweDtcbiAgcGFkZGluZzogMTBweCAwO1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI0YwRjBGMDtcbn1cbi5taS1yYW5rIHtcbiAgd2lkdGg6IDI4cHg7XG4gIGhlaWdodDogMjhweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBiYWNrZ3JvdW5kOiAjRUVGMkY2O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBmbGV4OiAwIDAgYXV0bztcbn1cbi5taS1yYW5rLS1nb2xkIHsgYmFja2dyb3VuZDogI0Y1RDc2RTsgfVxuLm1pLXJhbmstLXNpbHZlciB7IGJhY2tncm91bmQ6ICNDRkQ4REM7IH1cbi5taS1yYW5rLS1icm9uemUgeyBiYWNrZ3JvdW5kOiAjRTBCMDg5OyB9XG4ubWktcmFuay1yb3dfX2JvZHkgeyBmbGV4OiAxOyBtaW4td2lkdGg6IDA7IH1cbi5taS1yYW5rLXJvd19fdG9wIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBnYXA6IDhweDtcbiAgZm9udC1zaXplOiAxM3B4O1xufVxuLm1pLXJhbmstcm93X190cmFjayB7XG4gIG1hcmdpbjogNnB4IDAgNHB4O1xuICBoZWlnaHQ6IDhweDtcbiAgYmFja2dyb3VuZDogI0VFRjJGNjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuLm1pLXJhbmstcm93X190cmFjayBzcGFuIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGhlaWdodDogMTAwJTtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCAjMEIxRjMzLCAjQzYyODI4KTtcbn1cbi5taS1yYW5rLXJvd19fbWV0YSB7IGZvbnQtc2l6ZTogMTFweDsgY29sb3I6ICM1QjVCNUI7IH1cblxuLm1pLWhlYXQtd3JhcCB7IG92ZXJmbG93LXg6IGF1dG87IH1cblxuLm1pLWhlYXQge1xuICB3aWR0aDogMTAwJTtcbiAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcbiAgZm9udC1zaXplOiAxMnB4O1xufVxuLm1pLWhlYXQgdGgsIC5taS1oZWF0IHRkIHtcbiAgYm9yZGVyOiAxcHggc29saWQgI0UwRTBFMDtcbiAgcGFkZGluZzogOHB4IDEwcHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbWluLXdpZHRoOiA2NHB4O1xufVxuLm1pLWhlYXQgdGg6Zmlyc3QtY2hpbGQsIC5taS1oZWF0IHRkOmZpcnN0LWNoaWxkLFxuLm1pLWhlYXQgdGJvZHkgdGgge1xuICB0ZXh0LWFsaWduOiBsZWZ0O1xuICBiYWNrZ3JvdW5kOiAjRjdGOUZCO1xuICBmb250LXdlaWdodDogNzAwO1xufVxuLm1pLWhlYXRfX3RvdGFsIHsgZm9udC13ZWlnaHQ6IDcwMDsgYmFja2dyb3VuZDogI0Y3RjlGQjsgfVxuXG4ubWktaGVhdC0tMCB7IGJhY2tncm91bmQ6ICNGQUZBRkE7IGNvbG9yOiAjQkRCREJEOyB9XG4ubWktaGVhdC0tMSB7IGJhY2tncm91bmQ6ICNGRkVDQjM7IH1cbi5taS1oZWF0LS0yIHsgYmFja2dyb3VuZDogI0ZGQ0M4MDsgfVxuLm1pLWhlYXQtLTMgeyBiYWNrZ3JvdW5kOiAjRkY4QTY1OyBjb2xvcjogI2ZmZjsgfVxuLm1pLWhlYXQtLTQgeyBiYWNrZ3JvdW5kOiAjQzYyODI4OyBjb2xvcjogI2ZmZjsgfVxuXG4ubWktaGVhdC1sZWdlbmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDZweDtcbiAgbWFyZ2luLXRvcDogMTBweDtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBjb2xvcjogIzVCNUI1Qjtcbn1cbi5taS1oZWF0LWxlZ2VuZCBpIHtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICB3aWR0aDogMThweDtcbiAgaGVpZ2h0OiAxMnB4O1xuICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xufVxuXG4ubWktbHItZ3JpZCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDIyMHB4LCAxZnIpKTtcbiAgZ2FwOiAxMnB4O1xufVxuXG4ubWktbHItY2FyZCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogMTJweDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYXBleC1ib3JkZXIsICNDOEM4QzgpO1xuICBwYWRkaW5nOiAxMnB4O1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xufVxuLm1pLWxyLWNhcmQtLW9rIHsgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCAjMUU3MTQ1OyB9XG4ubWktbHItY2FyZC0tYmFkIHsgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCAjQzYyODI4OyB9XG5cbi5taS1sci1nYXVnZSB7IHdpZHRoOiA3MnB4OyBoZWlnaHQ6IDcycHg7IGZsZXg6IDAgMCBhdXRvOyB9XG4ubWktZ2F1Z2VfX3RyYWNrIHsgZmlsbDogbm9uZTsgc3Ryb2tlOiAjRUVGMkY2OyBzdHJva2Utd2lkdGg6IDg7IH1cbi5taS1nYXVnZV9fdmFsdWUge1xuICBmaWxsOiBub25lO1xuICBzdHJva2U6ICNDNjI4Mjg7XG4gIHN0cm9rZS13aWR0aDogODtcbiAgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kO1xufVxuLm1pLWxyLWNhcmQtLW9rIC5taS1nYXVnZV9fdmFsdWUgeyBzdHJva2U6ICMxRTcxNDU7IH1cbi5taS1nYXVnZV9fcGN0IHtcbiAgZm9udC1zaXplOiAxMnB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBmaWxsOiAjMEIxRjMzO1xufVxuXG4uYXBleC1tdC0xNiB7IG1hcmdpbi10b3A6IDE2cHg7IH1cbi5hcGV4LXRleHQtc3VjY2VzcyB7IGNvbG9yOiAjMUU3MTQ1OyBmb250LXdlaWdodDogNjAwOyB9XG4uYXBleC10ZXh0LWRhbmdlciB7IGNvbG9yOiAjQzYyODI4OyBmb250LXdlaWdodDogNjAwOyB9XG4iXX0= */");

/***/ }),

/***/ "./src/app/features/reporting/reporting.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/features/reporting/reporting.component.ts ***!
  \***********************************************************/
/*! exports provided: ReportingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportingComponent", function() { return ReportingComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _reporting_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reporting.service */ "./src/app/features/reporting/reporting.service.ts");
/* harmony import */ var _shared_csv_export_util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/csv-export.util */ "./src/app/shared/csv-export.util.ts");





function isoDate(d) {
    return d.toISOString().slice(0, 10);
}
let ReportingComponent = class ReportingComponent {
    constructor(reportingService) {
        this.reportingService = reportingService;
        this.activeTab = 'premium';
        this.loading = true;
        this.error = null;
        this.fromDate = isoDate(new Date(new Date().getFullYear(), 0, 1));
        this.toDate = isoDate(new Date());
        this.period = 'ytd';
        this.premiumVsTarget = [];
        this.brokerLeague = [];
        this.pipeline = [];
        this.lossRatioRows = [];
        this.catalog = [
            { id: 'premium', title: 'Premium vs Target', blurb: 'Monthly written vs plan with variance' },
            { id: 'league', title: 'Broker League', blurb: 'GWP, hit ratio and production rank' },
            { id: 'pipeline', title: 'Pipeline Aging', blurb: 'Status × age-bucket heat map' },
            { id: 'lossRatio', title: 'Loss Ratio', blurb: 'Incurred vs earned by LOB' }
        ];
    }
    ngOnInit() {
        this.load();
    }
    setTab(tab) {
        this.activeTab = tab;
    }
    applyPeriod(period) {
        this.period = period;
        const now = new Date();
        this.toDate = isoDate(now);
        if (period === 'mtd') {
            this.fromDate = isoDate(new Date(now.getFullYear(), now.getMonth(), 1));
        }
        else if (period === 'qtd') {
            const q = Math.floor(now.getMonth() / 3) * 3;
            this.fromDate = isoDate(new Date(now.getFullYear(), q, 1));
        }
        else if (period === '12m') {
            this.fromDate = isoDate(new Date(now.getFullYear(), now.getMonth() - 11, 1));
        }
        else {
            this.fromDate = isoDate(new Date(now.getFullYear(), 0, 1));
        }
        this.load();
    }
    applyDateFilter() {
        this.period = 'custom';
        this.load();
    }
    load() {
        this.loading = true;
        this.error = null;
        Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["forkJoin"])([
            this.reportingService.getPremiumVsTarget(this.fromDate, this.toDate),
            this.reportingService.getBrokerLeague(this.fromDate, this.toDate),
            this.reportingService.getPipeline(),
            this.reportingService.getLossRatio(this.fromDate, this.toDate)
        ]).subscribe(([premium, league, pipeline, lossRatio]) => {
            this.premiumVsTarget = premium || [];
            this.brokerLeague = league || [];
            this.pipeline = pipeline || [];
            this.lossRatioRows = lossRatio || [];
            this.loading = false;
        }, (err) => {
            this.error = err.message;
            this.loading = false;
        });
    }
    get premiumWrittenTotal() {
        return this.premiumVsTarget.reduce((s, r) => s + (r.premiumWritten || 0), 0);
    }
    get premiumTargetTotal() {
        return this.premiumVsTarget.reduce((s, r) => s + (r.target || 0), 0);
    }
    get premiumVariancePct() {
        if (!this.premiumTargetTotal) {
            return 0;
        }
        return ((this.premiumWrittenTotal - this.premiumTargetTotal) / this.premiumTargetTotal) * 100;
    }
    get pipelineTotal() {
        return this.pipeline.reduce((s, r) => s + (r.count || 0), 0);
    }
    get leagueGwpTotal() {
        return this.brokerLeague.reduce((s, r) => s + (r.grossWrittenPremium || 0), 0);
    }
    get avgLossRatio() {
        if (!this.lossRatioRows.length) {
            return 0;
        }
        const earned = this.lossRatioRows.reduce((s, r) => s + (r.earnedPremium || 0), 0);
        const incurred = this.lossRatioRows.reduce((s, r) => s + (r.incurredLosses || 0), 0);
        return earned > 0 ? (incurred / earned) * 100 : 0;
    }
    maxPremium() {
        return Math.max(1, ...this.premiumVsTarget.map(r => Math.max(r.premiumWritten || 0, r.target || 0)));
    }
    writtenHeight(r) {
        return Math.round(((r.premiumWritten || 0) / this.maxPremium()) * 100) + '%';
    }
    targetHeight(r) {
        return Math.round(((r.target || 0) / this.maxPremium()) * 100) + '%';
    }
    maxLeagueGwp() {
        return Math.max(1, ...this.brokerLeague.map(r => r.grossWrittenPremium || 0));
    }
    leagueBar(r) {
        return Math.round(((r.grossWrittenPremium || 0) / this.maxLeagueGwp()) * 100) + '%';
    }
    get agingStatuses() {
        const set = {};
        this.pipeline.forEach(r => { set[r.status] = true; });
        return Object.keys(set);
    }
    get agingBuckets() {
        const order = ['0-7', '8-14', '15-30', '31-60', '61+', '0-7 days', '8-14 days', '15-30 days', '31-60 days', '61+ days'];
        const set = {};
        this.pipeline.forEach(r => { set[r.ageBucket] = true; });
        const keys = Object.keys(set);
        keys.sort((a, b) => {
            const ia = order.indexOf(a);
            const ib = order.indexOf(b);
            if (ia >= 0 && ib >= 0) {
                return ia - ib;
            }
            return a.localeCompare(b);
        });
        return keys;
    }
    agingCount(status, bucket) {
        const row = this.pipeline.find(r => r.status === status && r.ageBucket === bucket);
        return row ? row.count : 0;
    }
    rowTotal(status) {
        return this.pipeline
            .filter(r => r.status === status)
            .reduce((sum, r) => sum + (r.count || 0), 0);
    }
    maxAging() {
        return Math.max(1, ...this.pipeline.map(r => r.count || 0));
    }
    heatClass(count) {
        if (!count) {
            return 'mi-heat--0';
        }
        const pct = count / this.maxAging();
        if (pct > 0.75) {
            return 'mi-heat--4';
        }
        if (pct > 0.5) {
            return 'mi-heat--3';
        }
        if (pct > 0.25) {
            return 'mi-heat--2';
        }
        return 'mi-heat--1';
    }
    lrGauge(row) {
        const pct = Math.max(0, Math.min(100, row.lossRatioPercent || 0));
        const circ = 2 * Math.PI * 36;
        const filled = (pct / 100) * circ;
        return filled + ' ' + (circ - filled);
    }
    exportCurrentTab() {
        switch (this.activeTab) {
            case 'premium':
                window.open(this.reportingService.premiumVsTargetExportUrl(this.fromDate, this.toDate), '_blank');
                break;
            case 'league':
                window.open(this.reportingService.brokerLeagueExportUrl(this.fromDate, this.toDate), '_blank');
                break;
            case 'pipeline':
                Object(_shared_csv_export_util__WEBPACK_IMPORTED_MODULE_4__["exportToCsv"])('pipeline-aging.csv', this.pipeline);
                break;
            case 'lossRatio':
                Object(_shared_csv_export_util__WEBPACK_IMPORTED_MODULE_4__["exportToCsv"])('loss-ratio.csv', this.lossRatioRows);
                break;
        }
    }
    currentRowCount() {
        switch (this.activeTab) {
            case 'premium': return this.premiumVsTarget.length;
            case 'league': return this.brokerLeague.length;
            case 'pipeline': return this.pipeline.length;
            case 'lossRatio': return this.lossRatioRows.length;
            default: return 0;
        }
    }
};
ReportingComponent.ctorParameters = () => [
    { type: _reporting_service__WEBPACK_IMPORTED_MODULE_3__["ReportingService"] }
];
ReportingComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'apex-reporting',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./reporting.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/features/reporting/reporting.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./reporting.component.css */ "./src/app/features/reporting/reporting.component.css")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_reporting_service__WEBPACK_IMPORTED_MODULE_3__["ReportingService"]])
], ReportingComponent);



/***/ }),

/***/ "./src/app/features/reporting/reporting.module.ts":
/*!********************************************************!*\
  !*** ./src/app/features/reporting/reporting.module.ts ***!
  \********************************************************/
/*! exports provided: ReportingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportingModule", function() { return ReportingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _reporting_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./reporting-routing.module */ "./src/app/features/reporting/reporting-routing.module.ts");
/* harmony import */ var _reporting_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./reporting.component */ "./src/app/features/reporting/reporting.component.ts");





let ReportingModule = class ReportingModule {
};
ReportingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [_reporting_component__WEBPACK_IMPORTED_MODULE_4__["ReportingComponent"]],
        imports: [_shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"], _reporting_routing_module__WEBPACK_IMPORTED_MODULE_3__["ReportingRoutingModule"]]
    })
], ReportingModule);



/***/ }),

/***/ "./src/app/features/reporting/reporting.service.ts":
/*!*********************************************************!*\
  !*** ./src/app/features/reporting/reporting.service.ts ***!
  \*********************************************************/
/*! exports provided: ReportingService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReportingService", function() { return ReportingService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _core_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/api.service */ "./src/app/core/api.service.ts");



let ReportingService = class ReportingService {
    constructor(api) {
        this.api = api;
    }
    getPremiumVsTarget(fromDate, toDate) {
        return this.api.get('/reports/premium-vs-target', { fromDate, toDate });
    }
    getBrokerLeague(fromDate, toDate, top = 20) {
        return this.api.get('/reports/broker-league', { fromDate, toDate, top });
    }
    getPipeline() {
        return this.api.get('/reports/pipeline');
    }
    getLossRatio(fromDate, toDate) {
        return this.api.get('/reports/loss-ratio', { fromDate, toDate });
    }
    premiumVsTargetExportUrl(fromDate, toDate) {
        return `${this.api.baseUrl}/reports/premium-vs-target/export?fromDate=${fromDate}&toDate=${toDate}`;
    }
    brokerLeagueExportUrl(fromDate, toDate) {
        return `${this.api.baseUrl}/reports/broker-league/export?fromDate=${fromDate}&toDate=${toDate}`;
    }
};
ReportingService.ctorParameters = () => [
    { type: _core_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"] }
];
ReportingService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_core_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"]])
], ReportingService);



/***/ }),

/***/ "./src/app/shared/csv-export.util.ts":
/*!*******************************************!*\
  !*** ./src/app/shared/csv-export.util.ts ***!
  \*******************************************/
/*! exports provided: exportToCsv */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exportToCsv", function() { return exportToCsv; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

/**
 * Minimal client-side CSV export used by the Reporting module's "Export CSV"
 * buttons. Avoids pulling in a library for what is a handful of rows.
 */
function exportToCsv(filename, rows) {
    if (!rows || rows.length === 0) {
        return;
    }
    const headers = Object.keys(rows[0]);
    const escapeCell = (value) => {
        const str = value === null || value === undefined ? '' : String(value);
        if (/[",\n]/.test(str)) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    };
    const lines = [
        headers.join(','),
        ...rows.map(row => headers.map(h => escapeCell(row[h])).join(','))
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


/***/ })

}]);
//# sourceMappingURL=features-reporting-reporting-module.js.map