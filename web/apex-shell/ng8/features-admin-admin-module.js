(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["features-admin-admin-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/features/admin/admin.component.html":
/*!*******************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/features/admin/admin.component.html ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"apex-page-header\">\n  <div>\n    <h1>Admin</h1>\n    <div class=\"apex-page-header__subtitle\">Users, pricing configuration, referral authority, parameters and holidays</div>\n  </div>\n</div>\n\n<div class=\"apex-alert apex-alert--warning\" *ngIf=\"!canEdit\">\n  You have read-only access to this screen. Only Admin users can save changes here.\n</div>\n\n<div class=\"apex-tabs\">\n  <div class=\"apex-tabs__tab\" [class.active]=\"activeTab === 'users'\" (click)=\"setTab('users')\">Users</div>\n  <div class=\"apex-tabs__tab\" [class.active]=\"activeTab === 'rateTables'\" (click)=\"setTab('rateTables')\">Rate Tables</div>\n  <div class=\"apex-tabs__tab\" [class.active]=\"activeTab === 'referralRules'\" (click)=\"setTab('referralRules')\">Referral Rules</div>\n  <div class=\"apex-tabs__tab\" [class.active]=\"activeTab === 'authorityRules'\" (click)=\"setTab('authorityRules')\">Authority Rules</div>\n  <div class=\"apex-tabs__tab\" [class.active]=\"activeTab === 'parameters'\" (click)=\"setTab('parameters')\">Parameters</div>\n  <div class=\"apex-tabs__tab\" [class.active]=\"activeTab === 'holidays'\" (click)=\"setTab('holidays')\">Holidays</div>\n</div>\n\n<!-- USERS -->\n<div class=\"apex-tab-panel\" *ngIf=\"activeTab === 'users'\">\n  <div class=\"apex-filter-bar\">\n    <div class=\"apex-form-row apex-form-row--grow\">\n      <label for=\"userSearch\">Search</label>\n      <input type=\"search\" id=\"userSearch\" [(ngModel)]=\"usersSearch\" placeholder=\"Username, name, email…\">\n    </div>\n    <div class=\"apex-form-row\" *ngIf=\"canEdit\">\n      <button type=\"button\" class=\"apex-btn apex-btn--primary\" (click)=\"startNewUser()\">+ New user</button>\n    </div>\n  </div>\n\n  <div class=\"apex-card apex-mb-16\" *ngIf=\"showNewUserForm\">\n    <h3>{{ editingUserId ? 'Edit user' : 'New user' }}</h3>\n    <div class=\"apex-alert apex-alert--danger\" *ngIf=\"userFormError\">{{ userFormError }}</div>\n    <div class=\"apex-form-grid\">\n      <div class=\"apex-form-row\">\n        <label>Username</label>\n        <input type=\"text\" [(ngModel)]=\"userForm.username\" [disabled]=\"!!editingUserId\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Full name</label>\n        <input type=\"text\" [(ngModel)]=\"userForm.fullName\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Email</label>\n        <input type=\"email\" [(ngModel)]=\"userForm.email\">\n      </div>\n      <div class=\"apex-form-row\" *ngIf=\"!editingUserId\">\n        <label>Password</label>\n        <input type=\"password\" [(ngModel)]=\"userForm.password\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Role</label>\n        <select [(ngModel)]=\"userForm.role\">\n          <option *ngFor=\"let r of roleOptions\" [value]=\"r\">{{ r }}</option>\n        </select>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Team</label>\n        <select [(ngModel)]=\"userForm.teamId\">\n          <option [ngValue]=\"undefined\">Unassigned</option>\n          <option *ngFor=\"let t of teams\" [ngValue]=\"t.id\">{{ t.name }}</option>\n        </select>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Authority limit (£)</label>\n        <input type=\"number\" [(ngModel)]=\"userForm.authorityLimit\">\n      </div>\n      <div class=\"apex-form-row\" *ngIf=\"editingUserId\">\n        <label>Active</label>\n        <select [(ngModel)]=\"userForm.isActive\">\n          <option [ngValue]=\"true\">Active</option>\n          <option [ngValue]=\"false\">Inactive</option>\n        </select>\n      </div>\n    </div>\n    <div class=\"apex-btn-row\">\n      <button type=\"button\" class=\"apex-btn apex-btn--primary\" [disabled]=\"userSaving\" (click)=\"saveUser()\">\n        {{ userSaving ? 'Saving…' : 'Save' }}\n      </button>\n      <button type=\"button\" class=\"apex-btn apex-btn--ghost\" (click)=\"cancelUserForm()\">Cancel</button>\n    </div>\n  </div>\n\n  <apex-loading *ngIf=\"usersLoading\" label=\"Loading users…\"></apex-loading>\n  <div class=\"apex-alert apex-alert--danger\" *ngIf=\"usersError && !usersLoading\">{{ usersError }}</div>\n\n  <div class=\"apex-card\" *ngIf=\"!usersLoading && !usersError\">\n    <apex-empty-state *ngIf=\"filteredUsers.length === 0\" title=\"No users found\" message=\"Try a different search term.\"></apex-empty-state>\n    <div class=\"apex-table-wrap\" *ngIf=\"filteredUsers.length > 0\">\n      <table class=\"apex-table\">\n        <thead>\n          <tr>\n            <th>Username</th><th>Full name</th><th>Email</th><th>Role</th><th>Team</th>\n            <th>Authority</th><th>Status</th><th *ngIf=\"canEdit\">Actions</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr *ngFor=\"let u of filteredUsers\">\n            <td>{{ u.username }}</td>\n            <td>{{ u.fullName }}</td>\n            <td>{{ u.email }}</td>\n            <td>{{ u.role }}</td>\n            <td>{{ teamName(u.teamId) }}</td>\n            <td>£{{ u.authorityLimit | number:'1.0-0' }}</td>\n            <td>\n              <span class=\"apex-badge\" [class.apex-badge--success]=\"u.isActive\" [class.apex-badge--neutral]=\"!u.isActive\">\n                {{ u.isActive ? 'Active' : 'Inactive' }}\n              </span>\n            </td>\n            <td *ngIf=\"canEdit\">\n              <button type=\"button\" class=\"apex-btn apex-btn--sm apex-btn--ghost\" (click)=\"startEditUser(u)\">Edit</button>\n              <button type=\"button\" class=\"apex-btn apex-btn--sm apex-btn--ghost\" *ngIf=\"u.isActive\" (click)=\"deactivateUser(u)\">Deactivate</button>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>\n\n<!-- RATE TABLES -->\n<div class=\"apex-tab-panel\" *ngIf=\"activeTab === 'rateTables'\">\n  <div class=\"apex-card apex-mb-16\" *ngIf=\"canEdit\">\n    <h3>{{ rateTableForm.id ? 'Edit rate table entry' : 'New rate table entry' }}</h3>\n    <div class=\"apex-alert apex-alert--danger\" *ngIf=\"rateTableFormError\">{{ rateTableFormError }}</div>\n    <div class=\"apex-form-grid\">\n      <div class=\"apex-form-row\">\n        <label>Line of business</label>\n        <select [(ngModel)]=\"rateTableForm.lineOfBusiness\">\n          <option *ngFor=\"let l of lobOptions\" [value]=\"l\">{{ l }}</option>\n        </select>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Trade</label>\n        <select [(ngModel)]=\"rateTableForm.tradeId\">\n          <option [ngValue]=\"undefined\">All trades</option>\n          <option *ngFor=\"let t of trades\" [ngValue]=\"t.id\">{{ t.name }}</option>\n        </select>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Base rate per £1,000</label>\n        <input type=\"number\" step=\"0.01\" [(ngModel)]=\"rateTableForm.baseRatePer1000\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Minimum premium (£)</label>\n        <input type=\"number\" step=\"1\" [(ngModel)]=\"rateTableForm.minPremium\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Active</label>\n        <select [(ngModel)]=\"rateTableForm.isActive\">\n          <option [ngValue]=\"true\">Active</option>\n          <option [ngValue]=\"false\">Inactive</option>\n        </select>\n      </div>\n    </div>\n    <div class=\"apex-btn-row\">\n      <button type=\"button\" class=\"apex-btn apex-btn--primary\" [disabled]=\"rateTableSaving\" (click)=\"saveRateTable()\">\n        {{ rateTableSaving ? 'Saving…' : (rateTableForm.id ? 'Update' : 'Add') }}\n      </button>\n      <button type=\"button\" class=\"apex-btn apex-btn--ghost\" *ngIf=\"rateTableForm.id\" (click)=\"cancelRateTableEdit()\">Cancel</button>\n    </div>\n  </div>\n\n  <apex-loading *ngIf=\"rateTablesLoading\" label=\"Loading rate tables…\"></apex-loading>\n  <div class=\"apex-alert apex-alert--danger\" *ngIf=\"rateTablesError && !rateTablesLoading\">{{ rateTablesError }}</div>\n\n  <div class=\"apex-card\" *ngIf=\"!rateTablesLoading && !rateTablesError\">\n    <apex-empty-state *ngIf=\"rateTables.length === 0\" title=\"No rate tables configured\"></apex-empty-state>\n    <div class=\"apex-table-wrap\" *ngIf=\"rateTables.length > 0\">\n      <table class=\"apex-table\">\n        <thead><tr><th>LOB</th><th>Trade</th><th>Base rate /£1,000</th><th>Min premium</th><th>Status</th><th *ngIf=\"canEdit\">Actions</th></tr></thead>\n        <tbody>\n          <tr *ngFor=\"let r of rateTables\">\n            <td>{{ r.lineOfBusiness }}</td>\n            <td>{{ r.tradeName || 'All trades' }}</td>\n            <td>{{ r.baseRatePer1000 | number:'1.2-2' }}</td>\n            <td>£{{ r.minPremium | number:'1.0-0' }}</td>\n            <td>\n              <span class=\"apex-badge\" [class.apex-badge--success]=\"r.isActive\" [class.apex-badge--neutral]=\"!r.isActive\">\n                {{ r.isActive ? 'Active' : 'Inactive' }}\n              </span>\n            </td>\n            <td *ngIf=\"canEdit\"><button type=\"button\" class=\"apex-btn apex-btn--sm apex-btn--ghost\" (click)=\"editRateTable(r)\">Edit</button></td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>\n\n<!-- REFERRAL RULES -->\n<div class=\"apex-tab-panel\" *ngIf=\"activeTab === 'referralRules'\">\n  <div class=\"apex-card apex-mb-16\" *ngIf=\"canEdit\">\n    <h3>{{ referralRuleForm.id ? 'Edit referral rule' : 'New referral rule' }}</h3>\n    <div class=\"apex-alert apex-alert--danger\" *ngIf=\"referralRuleFormError\">{{ referralRuleFormError }}</div>\n    <div class=\"apex-form-grid\">\n      <div class=\"apex-form-row\">\n        <label>Line of business</label>\n        <select [(ngModel)]=\"referralRuleForm.lineOfBusiness\">\n          <option *ngFor=\"let l of lobOptions\" [value]=\"l\">{{ l }}</option>\n        </select>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Trade</label>\n        <select [(ngModel)]=\"referralRuleForm.tradeId\">\n          <option [ngValue]=\"undefined\">Any trade</option>\n          <option *ngFor=\"let t of trades\" [ngValue]=\"t.id\">{{ t.name }}</option>\n        </select>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Min sum insured (£)</label>\n        <input type=\"number\" [(ngModel)]=\"referralRuleForm.minSumInsured\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Max sum insured (£)</label>\n        <input type=\"number\" [(ngModel)]=\"referralRuleForm.maxSumInsured\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Min limit (£)</label>\n        <input type=\"number\" [(ngModel)]=\"referralRuleForm.minLimit\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Max limit (£)</label>\n        <input type=\"number\" [(ngModel)]=\"referralRuleForm.maxLimit\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Triggers on restricted trade</label>\n        <select [(ngModel)]=\"referralRuleForm.triggersOnRestrictedTrade\">\n          <option [ngValue]=\"true\">Yes</option>\n          <option [ngValue]=\"false\">No</option>\n        </select>\n      </div>\n      <div class=\"apex-form-row apex-form-row--grow\">\n        <label>Reason</label>\n        <input type=\"text\" [(ngModel)]=\"referralRuleForm.reason\" placeholder=\"Explain why this triggers a referral\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Active</label>\n        <select [(ngModel)]=\"referralRuleForm.isActive\">\n          <option [ngValue]=\"true\">Active</option>\n          <option [ngValue]=\"false\">Inactive</option>\n        </select>\n      </div>\n    </div>\n    <div class=\"apex-btn-row\">\n      <button type=\"button\" class=\"apex-btn apex-btn--primary\" [disabled]=\"referralRuleSaving\" (click)=\"saveReferralRule()\">\n        {{ referralRuleSaving ? 'Saving…' : (referralRuleForm.id ? 'Update' : 'Add') }}\n      </button>\n      <button type=\"button\" class=\"apex-btn apex-btn--ghost\" *ngIf=\"referralRuleForm.id\" (click)=\"cancelReferralRuleEdit()\">Cancel</button>\n    </div>\n  </div>\n\n  <apex-loading *ngIf=\"referralRulesLoading\" label=\"Loading referral rules…\"></apex-loading>\n  <div class=\"apex-alert apex-alert--danger\" *ngIf=\"referralRulesError && !referralRulesLoading\">{{ referralRulesError }}</div>\n\n  <div class=\"apex-card\" *ngIf=\"!referralRulesLoading && !referralRulesError\">\n    <apex-empty-state *ngIf=\"referralRules.length === 0\" title=\"No referral rules configured\"></apex-empty-state>\n    <div class=\"apex-table-wrap\" *ngIf=\"referralRules.length > 0\">\n      <table class=\"apex-table\">\n        <thead><tr><th>LOB</th><th>Trade</th><th>Sum insured range</th><th>Limit range</th><th>Restricted trade?</th><th>Reason</th><th>Status</th><th *ngIf=\"canEdit\">Actions</th></tr></thead>\n        <tbody>\n          <tr *ngFor=\"let r of referralRules\">\n            <td>{{ r.lineOfBusiness }}</td>\n            <td>{{ r.tradeName || 'Any' }}</td>\n            <td>\n              <ng-container *ngIf=\"r.minSumInsured || r.maxSumInsured\">\n                £{{ r.minSumInsured | number:'1.0-0' }} – £{{ r.maxSumInsured | number:'1.0-0' }}\n              </ng-container>\n              <ng-container *ngIf=\"!r.minSumInsured && !r.maxSumInsured\">—</ng-container>\n            </td>\n            <td>\n              <ng-container *ngIf=\"r.minLimit || r.maxLimit\">\n                £{{ r.minLimit | number:'1.0-0' }} – £{{ r.maxLimit | number:'1.0-0' }}\n              </ng-container>\n              <ng-container *ngIf=\"!r.minLimit && !r.maxLimit\">—</ng-container>\n            </td>\n            <td>{{ r.triggersOnRestrictedTrade ? 'Yes' : 'No' }}</td>\n            <td>{{ r.reason }}</td>\n            <td>\n              <span class=\"apex-badge\" [class.apex-badge--success]=\"r.isActive\" [class.apex-badge--neutral]=\"!r.isActive\">\n                {{ r.isActive ? 'Active' : 'Inactive' }}\n              </span>\n            </td>\n            <td *ngIf=\"canEdit\"><button type=\"button\" class=\"apex-btn apex-btn--sm apex-btn--ghost\" (click)=\"editReferralRule(r)\">Edit</button></td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>\n\n<!-- AUTHORITY RULES -->\n<div class=\"apex-tab-panel\" *ngIf=\"activeTab === 'authorityRules'\">\n  <div class=\"apex-card apex-mb-16\" *ngIf=\"canEdit\">\n    <h3>{{ authorityRuleForm.id ? 'Edit authority rule' : 'New authority rule' }}</h3>\n    <div class=\"apex-alert apex-alert--danger\" *ngIf=\"authorityRuleFormError\">{{ authorityRuleFormError }}</div>\n    <div class=\"apex-form-grid\">\n      <div class=\"apex-form-row\">\n        <label>Role</label>\n        <select [(ngModel)]=\"authorityRuleForm.role\">\n          <option *ngFor=\"let r of authorityRoleOptions\" [value]=\"r\">{{ r }}</option>\n        </select>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Line of business</label>\n        <select [(ngModel)]=\"authorityRuleForm.lineOfBusiness\">\n          <option *ngFor=\"let l of lobOptions\" [value]=\"l\">{{ l }}</option>\n        </select>\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Max premium (£)</label>\n        <input type=\"number\" [(ngModel)]=\"authorityRuleForm.maxPremium\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Max sum insured (£)</label>\n        <input type=\"number\" [(ngModel)]=\"authorityRuleForm.maxSumInsured\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Max limit (£)</label>\n        <input type=\"number\" [(ngModel)]=\"authorityRuleForm.maxLimit\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Active</label>\n        <select [(ngModel)]=\"authorityRuleForm.isActive\">\n          <option [ngValue]=\"true\">Active</option>\n          <option [ngValue]=\"false\">Inactive</option>\n        </select>\n      </div>\n    </div>\n    <div class=\"apex-btn-row\">\n      <button type=\"button\" class=\"apex-btn apex-btn--primary\" [disabled]=\"authorityRuleSaving\" (click)=\"saveAuthorityRule()\">\n        {{ authorityRuleSaving ? 'Saving…' : (authorityRuleForm.id ? 'Update' : 'Add') }}\n      </button>\n      <button type=\"button\" class=\"apex-btn apex-btn--ghost\" *ngIf=\"authorityRuleForm.id\" (click)=\"cancelAuthorityRuleEdit()\">Cancel</button>\n    </div>\n  </div>\n\n  <apex-loading *ngIf=\"authorityRulesLoading\" label=\"Loading authority rules…\"></apex-loading>\n  <div class=\"apex-alert apex-alert--danger\" *ngIf=\"authorityRulesError && !authorityRulesLoading\">{{ authorityRulesError }}</div>\n\n  <div class=\"apex-card\" *ngIf=\"!authorityRulesLoading && !authorityRulesError\">\n    <apex-empty-state *ngIf=\"authorityRules.length === 0\" title=\"No authority rules configured\"></apex-empty-state>\n    <div class=\"apex-table-wrap\" *ngIf=\"authorityRules.length > 0\">\n      <table class=\"apex-table\">\n        <thead>\n          <tr>\n            <th>Role</th><th>LOB</th><th>Max premium</th><th>Max sum insured</th><th>Max limit</th>\n            <th>Status</th><th *ngIf=\"canEdit\">Actions</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr *ngFor=\"let r of authorityRules\">\n            <td>{{ r.role }}</td>\n            <td>{{ r.lineOfBusiness }}</td>\n            <td>£{{ r.maxPremium | number:'1.0-0' }}</td>\n            <td>£{{ r.maxSumInsured | number:'1.0-0' }}</td>\n            <td>£{{ r.maxLimit | number:'1.0-0' }}</td>\n            <td>\n              <span class=\"apex-badge\" [class.apex-badge--success]=\"r.isActive\" [class.apex-badge--neutral]=\"!r.isActive\">\n                {{ r.isActive ? 'Active' : 'Inactive' }}\n              </span>\n            </td>\n            <td *ngIf=\"canEdit\">\n              <button type=\"button\" class=\"apex-btn apex-btn--sm apex-btn--ghost\" (click)=\"editAuthorityRule(r)\">Edit</button>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>\n\n<!-- PARAMETERS -->\n<div class=\"apex-tab-panel\" *ngIf=\"activeTab === 'parameters'\">\n  <apex-loading *ngIf=\"parametersLoading\" label=\"Loading parameters…\"></apex-loading>\n  <div class=\"apex-alert apex-alert--danger\" *ngIf=\"parametersError && !parametersLoading\">{{ parametersError }}</div>\n\n  <div class=\"apex-card\" *ngIf=\"!parametersLoading && !parametersError\">\n    <apex-empty-state *ngIf=\"parameters.length === 0\" title=\"No system parameters found\"></apex-empty-state>\n    <div class=\"apex-table-wrap\" *ngIf=\"parameters.length > 0\">\n      <table class=\"apex-table\">\n        <thead><tr><th>Key</th><th>Value</th><th>Description</th><th *ngIf=\"canEdit\">Actions</th></tr></thead>\n        <tbody>\n          <tr *ngFor=\"let p of parameters\">\n            <td>{{ p.key }}</td>\n            <td>\n              <input type=\"text\" *ngIf=\"editingParamKey === p.key\" [(ngModel)]=\"paramEditValue\">\n              <ng-container *ngIf=\"editingParamKey !== p.key\">{{ p.value }}</ng-container>\n            </td>\n            <td>{{ p.description }}</td>\n            <td *ngIf=\"canEdit\">\n              <ng-container *ngIf=\"editingParamKey === p.key\">\n                <button type=\"button\" class=\"apex-btn apex-btn--sm apex-btn--primary\" [disabled]=\"paramSaving\" (click)=\"saveParam(p)\">Save</button>\n                <button type=\"button\" class=\"apex-btn apex-btn--sm apex-btn--ghost\" (click)=\"cancelEditParam()\">Cancel</button>\n              </ng-container>\n              <button type=\"button\" class=\"apex-btn apex-btn--sm apex-btn--ghost\" *ngIf=\"editingParamKey !== p.key\" (click)=\"startEditParam(p)\">Edit</button>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>\n\n<!-- HOLIDAYS -->\n<div class=\"apex-tab-panel\" *ngIf=\"activeTab === 'holidays'\">\n  <div class=\"apex-card apex-mb-16\" *ngIf=\"canEdit\">\n    <h3>Add holiday</h3>\n    <div class=\"apex-alert apex-alert--danger\" *ngIf=\"holidayFormError\">{{ holidayFormError }}</div>\n    <div class=\"apex-form-grid\">\n      <div class=\"apex-form-row\">\n        <label>Date</label>\n        <input type=\"date\" [(ngModel)]=\"holidayForm.holidayDate\">\n      </div>\n      <div class=\"apex-form-row apex-form-row--grow\">\n        <label>Description</label>\n        <input type=\"text\" [(ngModel)]=\"holidayForm.description\" placeholder=\"e.g. Christmas Day\">\n      </div>\n      <div class=\"apex-form-row\">\n        <label>Country</label>\n        <input type=\"text\" [(ngModel)]=\"holidayForm.countryCode\" maxlength=\"2\" style=\"width: 60px;\">\n      </div>\n    </div>\n    <div class=\"apex-btn-row\">\n      <button type=\"button\" class=\"apex-btn apex-btn--primary\" [disabled]=\"holidaySaving\" (click)=\"addHoliday()\">\n        {{ holidaySaving ? 'Saving…' : 'Add holiday' }}\n      </button>\n    </div>\n  </div>\n\n  <apex-loading *ngIf=\"holidaysLoading\" label=\"Loading holidays…\"></apex-loading>\n  <div class=\"apex-alert apex-alert--danger\" *ngIf=\"holidaysError && !holidaysLoading\">{{ holidaysError }}</div>\n\n  <div class=\"apex-card\" *ngIf=\"!holidaysLoading && !holidaysError\">\n    <apex-empty-state *ngIf=\"holidays.length === 0\" title=\"No holidays configured\"></apex-empty-state>\n    <div class=\"apex-table-wrap\" *ngIf=\"holidays.length > 0\">\n      <table class=\"apex-table\">\n        <thead><tr><th>Date</th><th>Description</th><th>Country</th></tr></thead>\n        <tbody>\n          <tr *ngFor=\"let h of holidays\">\n            <td>{{ h.holidayDate | date:'dd MMM yyyy' }}</td>\n            <td>{{ h.description }}</td>\n            <td>{{ h.countryCode || '—' }}</td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div>\n</div>\n");

/***/ }),

