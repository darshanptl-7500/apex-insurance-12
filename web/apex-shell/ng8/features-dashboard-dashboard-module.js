(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["features-dashboard-dashboard-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/features/dashboard/dashboard.component.html":
/*!***************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/features/dashboard/dashboard.component.html ***!
  \***************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"mi-page\">\n  <div class=\"apex-page-header\">\n    <div class=\"apex-page-header__title\">\n      <h1>Underwriting Dashboard</h1>\n      <div class=\"apex-page-header__subtitle\">\n        Live queues · production vs target · broker MI · workbench pulse\n      </div>\n    </div>\n    <div class=\"apex-page-header__actions mi-period\">\n      <div class=\"mi-period__pills\">\n        <button type=\"button\" class=\"mi-pill\" [class.active]=\"period==='mtd'\" (click)=\"applyPeriod('mtd')\">MTD</button>\n        <button type=\"button\" class=\"mi-pill\" [class.active]=\"period==='qtd'\" (click)=\"applyPeriod('qtd')\">QTD</button>\n        <button type=\"button\" class=\"mi-pill\" [class.active]=\"period==='ytd'\" (click)=\"applyPeriod('ytd')\">YTD</button>\n        <button type=\"button\" class=\"mi-pill\" [class.active]=\"period==='12m'\" (click)=\"applyPeriod('12m')\">12M</button>\n      </div>\n      <button type=\"button\" class=\"apex-btn apex-btn--ghost apex-btn--sm\" (click)=\"load()\">Refresh</button>\n    </div>\n  </div>\n\n  <apex-loading *ngIf=\"loading\" label=\"Building dashboard…\"></apex-loading>\n  <div class=\"apex-alert apex-alert--danger\" *ngIf=\"error && !loading\">{{ error }}</div>\n\n  <div class=\"mi-layout\" *ngIf=\"!loading && !error && summary\">\n    <div class=\"mi-main\">\n      <!-- Hero KPI strip -->\n      <div class=\"mi-hero\">\n        <div class=\"mi-gauge-card\">\n          <svg class=\"mi-gauge\" viewBox=\"0 0 100 100\" aria-hidden=\"true\">\n            <circle cx=\"50\" cy=\"50\" r=\"42\" class=\"mi-gauge__track\"></circle>\n            <circle cx=\"50\" cy=\"50\" r=\"42\" class=\"mi-gauge__value\"\n                    [attr.stroke-dasharray]=\"gaugeDash\"\n                    transform=\"rotate(-90 50 50)\"></circle>\n            <text x=\"50\" y=\"48\" text-anchor=\"middle\" class=\"mi-gauge__pct\">{{ targetPct | number:'1.0-1' }}%</text>\n            <text x=\"50\" y=\"62\" text-anchor=\"middle\" class=\"mi-gauge__cap\">of target</text>\n          </svg>\n          <div class=\"mi-gauge-card__meta\">\n            <div class=\"mi-gauge-card__label\">Premium written</div>\n            <div class=\"mi-gauge-card__value\">{{ kpis.premiumWritten | currency:'GBP':'symbol':'1.0-0' }}</div>\n            <div class=\"mi-gauge-card__sub\">Target {{ kpis.premiumTarget | currency:'GBP':'symbol':'1.0-0' }} · {{ fromDate }} → {{ toDate }}</div>\n          </div>\n        </div>\n\n        <div class=\"mi-kpi-grid\">\n          <div class=\"mi-kpi\">\n            <div class=\"mi-kpi__label\">Hit ratio</div>\n            <div class=\"mi-kpi__value\">{{ kpis.hitRatio | number:'1.0-1' }}%</div>\n            <div class=\"mi-kpi__bar\"><span [style.width]=\"kpis.hitRatio + '%'\"></span></div>\n          </div>\n          <div class=\"mi-kpi\">\n            <div class=\"mi-kpi__label\">Avg turnaround</div>\n            <div class=\"mi-kpi__value\">{{ kpis.averageTurnaroundDays | number:'1.0-1' }}<small>d</small></div>\n            <div class=\"mi-kpi__sub\">Quote / bind cycle</div>\n          </div>\n          <div class=\"mi-kpi\">\n            <div class=\"mi-kpi__label\">Bound</div>\n            <div class=\"mi-kpi__value mi-kpi__value--ok\">{{ kpis.boundCount }}</div>\n            <div class=\"mi-kpi__sub\">{{ kpis.declinedCount }} declined / NTU</div>\n          </div>\n          <div class=\"mi-kpi\" *ngIf=\"concentration\">\n            <div class=\"mi-kpi__label\">Portfolio SI</div>\n            <div class=\"mi-kpi__value\">{{ concentration.totalSumInsured | currency:'GBP':'symbol':'1.0-0' }}</div>\n            <div class=\"mi-kpi__sub\">Top LOB {{ concentration.topLob || '—' }} · {{ concentration.topLobSharePercent | number:'1.0-0' }}%</div>\n          </div>\n        </div>\n      </div>\n\n      <!-- Workbench pulse -->\n      <div class=\"mi-section-title\">Workbench pulse</div>\n      <div class=\"mi-pulse\">\n        <a class=\"mi-pulse__tile\" *ngFor=\"let t of pulseTiles\" [href]=\"t.href\" [ngClass]=\"'mi-pulse__tile--' + t.tone\">\n          <span class=\"mi-pulse__count\">{{ t.count > 99 ? '99+' : t.count }}</span>\n          <span class=\"mi-pulse__label\">{{ t.label }}</span>\n        </a>\n      </div>\n\n      <!-- Premium trajectory -->\n      <div class=\"apex-card mi-card\">\n        <div class=\"apex-card__header\">\n          <h3>Premium vs target</h3>\n          <a class=\"apex-btn apex-btn--ghost apex-btn--sm\" href=\"/ng8/reporting\">Open Reporting</a>\n        </div>\n        <div class=\"mi-legend\">\n          <span><i class=\"mi-swatch mi-swatch--written\"></i> Written</span>\n          <span><i class=\"mi-swatch mi-swatch--target\"></i> Target</span>\n        </div>\n        <div class=\"mi-dual-chart\" *ngIf=\"recentTrend.length\">\n          <div class=\"mi-dual-col\" *ngFor=\"let r of recentTrend\">\n            <div class=\"mi-dual-col__bars\">\n              <div class=\"mi-dual-col__bar mi-dual-col__bar--target\" [style.height]=\"trendTargetHeight(r)\" title=\"Target\"></div>\n              <div class=\"mi-dual-col__bar mi-dual-col__bar--written\" [style.height]=\"trendWrittenHeight(r)\" title=\"Written\"></div>\n            </div>\n            <div class=\"mi-dual-col__label\">{{ r.periodLabel }}</div>\n          </div>\n        </div>\n        <apex-empty-state *ngIf=\"!recentTrend.length\" title=\"No premium series\"\n                           message=\"Premium vs target will appear once bound policies exist in range.\"></apex-empty-state>\n      </div>\n\n      <!-- Broker production -->\n      <div class=\"apex-card mi-card\">\n        <div class=\"apex-card__header\"><h3>Broker production</h3></div>\n        <apex-empty-state *ngIf=\"!topBrokers.length\" title=\"No broker activity\"\n                           message=\"Broker GWP appears after submissions are received.\"></apex-empty-state>\n        <div *ngIf=\"topBrokers.length\">\n          <div class=\"mi-rank-row\" *ngFor=\"let b of topBrokers; let i = index\">\n            <div class=\"mi-rank\" [ngClass]=\"{'mi-rank--gold': i===0, 'mi-rank--silver': i===1, 'mi-rank--bronze': i===2}\">{{ i + 1 }}</div>\n            <div class=\"mi-rank-row__body\">\n              <div class=\"mi-rank-row__top\">\n                <strong>{{ b.brokerName }}</strong>\n                <span>{{ b.grossWrittenPremium | currency:'GBP':'symbol':'1.0-0' }}</span>\n              </div>\n              <div class=\"mi-rank-row__track\"><span [style.width]=\"brokerBarWidth(b)\"></span></div>\n              <div class=\"mi-rank-row__meta\">\n                {{ b.submissionCount }} subs · {{ b.quoteCount }} quotes · {{ b.boundCount }} bound · hit {{ b.hitRatio | number:'1.0-0' }}%\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <!-- Right rail from top — Quick links first so always above the fold -->\n    <aside class=\"mi-side\">\n      <div class=\"apex-card mi-card mi-actions\">\n        <div class=\"apex-card__header\"><h3>Quick links</h3></div>\n        <a class=\"apex-btn apex-btn--sm\" [href]=\"auth.shellUrl('/pipeline/upcoming')\">Pipeline</a>\n        <a class=\"apex-btn apex-btn--sm\" [href]=\"auth.shellUrl('/inbox')\">Tasks</a>\n        <a class=\"apex-btn apex-btn--sm\" href=\"/ng8/case-hub\">Underwriter's File</a>\n        <a class=\"apex-btn apex-btn--sm\" href=\"/ng8/reporting\">Reporting &amp; MI</a>\n        <a class=\"apex-btn apex-btn--sm apex-btn--danger\" [href]=\"auth.shellUrl('/submissions/new')\">+ New risk</a>\n      </div>\n\n      <div class=\"apex-card mi-card\">\n        <div class=\"apex-card__header\"><h3>Needs attention</h3></div>\n        <a class=\"mi-attn\" *ngFor=\"let a of attentionItems\" [href]=\"a.href\" [ngClass]=\"'mi-attn--' + a.tone\">\n          <strong>{{ a.label }}</strong>\n          <span>{{ a.detail }}</span>\n        </a>\n      </div>\n\n      <div class=\"apex-card mi-card\">\n        <div class=\"apex-card__header\"><h3>UW queues</h3></div>\n        <div class=\"mi-queue\" *ngFor=\"let q of queueTiles\">\n          <a class=\"mi-queue__head\" [href]=\"q.href\">\n            <span>{{ q.label }}</span>\n            <strong [ngClass]=\"'mi-queue__count--' + q.tone\">{{ q.count }}</strong>\n          </a>\n          <div class=\"mi-queue__track\">\n            <span [style.width]=\"queueBarWidth(q)\" [ngClass]=\"'mi-queue__fill--' + q.tone\"></span>\n          </div>\n        </div>\n      </div>\n    </aside>\n  </div>\n</div>\n");

/***/ }),