/***/ "./src/app/features/admin/admin-routing.module.ts":
/*!********************************************************!*\
  !*** ./src/app/features/admin/admin-routing.module.ts ***!
  \********************************************************/
/*! exports provided: AdminRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminRoutingModule", function() { return AdminRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _admin_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./admin.component */ "./src/app/features/admin/admin.component.ts");




const routes = [
    { path: '', component: _admin_component__WEBPACK_IMPORTED_MODULE_3__["AdminComponent"] }
];
let AdminRoutingModule = class AdminRoutingModule {
};
AdminRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })
], AdminRoutingModule);



/***/ }),

/***/ "./src/app/features/admin/admin.component.css":
/*!****************************************************!*\
  !*** ./src/app/features/admin/admin.component.css ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (":host {\n  display: block;\n}\n\n.apex-form-row--grow {\n  flex: 1 1 auto;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZmVhdHVyZXMvYWRtaW4vYWRtaW4uY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSxjQUFjO0FBQ2hCIiwiZmlsZSI6InNyYy9hcHAvZmVhdHVyZXMvYWRtaW4vYWRtaW4uY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi5hcGV4LWZvcm0tcm93LS1ncm93IHtcbiAgZmxleDogMSAxIGF1dG87XG59XG4iXX0= */");

/***/ }),

/***/ "./src/app/features/admin/admin.component.ts":
/*!***************************************************!*\
  !*** ./src/app/features/admin/admin.component.ts ***!
  \***************************************************/
/*! exports provided: ROLE_OPTIONS, AUTHORITY_ROLE_OPTIONS, LOB_OPTIONS, AdminComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ROLE_OPTIONS", function() { return ROLE_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AUTHORITY_ROLE_OPTIONS", function() { return AUTHORITY_ROLE_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOB_OPTIONS", function() { return LOB_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminComponent", function() { return AdminComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _admin_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./admin.service */ "./src/app/features/admin/admin.service.ts");
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/auth.service */ "./src/app/core/auth.service.ts");




const ROLE_OPTIONS = ['Underwriter', 'UnderwritingManager', 'BrokerOps', 'ClaimsHandler', 'Admin'];
const AUTHORITY_ROLE_OPTIONS = ['Underwriter', 'UnderwritingManager'];
const LOB_OPTIONS = ['Property', 'Liability', 'ProfessionalIndemnity'];
let AdminComponent = class AdminComponent {
    constructor(adminService, auth) {
        this.adminService = adminService;
        this.auth = auth;
        this.activeTab = 'users';
        this.roleOptions = ROLE_OPTIONS;
        this.authorityRoleOptions = AUTHORITY_ROLE_OPTIONS;
        this.lobOptions = LOB_OPTIONS;
        // Users
        this.users = [];
        this.usersLoading = true;
        this.usersError = null;
        this.usersSearch = '';
        this.teams = [];
        this.editingUserId = null;
        this.showNewUserForm = false;
        this.userForm = this.blankUserForm();
        this.userSaving = false;
        this.userFormError = null;
        // Rate tables
        this.rateTables = [];
        this.rateTablesLoading = true;
        this.rateTablesError = null;
        this.trades = [];
        this.rateTableForm = this.blankRateTableForm();
        this.rateTableSaving = false;
        this.rateTableFormError = null;
        // Referral rules
        this.referralRules = [];
        this.referralRulesLoading = true;
        this.referralRulesError = null;
        this.referralRuleForm = this.blankReferralRuleForm();
        this.referralRuleSaving = false;
        this.referralRuleFormError = null;
        // Authority rules
        this.authorityRules = [];
        this.authorityRulesLoading = true;
        this.authorityRulesError = null;
        this.authorityRuleForm = this.blankAuthorityRuleForm();
        this.authorityRuleSaving = false;
        this.authorityRuleFormError = null;
        // Parameters
        this.parameters = [];
        this.parametersLoading = true;
        this.parametersError = null;
        this.editingParamKey = null;
        this.paramEditValue = '';
        this.paramSaving = false;
        // Holidays
        this.holidays = [];
        this.holidaysLoading = true;
        this.holidaysError = null;
        this.holidayForm = { holidayDate: '', description: '', countryCode: 'GB' };
        this.holidaySaving = false;
        this.holidayFormError = null;
    }
    ngOnInit() {
        this.loadUsers();
        this.loadTeams();
        this.loadTrades();
        this.loadRateTables();
        this.loadReferralRules();
        this.loadAuthorityRules();
        this.loadParameters();
        this.loadHolidays();
    }
    setTab(tab) {
        this.activeTab = tab;
    }
    get canEdit() {
        return this.auth.hasRole('Admin');
    }
    // ---------- Users ----------
    blankUserForm() {
        return { username: '', email: '', fullName: '', password: '', role: 'Underwriter', teamId: undefined, authorityLimit: 0, isActive: true };
    }
    loadUsers() {
        this.usersLoading = true;
        this.usersError = null;
        this.adminService.listUsers().subscribe((users) => { this.users = users; this.usersLoading = false; }, (err) => { this.usersError = err.message; this.usersLoading = false; });
    }
    loadTeams() {
        this.adminService.listTeams().subscribe((teams) => { this.teams = teams; }, () => { this.teams = []; });
    }
    get filteredUsers() {
        const term = this.usersSearch.trim().toLowerCase();
        if (!term) {
            return this.users;
        }
        return this.users.filter(u => (u.username || '').toLowerCase().indexOf(term) !== -1 ||
            (u.fullName || '').toLowerCase().indexOf(term) !== -1 ||
            (u.email || '').toLowerCase().indexOf(term) !== -1);
    }
    startNewUser() {
        this.editingUserId = null;
        this.userForm = this.blankUserForm();
        this.userFormError = null;
        this.showNewUserForm = true;
    }
    startEditUser(user) {
        this.editingUserId = user.id;
        this.userForm = {
            username: user.username, email: user.email, fullName: user.fullName, password: '',
            role: user.role, teamId: user.teamId, authorityLimit: user.authorityLimit, isActive: user.isActive
        };
        this.userFormError = null;
        this.showNewUserForm = true;
    }
    cancelUserForm() {
        this.showNewUserForm = false;
        this.editingUserId = null;
        this.userFormError = null;
    }
    saveUser() {
        if (!this.userForm.email || !this.userForm.fullName || (!this.editingUserId && (!this.userForm.username || !this.userForm.password))) {
            this.userFormError = 'Please fill in all required fields.';
            return;
        }
        this.userSaving = true;
        this.userFormError = null;
        const onError = (err) => { this.userFormError = err.message; this.userSaving = false; };
        const onSuccess = () => { this.userSaving = false; this.showNewUserForm = false; this.editingUserId = null; this.loadUsers(); };
        if (this.editingUserId) {
            const req = {
                id: this.editingUserId, email: this.userForm.email, fullName: this.userForm.fullName,
                role: this.userForm.role, teamId: this.userForm.teamId, authorityLimit: this.userForm.authorityLimit,
                isActive: this.userForm.isActive
            };
            this.adminService.updateUser(this.editingUserId, req).subscribe(onSuccess, onError);
        }
        else {
            const req = {
                username: this.userForm.username, email: this.userForm.email, fullName: this.userForm.fullName,
                password: this.userForm.password, role: this.userForm.role, teamId: this.userForm.teamId,
                authorityLimit: this.userForm.authorityLimit
            };
            this.adminService.createUser(req).subscribe(onSuccess, onError);
        }
    }
    deactivateUser(user) {
        if (!window.confirm(`Deactivate ${user.fullName || user.username}?`)) {
            return;
        }
        this.adminService.deactivateUser(user.id).subscribe(() => this.loadUsers(), (err) => { this.usersError = err.message; });
    }
    teamName(teamId) {
        if (!teamId) {
            return '—';
        }
        const team = this.teams.find(t => t.id === teamId);
        return team ? team.name : `#${teamId}`;
    }
    // ---------- Rate tables ----------
    blankRateTableForm() {
        return { lineOfBusiness: 'Property', tradeId: undefined, baseRatePer1000: 0, minPremium: 0, isActive: true };
    }
    loadTrades() {
        this.adminService.listTrades().subscribe((trades) => { this.trades = trades; }, () => { this.trades = []; });
    }
    loadRateTables() {
        this.rateTablesLoading = true;
        this.rateTablesError = null;
        this.adminService.listRateTables().subscribe((rows) => { this.rateTables = rows; this.rateTablesLoading = false; }, (err) => { this.rateTablesError = err.message; this.rateTablesLoading = false; });
    }
    saveRateTable() {
        this.rateTableSaving = true;
        this.rateTableFormError = null;
        this.adminService.saveRateTable(this.rateTableForm).subscribe(() => { this.rateTableSaving = false; this.rateTableForm = this.blankRateTableForm(); this.loadRateTables(); }, (err) => { this.rateTableFormError = err.message; this.rateTableSaving = false; });
    }
    editRateTable(row) {
        this.rateTableForm = {
            id: row.id, lineOfBusiness: row.lineOfBusiness, tradeId: row.tradeId,
            baseRatePer1000: row.baseRatePer1000, minPremium: row.minPremium, isActive: row.isActive
        };
    }
    cancelRateTableEdit() {
        this.rateTableForm = this.blankRateTableForm();
    }
    // ---------- Referral rules ----------
    blankReferralRuleForm() {
        return {
            lineOfBusiness: 'Property', tradeId: undefined, minSumInsured: undefined, maxSumInsured: undefined,
            minLimit: undefined, maxLimit: undefined, triggersOnRestrictedTrade: false, reason: '', isActive: true
        };
    }
    loadReferralRules() {
        this.referralRulesLoading = true;
        this.referralRulesError = null;
        this.adminService.listReferralRules().subscribe((rows) => { this.referralRules = rows; this.referralRulesLoading = false; }, (err) => { this.referralRulesError = err.message; this.referralRulesLoading = false; });
    }
    saveReferralRule() {
        if (!this.referralRuleForm.reason) {
            this.referralRuleFormError = 'Please provide a reason for this referral rule.';
            return;
        }
        this.referralRuleSaving = true;
        this.referralRuleFormError = null;
        this.adminService.saveReferralRule(this.referralRuleForm).subscribe(() => { this.referralRuleSaving = false; this.referralRuleForm = this.blankReferralRuleForm(); this.loadReferralRules(); }, (err) => { this.referralRuleFormError = err.message; this.referralRuleSaving = false; });
    }
    editReferralRule(row) {
        this.referralRuleForm = {
            id: row.id, lineOfBusiness: row.lineOfBusiness, tradeId: row.tradeId,
            minSumInsured: row.minSumInsured, maxSumInsured: row.maxSumInsured,
            minLimit: row.minLimit, maxLimit: row.maxLimit,
            triggersOnRestrictedTrade: row.triggersOnRestrictedTrade, reason: row.reason, isActive: row.isActive
        };
    }
    cancelReferralRuleEdit() {
        this.referralRuleForm = this.blankReferralRuleForm();
    }
    // ---------- Authority rules ----------
    blankAuthorityRuleForm() {
        return {
            role: 'Underwriter', lineOfBusiness: 'Property',
            maxPremium: 50000, maxSumInsured: 2000000, maxLimit: 2000000, isActive: true
        };
    }
    loadAuthorityRules() {
        this.authorityRulesLoading = true;
        this.authorityRulesError = null;
        this.adminService.listAuthorityRules().subscribe((rows) => { this.authorityRules = rows; this.authorityRulesLoading = false; }, (err) => { this.authorityRulesError = err.message; this.authorityRulesLoading = false; });
    }
    saveAuthorityRule() {
        this.authorityRuleSaving = true;
        this.authorityRuleFormError = null;
        this.adminService.saveAuthorityRule(this.authorityRuleForm).subscribe(() => {
            this.authorityRuleSaving = false;
            this.authorityRuleForm = this.blankAuthorityRuleForm();
            this.loadAuthorityRules();
        }, (err) => { this.authorityRuleFormError = err.message; this.authorityRuleSaving = false; });
    }
    editAuthorityRule(row) {
        this.authorityRuleForm = {
            id: row.id, role: row.role, lineOfBusiness: row.lineOfBusiness,
            maxPremium: row.maxPremium, maxSumInsured: row.maxSumInsured,
            maxLimit: row.maxLimit, isActive: row.isActive
        };
    }
    cancelAuthorityRuleEdit() {
        this.authorityRuleForm = this.blankAuthorityRuleForm();
    }
    // ---------- Parameters ----------
    loadParameters() {
        this.parametersLoading = true;
        this.parametersError = null;
        this.adminService.listParameters().subscribe((rows) => { this.parameters = rows; this.parametersLoading = false; }, (err) => { this.parametersError = err.message; this.parametersLoading = false; });
    }
    startEditParam(param) {
        this.editingParamKey = param.key;
        this.paramEditValue = param.value;
    }
    cancelEditParam() {
        this.editingParamKey = null;
        this.paramEditValue = '';
    }
    saveParam(param) {
        this.paramSaving = true;
        this.adminService.saveParameter(param.key, this.paramEditValue, param.description, param.dataType).subscribe(() => { this.paramSaving = false; this.editingParamKey = null; this.loadParameters(); }, (err) => { this.parametersError = err.message; this.paramSaving = false; });
    }
    // ---------- Holidays ----------
    loadHolidays() {
        this.holidaysLoading = true;
        this.holidaysError = null;
        this.adminService.listHolidays().subscribe((rows) => {
            this.holidays = rows.slice().sort((a, b) => a.holidayDate.localeCompare(b.holidayDate));
            this.holidaysLoading = false;
        }, (err) => { this.holidaysError = err.message; this.holidaysLoading = false; });
    }
    addHoliday() {
        if (!this.holidayForm.holidayDate || !this.holidayForm.description) {
            this.holidayFormError = 'Please provide a date and description.';
            return;
        }
        this.holidaySaving = true;
        this.holidayFormError = null;
        this.adminService.addHoliday(this.holidayForm.holidayDate, this.holidayForm.description, this.holidayForm.countryCode).subscribe(() => {
            this.holidaySaving = false;
            this.holidayForm = { holidayDate: '', description: '', countryCode: 'GB' };
            this.loadHolidays();
        }, (err) => { this.holidayFormError = err.message; this.holidaySaving = false; });
    }
};
AdminComponent.ctorParameters = () => [
    { type: _admin_service__WEBPACK_IMPORTED_MODULE_2__["AdminService"] },
    { type: _core_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"] }
];
AdminComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'apex-admin',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./admin.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/features/admin/admin.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./admin.component.css */ "./src/app/features/admin/admin.component.css")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_admin_service__WEBPACK_IMPORTED_MODULE_2__["AdminService"], _core_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"]])
], AdminComponent);