/***/ "./src/app/features/dashboard/dashboard-routing.module.ts":
/*!****************************************************************!*\
  !*** ./src/app/features/dashboard/dashboard-routing.module.ts ***!
  \****************************************************************/
/*! exports provided: DashboardRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardRoutingModule", function() { return DashboardRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _dashboard_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dashboard.component */ "./src/app/features/dashboard/dashboard.component.ts");




const routes = [
    { path: '', component: _dashboard_component__WEBPACK_IMPORTED_MODULE_3__["DashboardComponent"] }
];
let DashboardRoutingModule = class DashboardRoutingModule {
};
DashboardRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })
], DashboardRoutingModule);



/***/ }),

/***/ "./src/app/features/dashboard/dashboard.component.css":
/*!************************************************************!*\
  !*** ./src/app/features/dashboard/dashboard.component.css ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (":host {\n  display: block;\n  width: 100%;\n}\n\n.mi-page {\n  width: 100%;\n  max-width: none;\n  box-sizing: border-box;\n}\n\n.mi-period {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex-wrap: wrap;\n}\n\n.mi-period__pills {\n  display: inline-flex;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  background: #fff;\n}\n\n.mi-pill {\n  border: 0;\n  background: transparent;\n  padding: 6px 12px;\n  font-size: 12px;\n  font-weight: 700;\n  cursor: pointer;\n  color: #555;\n}\n\n.mi-pill.active {\n  background: var(--apex-uw-red, #C62828);\n  color: #fff;\n}\n\n.mi-hero {\n  display: grid;\n  grid-template-columns: minmax(260px, 340px) 1fr;\n  gap: 14px;\n  margin-bottom: 18px;\n}\n\n@media (max-width: 900px) {\n  .mi-hero { grid-template-columns: 1fr; }\n}\n\n.mi-gauge-card {\n  background: #fff;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  padding: 16px;\n  display: flex;\n  gap: 14px;\n  align-items: center;\n}\n\n.mi-gauge { width: 110px; height: 110px; flex: 0 0 auto; }\n\n.mi-gauge__track { fill: none; stroke: #EEF2F6; stroke-width: 8; }\n\n.mi-gauge__value {\n  fill: none;\n  stroke: var(--apex-uw-red, #C62828);\n  stroke-width: 8;\n  stroke-linecap: round;\n  transition: stroke-dasharray 0.4s ease;\n}\n\n.mi-gauge__pct {\n  font-size: 14px;\n  font-weight: 700;\n  fill: #0B1F33;\n  font-family: 'Libre Baskerville', Georgia, serif;\n}\n\n.mi-gauge__cap { font-size: 7px; fill: #5B5B5B; text-transform: uppercase; }\n\n.mi-gauge-card__label {\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  color: #5B5B5B;\n}\n\n.mi-gauge-card__value {\n  font-size: 26px;\n  font-weight: 700;\n  font-family: 'Libre Baskerville', Georgia, serif;\n  color: #0B1F33;\n}\n\n.mi-gauge-card__sub { font-size: 11px; color: #5B5B5B; margin-top: 4px; }\n\n.mi-kpi-grid {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 10px;\n}\n\n.mi-kpi {\n  background: #fff;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  border-left: 3px solid #0B1F33;\n  padding: 12px 14px;\n}\n\n.mi-kpi__label {\n  font-size: 11px;\n  font-weight: 700;\n  text-transform: uppercase;\n  color: #5B5B5B;\n  letter-spacing: 0.04em;\n}\n\n.mi-kpi__value {\n  font-size: 22px;\n  font-weight: 700;\n  font-family: 'Libre Baskerville', Georgia, serif;\n  margin-top: 4px;\n}\n\n.mi-kpi__value small { font-size: 14px; margin-left: 2px; }\n\n.mi-kpi__value--ok { color: #1E7145; }\n\n.mi-kpi__sub { font-size: 11px; color: #5B5B5B; margin-top: 4px; }\n\n.mi-kpi__bar {\n  margin-top: 8px;\n  height: 6px;\n  background: #EEF2F6;\n  border-radius: 4px;\n  overflow: hidden;\n}\n\n.mi-kpi__bar span {\n  display: block;\n  height: 100%;\n  background: linear-gradient(90deg, #C62828, #E57373);\n}\n\n.mi-section-title {\n  font-size: 12px;\n  font-weight: 700;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  color: #5B5B5B;\n  margin: 4px 0 8px;\n}\n\n.mi-pulse {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 8px;\n  margin-bottom: 2px;\n}\n\n@media (max-width: 1100px) {\n  .mi-pulse { grid-template-columns: repeat(4, 1fr); }\n}\n\n@media (max-width: 640px) {\n  .mi-pulse { grid-template-columns: repeat(2, 1fr); }\n}\n\n.mi-pulse__tile {\n  background: #fff;\n  border: 1px solid var(--apex-border, #C8C8C8);\n  padding: 12px 10px;\n  text-decoration: none;\n  color: inherit;\n  text-align: center;\n  transition: border-color 0.15s, box-shadow 0.15s;\n}\n\n.mi-pulse__tile:hover {\n  border-color: #C62828;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.06);\n}\n\n.mi-pulse__count {\n  display: block;\n  font-size: 22px;\n  font-weight: 700;\n  font-family: 'Libre Baskerville', Georgia, serif;\n}\n\n.mi-pulse__label { font-size: 11px; color: #5B5B5B; font-weight: 600; }\n\n.mi-pulse__tile--danger .mi-pulse__count { color: #C62828; }\n\n.mi-pulse__tile--warn .mi-pulse__count { color: #9A6400; }\n\n.mi-pulse__tile--ok .mi-pulse__count { color: #1E7145; }\n\n.mi-layout {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) 280px;\n  gap: 14px;\n  align-items: start;\n  width: 100%;\n  margin-top: 4px;\n}\n\n@media (max-width: 720px) {\n  .mi-layout {\n    grid-template-columns: 1fr;\n  }\n\n  .mi-side {\n    position: static;\n    order: -1; /* links still appear first on narrow screens */\n  }\n}\n\n.mi-main {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n  min-width: 0;\n}\n\n.mi-side {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  min-width: 0;\n  position: -webkit-sticky;\n  position: sticky;\n  top: 12px;\n  align-self: start;\n  max-height: calc(100vh - 24px);\n  overflow-y: auto;\n}\n\n.mi-card { margin: 0; }\n\n.mi-actions .apex-btn {\n  display: block;\n  width: 100%;\n  margin-bottom: 6px;\n  text-align: center;\n}\n\n.mi-legend {\n  display: flex;\n  gap: 14px;\n  font-size: 11px;\n  color: #5B5B5B;\n  margin-bottom: 10px;\n}\n\n.mi-swatch {\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  margin-right: 4px;\n  vertical-align: middle;\n}\n\n.mi-swatch--written { background: #C62828; }\n\n.mi-swatch--target { background: #90A4AE; }\n\n.mi-dual-chart {\n  display: flex;\n  align-items: flex-end;\n  gap: 8px;\n  height: 180px;\n  padding: 8px 4px 0;\n  border-bottom: 1px solid #EEF2F6;\n}\n\n.mi-dual-col {\n  flex: 1 1 0;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  height: 100%;\n}\n\n.mi-dual-col__bars {\n  flex: 1;\n  width: 100%;\n  display: flex;\n  align-items: flex-end;\n  justify-content: center;\n  gap: 3px;\n}\n\n.mi-dual-col__bar {\n  width: 40%;\n  max-width: 18px;\n  min-height: 2px;\n  border-radius: 2px 2px 0 0;\n}\n\n.mi-dual-col__bar--written { background: linear-gradient(180deg, #E57373, #C62828); }\n\n.mi-dual-col__bar--target { background: #B0BEC5; }\n\n.mi-dual-col__label {\n  font-size: 9px;\n  color: #5B5B5B;\n  margin-top: 6px;\n  text-align: center;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  max-width: 100%;\n}\n\n.mi-rank-row {\n  display: flex;\n  gap: 10px;\n  padding: 10px 0;\n  border-bottom: 1px solid #F0F0F0;\n}\n\n.mi-rank-row:last-child { border-bottom: 0; }\n\n.mi-rank {\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  background: #EEF2F6;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 12px;\n  font-weight: 700;\n  flex: 0 0 auto;\n}\n\n.mi-rank--gold { background: #F5D76E; }\n\n.mi-rank--silver { background: #CFD8DC; }\n\n.mi-rank--bronze { background: #E0B089; }\n\n.mi-rank-row__body { flex: 1; min-width: 0; }\n\n.mi-rank-row__top {\n  display: flex;\n  justify-content: space-between;\n  gap: 8px;\n  font-size: 13px;\n}\n\n.mi-rank-row__track {\n  margin: 6px 0 4px;\n  height: 8px;\n  background: #EEF2F6;\n  border-radius: 4px;\n  overflow: hidden;\n}\n\n.mi-rank-row__track span {\n  display: block;\n  height: 100%;\n  background: linear-gradient(90deg, #0B1F33, #C62828);\n}\n\n.mi-rank-row__meta { font-size: 11px; color: #5B5B5B; }\n\n.mi-attn {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding: 10px 12px;\n  margin-bottom: 8px;\n  text-decoration: none;\n  color: inherit;\n  border-left: 3px solid #90A4AE;\n  background: #F7F9FB;\n}\n\n.mi-attn--danger { border-left-color: #C62828; background: #FFF5F5; }\n\n.mi-attn--warn { border-left-color: #F9A825; background: #FFFBF0; }\n\n.mi-attn--ok { border-left-color: #1E7145; background: #F1F8F4; }\n\n.mi-attn strong { font-size: 13px; }\n\n.mi-attn span { font-size: 12px; color: #5B5B5B; }\n\n.mi-queue { margin-bottom: 12px; }\n\n.mi-queue__head {\n  display: flex;\n  justify-content: space-between;\n  font-size: 12px;\n  text-decoration: none;\n  color: inherit;\n  margin-bottom: 4px;\n}\n\n.mi-queue__count--danger { color: #C62828; }\n\n.mi-queue__count--warn { color: #9A6400; }\n\n.mi-queue__count--ok { color: #1E7145; }\n\n.mi-queue__track {\n  height: 6px;\n  background: #EEF2F6;\n  border-radius: 3px;\n  overflow: hidden;\n}\n\n.mi-queue__track span { display: block; height: 100%; background: #0B1F33; }\n\n.mi-queue__fill--danger { background: #C62828 !important; }\n\n.mi-queue__fill--warn { background: #F9A825 !important; }\n\n.mi-queue__fill--ok { background: #1E7145 !important; }\n\n.mi-actions .apex-btn {\n  display: block;\n  width: 100%;\n  margin-bottom: 6px;\n  text-align: center;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZmVhdHVyZXMvZGFzaGJvYXJkL2Rhc2hib2FyZC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsY0FBYztFQUNkLFdBQVc7QUFDYjs7QUFFQTtFQUNFLFdBQVc7RUFDWCxlQUFlO0VBQ2Ysc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixTQUFTO0VBQ1QsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLG9CQUFvQjtFQUNwQiw2Q0FBNkM7RUFDN0MsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsU0FBUztFQUNULHVCQUF1QjtFQUN2QixpQkFBaUI7RUFDakIsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixlQUFlO0VBQ2YsV0FBVztBQUNiOztBQUVBO0VBQ0UsdUNBQXVDO0VBQ3ZDLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGFBQWE7RUFDYiwrQ0FBK0M7RUFDL0MsU0FBUztFQUNULG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLFdBQVcsMEJBQTBCLEVBQUU7QUFDekM7O0FBRUE7RUFDRSxnQkFBZ0I7RUFDaEIsNkNBQTZDO0VBQzdDLGFBQWE7RUFDYixhQUFhO0VBQ2IsU0FBUztFQUNULG1CQUFtQjtBQUNyQjs7QUFFQSxZQUFZLFlBQVksRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFOztBQUN6RCxtQkFBbUIsVUFBVSxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUU7O0FBQ2pFO0VBQ0UsVUFBVTtFQUNWLG1DQUFtQztFQUNuQyxlQUFlO0VBQ2YscUJBQXFCO0VBQ3JCLHNDQUFzQztBQUN4Qzs7QUFDQTtFQUNFLGVBQWU7RUFDZixnQkFBZ0I7RUFDaEIsYUFBYTtFQUNiLGdEQUFnRDtBQUNsRDs7QUFDQSxpQkFBaUIsY0FBYyxFQUFFLGFBQWEsRUFBRSx5QkFBeUIsRUFBRTs7QUFFM0U7RUFDRSxlQUFlO0VBQ2YsZ0JBQWdCO0VBQ2hCLHlCQUF5QjtFQUN6QixzQkFBc0I7RUFDdEIsY0FBYztB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QWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixxQkFBcUI7RUFDckIsY0FBYztFQUNkLDhCQUE4QjtFQUM5QixtQkFBbUI7QUFDckI7O0FBQ0EsbUJBQW1CLDBCQUEwQixFQUFFLG1CQUFtQixFQUFFOztBQUNwRSxpQkFBaUIsMEJBQTBCLEVBQUUsbUJBQW1CLEVBQUU7O0FBQ2xFLGVBQWUsMEJBQTBCLEVBQUUsbUJBQW1CLEVBQUU7O0FBQ2hFLGtCQUFrQixlQUFlLEVBQUU7O0FBQ25DLGdCQUFnQixlQUFlLEVBQUUsY0FBYyxFQUFFOztBQUVqRCxZQUFZLG1CQUFtQixFQUFFOztBQUNqQztFQUNFLGFBQWE7RUFDYiw4QkFBOEI7RUFDOUIsZUFBZTtFQUNmLHFCQUFxQjtFQUNyQixjQUFjO0VBQ2Qsa0JBQWtCO0FBQ3BCOztBQUNBLDJCQUEyQixjQUFjLEVBQUU7O0FBQzNDLHlCQUF5QixjQUFjLEVBQUU7O0FBQ3pDLHVCQUF1QixjQUFjLEVBQUU7O0FBQ3ZDO0VBQ0UsV0FBVztFQUNYLG1CQUFtQjtFQUNuQixrQkFBa0I7RUFDbEIsZ0JBQWdCO0FBQ2xCOztBQUNBLHdCQUF3QixjQUFjLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixFQUFFOztBQUMzRSwwQkFBMEIsOEJBQThCLEVBQUU7O0FBQzFELHdCQUF3Qiw4QkFBOEIsRUFBRTs7QUFDeEQsc0JBQXNCLDhCQUE4QixFQUFFOztBQUV0RDtFQUNFLGNBQWM7RUFDZCxXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLGtCQUFrQjtBQUNwQiIsImZpbGUiOiJzcmMvYXBwL2ZlYXR1cmVzL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4ubWktcGFnZSB7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXgtd2lkdGg6IG5vbmU7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbi5taS1wZXJpb2Qge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDEwcHg7XG4gIGZsZXgtd3JhcDogd3JhcDtcbn1cblxuLm1pLXBlcmlvZF9fcGlsbHMge1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYXBleC1ib3JkZXIsICNDOEM4QzgpO1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xufVxuXG4ubWktcGlsbCB7XG4gIGJvcmRlcjogMDtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIHBhZGRpbmc6IDZweCAxMnB4O1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgY29sb3I6ICM1NTU7XG59XG5cbi5taS1waWxsLmFjdGl2ZSB7XG4gIGJhY2tncm91bmQ6IHZhcigtLWFwZXgtdXctcmVkLCAjQzYyODI4KTtcbiAgY29sb3I6ICNmZmY7XG59XG5cbi5taS1oZXJvIHtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiBtaW5tYXgoMjYwcHgsIDM0MHB4KSAxZnI7XG4gIGdhcDogMTRweDtcbiAgbWFyZ2luLWJvdHRvbTogMThweDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDkwMHB4KSB7XG4gIC5taS1oZXJvIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7IH1cbn1cblxuLm1pLWdhdWdlLWNhcmQge1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1hcGV4LWJvcmRlciwgI0M4QzhDOCk7XG4gIHBhZGRpbmc6IDE2cHg7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogMTRweDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLm1pLWdhdWdlIHsgd2lkdGg6IDExMHB4OyBoZWlnaHQ6IDExMHB4OyBmbGV4OiAwIDAgYXV0bzsgfVxuLm1pLWdhdWdlX190cmFjayB7IGZpbGw6IG5vbmU7IHN0cm9rZTogI0VFRjJGNjsgc3Ryb2tlLXdpZHRoOiA4OyB9XG4ubWktZ2F1Z2VfX3ZhbHVlIHtcbiAgZmlsbDogbm9uZTtcbiAgc3Ryb2tlOiB2YXIoLS1hcGV4LXV3LXJlZCwgI0M2MjgyOCk7XG4gIHN0cm9rZS13aWR0aDogODtcbiAgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kO1xuICB0cmFuc2l0aW9uOiBzdHJva2UtZGFzaGFycmF5IDAuNHMgZWFzZTtcbn1cbi5taS1nYXVnZV9fcGN0IHtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBmaWxsOiAjMEIxRjMzO1xuICBmb250LWZhbWlseTogJ0xpYnJlIEJhc2tlcnZpbGxlJywgR2VvcmdpYSwgc2VyaWY7XG59XG4ubWktZ2F1Z2VfX2NhcCB7IGZvbnQtc2l6ZTogN3B4OyBmaWxsOiAjNUI1QjVCOyB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlOyB9XG5cbi5taS1nYXVnZS1jYXJkX19sYWJlbCB7XG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMDRlbTtcbiAgY29sb3I6ICM1QjVCNUI7XG59XG4ubWktZ2F1Z2UtY2FyZF9fdmFsdWUge1xuICBmb250LXNpemU6IDI2cHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGZvbnQtZmFtaWx5OiAnTGlicmUgQmFza2VydmlsbGUnLCBHZW9yZ2lhLCBzZXJpZjtcbiAgY29sb3I6ICMwQjFGMzM7XG59XG4ubWktZ2F1Z2UtY2FyZF9fc3ViIHsgZm9udC1zaXplOiAxMXB4OyBjb2xvcjogIzVCNUI1QjsgbWFyZ2luLXRvcDogNHB4OyB9XG5cbi5taS1rcGktZ3JpZCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIDFmcik7XG4gIGdhcDogMTBweDtcbn1cblxuLm1pLWtwaSB7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWFwZXgtYm9yZGVyLCAjQzhDOEM4KTtcbiAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCAjMEIxRjMzO1xuICBwYWRkaW5nOiAxMnB4IDE0cHg7XG59XG4ubWkta3BpX19sYWJlbCB7XG4gIGZvbnQtc2l6ZTogMTFweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgY29sb3I6ICM1QjVCNUI7XG4gIGxldHRlci1zcGFjaW5nOiAwLjA0ZW07XG59XG4ubWkta3BpX192YWx1ZSB7XG4gIGZvbnQtc2l6ZTogMjJweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgZm9udC1mYW1pbHk6ICdMaWJyZSBCYXNrZXJ2aWxsZScsIEdlb3JnaWEsIHNlcmlmO1xuICBtYXJnaW4tdG9wOiA0cHg7XG59XG4ubWkta3BpX192YWx1ZSBzbWFsbCB7IGZvbnQtc2l6ZTogMTRweDsgbWFyZ2luLWxlZnQ6IDJweDsgfVxuLm1pLWtwaV9fdmFsdWUtLW9rIHsgY29sb3I6ICMxRTcxNDU7IH1cbi5taS1rcGlfX3N1YiB7IGZvbnQtc2l6ZTogMTFweDsgY29sb3I6ICM1QjVCNUI7IG1hcmdpbi10b3A6IDRweDsgfVxuLm1pLWtwaV9fYmFyIHtcbiAgbWFyZ2luLXRvcDogOHB4O1xuICBoZWlnaHQ6IDZweDtcbiAgYmFja2dyb3VuZDogI0VFRjJGNjtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuLm1pLWtwaV9fYmFyIHNwYW4ge1xuICBkaXNwbGF5OiBibG9jaztcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsICNDNjI4MjgsICNFNTczNzMpO1xufVxuXG4ubWktc2VjdGlvbi10aXRsZSB7XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMDZlbTtcbiAgY29sb3I6ICM1QjVCNUI7XG4gIG1hcmdpbjogNHB4IDAgOHB4O1xufVxuXG4ubWktcHVsc2Uge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCg0LCAxZnIpO1xuICBnYXA6IDhweDtcbiAgbWFyZ2luLWJvdHRvbTogMnB4O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMTEwMHB4KSB7XG4gIC5taS1wdWxzZSB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDQsIDFmcik7IH1cbn1cbkBtZWRpYSAobWF4LXdpZHRoOiA2NDBweCkge1xuICAubWktcHVsc2UgeyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCAxZnIpOyB9XG59XG5cbi5taS1wdWxzZV9fdGlsZSB7XG4gIGJhY2tncm91bmQ6ICNmZmY7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWFwZXgtYm9yZGVyLCAjQzhDOEM4KTtcbiAgcGFkZGluZzogMTJweCAxMHB4O1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGNvbG9yOiBpbmhlcml0O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjE1cywgYm94LXNoYWRvdyAwLjE1cztcbn1cbi5taS1wdWxzZV9fdGlsZTpob3ZlciB7XG4gIGJvcmRlci1jb2xvcjogI0M2MjgyODtcbiAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwwLDAsMC4wNik7XG59XG4ubWktcHVsc2VfX2NvdW50IHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIGZvbnQtc2l6ZTogMjJweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgZm9udC1mYW1pbHk6ICdMaWJyZSBCYXNrZXJ2aWxsZScsIEdlb3JnaWEsIHNlcmlmO1xufVxuLm1pLXB1bHNlX19sYWJlbCB7IGZvbnQtc2l6ZTogMTFweDsgY29sb3I6ICM1QjVCNUI7IGZvbnQtd2VpZ2h0OiA2MDA7IH1cbi5taS1wdWxzZV9fdGlsZS0tZGFuZ2VyIC5taS1wdWxzZV9fY291bnQgeyBjb2xvcjogI0M2MjgyODsgfVxuLm1pLXB1bHNlX190aWxlLS13YXJuIC5taS1wdWxzZV9fY291bnQgeyBjb2xvcjogIzlBNjQwMDsgfVxuLm1pLXB1bHNlX190aWxlLS1vayAubWktcHVsc2VfX2NvdW50IHsgY29sb3I6ICMxRTcxNDU7IH1cblxuLm1pLWxheW91dCB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogbWlubWF4KDAsIDFmcikgMjgwcHg7XG4gIGdhcDogMTRweDtcbiAgYWxpZ24taXRlbXM6IHN0YXJ0O1xuICB3aWR0aDogMTAwJTtcbiAgbWFyZ2luLXRvcDogNHB4O1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzIwcHgpIHtcbiAgLm1pLWxheW91dCB7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG4gIH1cblxuICAubWktc2lkZSB7XG4gICAgcG9zaXRpb246IHN0YXRpYztcbiAgICBvcmRlcjogLTE7IC8qIGxpbmtzIHN0aWxsIGFwcGVhciBmaXJzdCBvbiBuYXJyb3cgc2NyZWVucyAqL1xuICB9XG59XG5cbi5taS1tYWluIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiAxNHB4O1xuICBtaW4td2lkdGg6IDA7XG59XG5cbi5taS1zaWRlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiAxMnB4O1xuICBtaW4td2lkdGg6IDA7XG4gIHBvc2l0aW9uOiBzdGlja3k7XG4gIHRvcDogMTJweDtcbiAgYWxpZ24tc2VsZjogc3RhcnQ7XG4gIG1heC1oZWlnaHQ6IGNhbGMoMTAwdmggLSAyNHB4KTtcbiAgb3ZlcmZsb3cteTogYXV0bztcbn1cblxuLm1pLWNhcmQgeyBtYXJnaW46IDA7IH1cblxuLm1pLWFjdGlvbnMgLmFwZXgtYnRuIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBtYXJnaW4tYm90dG9tOiA2cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLm1pLWxlZ2VuZCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogMTRweDtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBjb2xvcjogIzVCNUI1QjtcbiAgbWFyZ2luLWJvdHRvbTogMTBweDtcbn1cbi5taS1zd2F0Y2gge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHdpZHRoOiAxMHB4O1xuICBoZWlnaHQ6IDEwcHg7XG4gIG1hcmdpbi1yaWdodDogNHB4O1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xufVxuLm1pLXN3YXRjaC0td3JpdHRlbiB7IGJhY2tncm91bmQ6ICNDNjI4Mjg7IH1cbi5taS1zd2F0Y2gtLXRhcmdldCB7IGJhY2tncm91bmQ6ICM5MEE0QUU7IH1cblxuLm1pLWR1YWwtY2hhcnQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gIGdhcDogOHB4O1xuICBoZWlnaHQ6IDE4MHB4O1xuICBwYWRkaW5nOiA4cHggNHB4IDA7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjRUVGMkY2O1xufVxuLm1pLWR1YWwtY29sIHtcbiAgZmxleDogMSAxIDA7XG4gIG1pbi13aWR0aDogMDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuLm1pLWR1YWwtY29sX19iYXJzIHtcbiAgZmxleDogMTtcbiAgd2lkdGg6IDEwMCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGdhcDogM3B4O1xufVxuLm1pLWR1YWwtY29sX19iYXIge1xuICB3aWR0aDogNDAlO1xuICBtYXgtd2lkdGg6IDE4cHg7XG4gIG1pbi1oZWlnaHQ6IDJweDtcbiAgYm9yZGVyLXJhZGl1czogMnB4IDJweCAwIDA7XG59XG4ubWktZHVhbC1jb2xfX2Jhci0td3JpdHRlbiB7IGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNFNTczNzMsICNDNjI4MjgpOyB9XG4ubWktZHVhbC1jb2xfX2Jhci0tdGFyZ2V0IHsgYmFja2dyb3VuZDogI0IwQkVDNTsgfVxuLm1pLWR1YWwtY29sX19sYWJlbCB7XG4gIGZvbnQtc2l6ZTogOXB4O1xuICBjb2xvcjogIzVCNUI1QjtcbiAgbWFyZ2luLXRvcDogNnB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICBtYXgtd2lkdGg6IDEwMCU7XG59XG5cbi5taS1yYW5rLXJvdyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogMTBweDtcbiAgcGFkZGluZzogMTBweCAwO1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI0YwRjBGMDtcbn1cbi5taS1yYW5rLXJvdzpsYXN0LWNoaWxkIHsgYm9yZGVyLWJvdHRvbTogMDsgfVxuLm1pLXJhbmsge1xuICB3aWR0aDogMjhweDtcbiAgaGVpZ2h0OiAyOHB4O1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGJhY2tncm91bmQ6ICNFRUYyRjY7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGZsZXg6IDAgMCBhdXRvO1xufVxuLm1pLXJhbmstLWdvbGQgeyBiYWNrZ3JvdW5kOiAjRjVENzZFOyB9XG4ubWktcmFuay0tc2lsdmVyIHsgYmFja2dyb3VuZDogI0NGRDhEQzsgfVxuLm1pLXJhbmstLWJyb256ZSB7IGJhY2tncm91bmQ6ICNFMEIwODk7IH1cbi5taS1yYW5rLXJvd19fYm9keSB7IGZsZXg6IDE7IG1pbi13aWR0aDogMDsgfVxuLm1pLXJhbmstcm93X190b3Age1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGdhcDogOHB4O1xuICBmb250LXNpemU6IDEzcHg7XG59XG4ubWktcmFuay1yb3dfX3RyYWNrIHtcbiAgbWFyZ2luOiA2cHggMCA0cHg7XG4gIGhlaWdodDogOHB4O1xuICBiYWNrZ3JvdW5kOiAjRUVGMkY2O1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG4ubWktcmFuay1yb3dfX3RyYWNrIHNwYW4ge1xuICBkaXNwbGF5OiBibG9jaztcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsICMwQjFGMzMsICNDNjI4MjgpO1xufVxuLm1pLXJhbmstcm93X19tZXRhIHsgZm9udC1zaXplOiAxMXB4OyBjb2xvcjogIzVCNUI1QjsgfVxuXG4ubWktYXR0biB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGdhcDogMnB4O1xuICBwYWRkaW5nOiAxMHB4IDEycHg7XG4gIG1hcmdpbi1ib3R0b206IDhweDtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBjb2xvcjogaW5oZXJpdDtcbiAgYm9yZGVyLWxlZnQ6IDNweCBzb2xpZCAjOTBBNEFFO1xuICBiYWNrZ3JvdW5kOiAjRjdGOUZCO1xufVxuLm1pLWF0dG4tLWRhbmdlciB7IGJvcmRlci1sZWZ0LWNvbG9yOiAjQzYyODI4OyBiYWNrZ3JvdW5kOiAjRkZGNUY1OyB9XG4ubWktYXR0bi0td2FybiB7IGJvcmRlci1sZWZ0LWNvbG9yOiAjRjlBODI1OyBiYWNrZ3JvdW5kOiAjRkZGQkYwOyB9XG4ubWktYXR0bi0tb2sgeyBib3JkZXItbGVmdC1jb2xvcjogIzFFNzE0NTsgYmFja2dyb3VuZDogI0YxRjhGNDsgfVxuLm1pLWF0dG4gc3Ryb25nIHsgZm9udC1zaXplOiAxM3B4OyB9XG4ubWktYXR0biBzcGFuIHsgZm9udC1zaXplOiAxMnB4OyBjb2xvcjogIzVCNUI1QjsgfVxuXG4ubWktcXVldWUgeyBtYXJnaW4tYm90dG9tOiAxMnB4OyB9XG4ubWktcXVldWVfX2hlYWQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGZvbnQtc2l6ZTogMTJweDtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICBjb2xvcjogaW5oZXJpdDtcbiAgbWFyZ2luLWJvdHRvbTogNHB4O1xufVxuLm1pLXF1ZXVlX19jb3VudC0tZGFuZ2VyIHsgY29sb3I6ICNDNjI4Mjg7IH1cbi5taS1xdWV1ZV9fY291bnQtLXdhcm4geyBjb2xvcjogIzlBNjQwMDsgfVxuLm1pLXF1ZXVlX19jb3VudC0tb2sgeyBjb2xvcjogIzFFNzE0NTsgfVxuLm1pLXF1ZXVlX190cmFjayB7XG4gIGhlaWdodDogNnB4O1xuICBiYWNrZ3JvdW5kOiAjRUVGMkY2O1xuICBib3JkZXItcmFkaXVzOiAzcHg7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG4ubWktcXVldWVfX3RyYWNrIHNwYW4geyBkaXNwbGF5OiBibG9jazsgaGVpZ2h0OiAxMDAlOyBiYWNrZ3JvdW5kOiAjMEIxRjMzOyB9XG4ubWktcXVldWVfX2ZpbGwtLWRhbmdlciB7IGJhY2tncm91bmQ6ICNDNjI4MjggIWltcG9ydGFudDsgfVxuLm1pLXF1ZXVlX19maWxsLS13YXJuIHsgYmFja2dyb3VuZDogI0Y5QTgyNSAhaW1wb3J0YW50OyB9XG4ubWktcXVldWVfX2ZpbGwtLW9rIHsgYmFja2dyb3VuZDogIzFFNzE0NSAhaW1wb3J0YW50OyB9XG5cbi5taS1hY3Rpb25zIC5hcGV4LWJ0biB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMTAwJTtcbiAgbWFyZ2luLWJvdHRvbTogNnB4O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG4iXX0= */");

/***/ }),

/***/ "./src/app/features/dashboard/dashboard.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/features/dashboard/dashboard.component.ts ***!
  \***********************************************************/
/*! exports provided: DashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardComponent", function() { return DashboardComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../core/auth.service */ "./src/app/core/auth.service.ts");
/* harmony import */ var _dashboard_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dashboard.service */ "./src/app/features/dashboard/dashboard.service.ts");






let DashboardComponent = class DashboardComponent {
    constructor(dashboardService, auth) {
        this.dashboardService = dashboardService;
        this.auth = auth;
        this.loading = true;
        this.error = null;
        this.summary = null;
        this.pulse = null;
        this.concentration = null;
        this.premiumTrend = [];
        this.period = 'ytd';
        this.fromDate = '';
        this.toDate = '';
    }
    ngOnInit() {
        this.applyPeriod('ytd');
    }
    applyPeriod(period) {
        this.period = period;
        const now = new Date();
        const to = this.iso(now);
        let from;
        if (period === 'mtd') {
            from = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        else if (period === 'qtd') {
            const q = Math.floor(now.getMonth() / 3) * 3;
            from = new Date(now.getFullYear(), q, 1);
        }
        else if (period === '12m') {
            from = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        }
        else {
            from = new Date(now.getFullYear(), 0, 1);
        }
        this.fromDate = this.iso(from);
        this.toDate = to;
        this.load();
    }
    iso(d) {
        return d.toISOString().slice(0, 10);
    }
    load() {
        this.loading = true;
        this.error = null;
        Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["forkJoin"])([
            this.dashboardService.getSummary(this.fromDate, this.toDate),
            this.dashboardService.getPipelinePulse().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(() => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(null))),
            this.dashboardService.getPremiumTrend(this.fromDate, this.toDate).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(() => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])([]))),
            this.dashboardService.getConcentration().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(() => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(null)))
        ]).subscribe(([summary, pulse, trend, concentration]) => {
            this.summary = summary;
            this.pulse = pulse;
            this.premiumTrend = trend || [];
            this.concentration = concentration;
            this.loading = false;
        }, (err) => {
            this.error = err.message;
            this.loading = false;
        });
    }
    get queueTiles() {
        const q = this.summary && this.summary.queues;
        if (!q) {
            return [];
        }
        return [
            { key: 'new', label: 'New submissions', count: q.newSubmissions, tone: 'neutral',
                href: this.auth.shellUrl('/pipeline/upcoming') },
            { key: 'ref', label: 'Referrals', count: q.referrals, tone: q.referrals > 0 ? 'danger' : 'ok',
                href: this.auth.shellUrl('/pipeline/referrals') },
            { key: 'ren', label: 'Renewals due', count: q.renewalsDue, tone: q.renewalsDue > 0 ? 'warn' : 'ok',
                href: this.auth.shellUrl('/pipeline/upcoming') },
            { key: 'qte', label: 'Outstanding quotes', count: q.outstandingQuotes, tone: 'neutral',
                href: this.auth.shellUrl('/pipeline/upcoming') },
            { key: 'docs', label: 'Bound · awaiting docs', count: q.boundAwaitingDocs, tone: q.boundAwaitingDocs > 0 ? 'warn' : 'ok',
                href: this.auth.shellUrl('/documents') }
        ];
    }
    get pulseTiles() {
        const p = this.pulse || {};
        return [
            { label: 'Upcoming', count: p.upcoming || 0, href: this.auth.shellUrl('/pipeline/upcoming'), tone: 'navy' },
            { label: 'Day File', count: p.dayFile || 0, href: this.auth.shellUrl('/pipeline/day-file'), tone: 'navy' },
            { label: 'Queries', count: p.queries || 0, href: this.auth.shellUrl('/pipeline/queries'), tone: 'warn' },
            { label: 'Referrals', count: p.referrals || 0, href: this.auth.shellUrl('/pipeline/referrals'), tone: 'danger' },
            { label: 'Open tasks', count: p.openTasks || 0, href: this.auth.shellUrl('/inbox'), tone: 'warn' },
            { label: 'DA', count: p.delegatedAuthority || 0, href: this.auth.shellUrl('/pipeline/da'), tone: 'navy' },
            { label: 'Bound', count: p.bound || 0, href: this.auth.shellUrl('/pipeline/bound'), tone: 'ok' },
            { label: 'E-Placement', count: p.ePlacement || 0, href: '/ng8/modelling', tone: 'navy' }
        ];
    }
    get topBrokers() {
        return (this.summary && this.summary.topBrokers) || [];
    }
    get kpis() {
        return this.summary && this.summary.kpis;
    }
    get targetPct() {
        return (this.kpis && this.kpis.percentOfTarget) || 0;
    }
    get gaugeDash() {
        const pct = Math.max(0, Math.min(100, this.targetPct));
        const circ = 2 * Math.PI * 42;
        const filled = (pct / 100) * circ;
        return filled + ' ' + (circ - filled);
    }
    maxQueueCount() {
        return Math.max(1, ...this.queueTiles.map(q => q.count));
    }
    queueBarWidth(q) {
        return Math.round((q.count / this.maxQueueCount()) * 100) + '%';
    }
    maxBrokerPremium() {
        return Math.max(1, ...this.topBrokers.map(b => b.grossWrittenPremium || 0));
    }
    brokerBarWidth(b) {
        return Math.round(((b.grossWrittenPremium || 0) / this.maxBrokerPremium()) * 100) + '%';
    }
    maxTrend() {
        return Math.max(1, ...this.premiumTrend.map(r => Math.max(r.premiumWritten || 0, r.target || 0)));
    }
    trendWrittenHeight(r) {
        return Math.round(((r.premiumWritten || 0) / this.maxTrend()) * 100) + '%';
    }
    trendTargetHeight(r) {
        return Math.round(((r.target || 0) / this.maxTrend()) * 100) + '%';
    }
    get recentTrend() {
        return (this.premiumTrend || []).slice(-8);
    }
    get attentionItems() {
        const items = [];
        const q = this.summary && this.summary.queues;
        const p = this.pulse || {};
        if (q && q.referrals > 0) {
            items.push({ label: 'Referrals waiting', detail: q.referrals + ' open', href: this.auth.shellUrl('/pipeline/referrals'), tone: 'danger' });
        }
        if (p.openTasks > 0) {
            items.push({ label: 'Open tasks', detail: p.openTasks + ' assigned', href: this.auth.shellUrl('/inbox'), tone: 'warn' });
        }
        if (q && q.boundAwaitingDocs > 0) {
            items.push({ label: 'Docs outstanding', detail: q.boundAwaitingDocs + ' bound risks', href: this.auth.shellUrl('/documents'), tone: 'warn' });
        }
        if (p.queries > 0) {
            items.push({ label: 'Ops queries', detail: p.queries + ' open', href: this.auth.shellUrl('/pipeline/queries'), tone: 'warn' });
        }
        if (!items.length) {
            items.push({ label: 'Queues clear', detail: 'No urgent UW actions', href: this.auth.shellUrl('/pipeline/upcoming'), tone: 'ok' });
        }
        return items;
    }
};
DashboardComponent.ctorParameters = () => [
    { type: _dashboard_service__WEBPACK_IMPORTED_MODULE_5__["DashboardService"] },
    { type: _core_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"] }
];
DashboardComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'apex-dashboard',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./dashboard.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/features/dashboard/dashboard.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./dashboard.component.css */ "./src/app/features/dashboard/dashboard.component.css")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_dashboard_service__WEBPACK_IMPORTED_MODULE_5__["DashboardService"], _core_auth_service__WEBPACK_IMPORTED_MODULE_4__["AuthService"]])
], DashboardComponent);