/***/ }),

/***/ "./src/app/features/admin/admin.module.ts":
/*!************************************************!*\
  !*** ./src/app/features/admin/admin.module.ts ***!
  \************************************************/
/*! exports provided: AdminModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminModule", function() { return AdminModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _admin_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./admin-routing.module */ "./src/app/features/admin/admin-routing.module.ts");
/* harmony import */ var _admin_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./admin.component */ "./src/app/features/admin/admin.component.ts");





let AdminModule = class AdminModule {
};
AdminModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [_admin_component__WEBPACK_IMPORTED_MODULE_4__["AdminComponent"]],
        imports: [_shared_shared_module__WEBPACK_IMPORTED_MODULE_2__["SharedModule"], _admin_routing_module__WEBPACK_IMPORTED_MODULE_3__["AdminRoutingModule"]]
    })
], AdminModule);



/***/ }),

/***/ "./src/app/features/admin/admin.service.ts":
/*!*************************************************!*\
  !*** ./src/app/features/admin/admin.service.ts ***!
  \*************************************************/
/*! exports provided: AdminService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminService", function() { return AdminService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _core_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/api.service */ "./src/app/core/api.service.ts");



let AdminService = class AdminService {
    constructor(api) {
        this.api = api;
    }
    // Users
    listUsers(activeOnly = false) {
        return this.api.get('/admin/users', { activeOnly });
    }
    createUser(request) {
        return this.api.post('/admin/users', request);
    }
    updateUser(id, request) {
        return this.api.put(`/admin/users/${id}`, request);
    }
    deactivateUser(id) {
        return this.api.post(`/admin/users/${id}/deactivate`);
    }
    resetPassword(id, newPassword) {
        return this.api.post(`/admin/users/${id}/reset-password`, newPassword);
    }
    // Teams (needed for the user form's team dropdown)
    listTeams() {
        return this.api.get('/admin/teams');
    }
    // Trades (needed for rate table / referral rule dropdowns)
    listTrades() {
        return this.api.get('/admin/trades');
    }
    // Rate tables
    listRateTables(lob) {
        return this.api.get('/admin/rate-tables', { lob });
    }
    saveRateTable(request) {
        return this.api.post('/admin/rate-tables', request);
    }
    // Referral rules
    listReferralRules() {
        return this.api.get('/admin/referral-rules');
    }
    saveReferralRule(request) {
        return this.api.post('/admin/referral-rules', request);
    }
    // Authority rules
    listAuthorityRules() {
        return this.api.get('/admin/authority-rules');
    }
    saveAuthorityRule(request) {
        return this.api.post('/admin/authority-rules', request);
    }
    // Parameters
    listParameters() {
        return this.api.get('/admin/parameters');
    }
    saveParameter(key, value, description, dataType) {
        return this.api.put(`/admin/parameters/${encodeURIComponent(key)}`, { key, value, description, dataType });
    }
    // Holidays
    listHolidays(year) {
        return this.api.get('/admin/holidays', { year });
    }
    addHoliday(holidayDate, description, countryCode) {
        return this.api.post('/admin/holidays', { holidayDate, description, countryCode });
    }
};
AdminService.ctorParameters = () => [
    { type: _core_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"] }
];
AdminService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_core_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"]])
], AdminService);



/***/ })

}]);
//# sourceMappingURL=features-admin-admin-module.js.map