/***/ }),

/***/ "./src/app/features/dashboard/dashboard.module.ts":
/*!********************************************************!*\
  !*** ./src/app/features/dashboard/dashboard.module.ts ***!
  \********************************************************/
/*! exports provided: DashboardModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardModule", function() { return DashboardModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _dashboard_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dashboard-routing.module */ "./src/app/features/dashboard/dashboard-routing.module.ts");
/* harmony import */ var _dashboard_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dashboard.component */ "./src/app/features/dashboard/dashboard.component.ts");





let DashboardModule = class DashboardModule {
};
DashboardModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [_dashboard_component__WEBPACK_IMPORTED_MODULE_4__["DashboardComponent"]],
        imports: [_shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"], _dashboard_routing_module__WEBPACK_IMPORTED_MODULE_3__["DashboardRoutingModule"]]
    })
], DashboardModule);



/***/ }),

/***/ "./src/app/features/dashboard/dashboard.service.ts":
/*!*********************************************************!*\
  !*** ./src/app/features/dashboard/dashboard.service.ts ***!
  \*********************************************************/
/*! exports provided: DashboardService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardService", function() { return DashboardService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _core_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/api.service */ "./src/app/core/api.service.ts");



let DashboardService = class DashboardService {
    constructor(api) {
        this.api = api;
    }
    getSummary(fromDate, toDate) {
        return this.api.get('/dashboard/summary', { fromDate, toDate });
    }
    getPipelinePulse() {
        return this.api.get('/pipeline/summary');
    }
    getPremiumTrend(fromDate, toDate) {
        return this.api.get('/reports/premium-vs-target', { fromDate, toDate });
    }
    getConcentration() {
        return this.api.get('/modelling/concentration-summary');
    }
};
DashboardService.ctorParameters = () => [
    { type: _core_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"] }
];
DashboardService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_core_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"]])
], DashboardService);



/***/ })

}]);
//# sourceMappingURL=features-dashboard-dashboard-module.js.map