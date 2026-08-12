(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./features/admin/admin.module": [
		"./src/app/features/admin/admin.module.ts",
		"common",
		"features-admin-admin-module"
	],
	"./features/case-hub/case-hub.module": [
		"./src/app/features/case-hub/case-hub.module.ts",
		"common",
		"features-case-hub-case-hub-module"
	],
	"./features/dashboard/dashboard.module": [
		"./src/app/features/dashboard/dashboard.module.ts",
		"common",
		"features-dashboard-dashboard-module"
	],
	"./features/login/login.module": [
		"./src/app/features/login/login.module.ts",
		"features-login-login-module"
	],
	"./features/modelling/modelling.module": [
		"./src/app/features/modelling/modelling.module.ts",
		"common",
		"features-modelling-modelling-module"
	],
	"./features/reporting/reporting.module": [
		"./src/app/features/reporting/reporting.module.ts",
		"common",
		"features-reporting-reporting-module"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(function() {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(function() {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = "./$$_lazy_route_resource lazy recursive";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html":
/*!**************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ng-container *ngIf=\"authenticated; else standalone\">\n  <div class=\"apex-shell\">\n\n    <header class=\"apex-chrome\">\n      <div class=\"apex-chrome__row apex-chrome__row--brand\">\n        <div class=\"apex-topbar__brand\">\n          <span class=\"apex-topbar__mark\">&#9670;</span>\n          <span class=\"apex-topbar__name\">Apex</span>\n          <span class=\"apex-topbar__uw\">UW</span>\n          <span class=\"apex-topbar__tagline\">Workbench</span>\n        </div>\n        <div class=\"apex-topbar__spacer\"></div>\n        <a class=\"apex-btn apex-btn--danger apex-btn--sm\" [href]=\"shellUrl('/submissions/new')\">+ NEW RISK</a>\n        <div class=\"apex-topbar__user\">\n          <span class=\"apex-topbar__username\">{{ user.displayName }}</span>\n          <span class=\"apex-topbar__role\">{{ user.role }}</span>\n          <button type=\"button\" class=\"apex-btn apex-btn--ghost apex-btn--sm\" (click)=\"logout()\">Log out</button>\n        </div>\n      </div>\n\n      <div class=\"apex-chrome__row apex-chrome__row--nav\">\n        <nav class=\"apex-primary-nav\">\n          <a routerLink=\"/dashboard\" [class.active]=\"isActive('/dashboard')\">Dashboard</a>\n          <a routerLink=\"/reporting\" [class.active]=\"isActive('/reporting')\">Reporting</a>\n          <a [href]=\"shellUrl('/pipeline/upcoming')\">Pipeline</a>\n          <a [href]=\"shellUrl('/inbox')\">Tasks</a>\n          <a routerLink=\"/case-hub\" [class.active]=\"isActive('/case-hub')\">Underwriter's File</a>\n          <a [href]=\"shellUrl('/search')\">Advanced Search</a>\n          <a [href]=\"shellUrl('/connect')\">Connect</a>\n          <a routerLink=\"/modelling\" [class.active]=\"isActive('/modelling')\">Pricing</a>\n          <a [href]=\"shellUrl('/support')\">Support</a>\n          <a *ngIf=\"isAdmin()\" routerLink=\"/admin\" [class.active]=\"isActive('/admin')\">Admin</a>\n        </nav>\n      </div>\n    </header>\n\n    <div class=\"apex-shell__body apex-shell__body--full\">\n      <main class=\"apex-shell__content apex-shell__content--dense\">\n        <router-outlet></router-outlet>\n      </main>\n    </div>\n  </div>\n</ng-container>\n\n<ng-template #standalone>\n  <div class=\"apex-standalone\">\n    <div class=\"apex-redirect-notice\" *ngIf=\"!isLoginRoute()\">\n      <div class=\"apex-spinner\"></div>\n      <p>Redirecting to sign in&hellip;</p>\n    </div>\n    <router-outlet></router-outlet>\n  </div>\n</ng-template>\n");

/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _core_auth_guard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/auth.guard */ "./src/app/core/auth.guard.ts");




/**
 * Angular 8 lazy loading uses the string module#export form.
 * Dynamic import().then() is Angular 9+ and will fail under @angular/cli 8.
 */
const routes = [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    {
        path: 'login',
        loadChildren: './features/login/login.module#LoginModule'
    },
    {
        path: 'dashboard',
        canActivate: [_core_auth_guard__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]],
        loadChildren: './features/dashboard/dashboard.module#DashboardModule'
    },
    {
        path: 'case-hub',
        canActivate: [_core_auth_guard__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]],
        loadChildren: './features/case-hub/case-hub.module#CaseHubModule'
    },
    {
        path: 'reporting',
        canActivate: [_core_auth_guard__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]],
        loadChildren: './features/reporting/reporting.module#ReportingModule'
    },
    {
        path: 'modelling',
        canActivate: [_core_auth_guard__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]],
        loadChildren: './features/modelling/modelling.module#ModellingModule'
    },
    {
        path: 'admin',
        canActivate: [_core_auth_guard__WEBPACK_IMPORTED_MODULE_3__["AuthGuard"]],
        data: { role: 'Admin' },
        loadChildren: './features/admin/admin.module#AdminModule'
    },
    { path: '**', redirectTo: 'dashboard' }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })
], AppRoutingModule);



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (":host {\n  display: block;\n}\n\n.apex-chrome {\n  flex: 0 0 auto;\n  background: #1a1a1a;\n  color: #EAF0F7;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);\n  z-index: 20;\n}\n\n.apex-chrome__row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 0 16px;\n  min-height: 44px;\n}\n\n.apex-chrome__row--brand {\n  border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n  padding-top: 6px;\n  padding-bottom: 6px;\n  flex-wrap: wrap;\n}\n\n.apex-chrome__row--nav {\n  background: #2a2a2a;\n  border-bottom: 2px solid #C62828;\n  padding: 0;\n  min-height: 40px;\n  align-items: stretch;\n}\n\n.apex-topbar__brand { display: flex; align-items: baseline; gap: 8px; }\n\n.apex-topbar__mark { color: var(--apex-gold); font-size: 18px; }\n\n.apex-topbar__name {\n  font-family: Georgia, \"Times New Roman\", serif;\n  font-size: 20px;\n  letter-spacing: 0.02em;\n  color: #FFFFFF;\n  font-weight: 700;\n}\n\n.apex-topbar__uw {\n  background: #C62828;\n  color: #fff;\n  font-size: 11px;\n  font-weight: 700;\n  letter-spacing: 0.08em;\n  padding: 3px 8px;\n  border-radius: 10px;\n  margin-left: 4px;\n}\n\n.apex-topbar__tagline {\n  font-size: 11px;\n  color: #9FB3C8;\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  border-left: 1px solid rgba(255, 255, 255, 0.25);\n  padding-left: 10px;\n  margin-left: 2px;\n}\n\n.apex-topbar__spacer { flex: 1 1 auto; }\n\n.apex-topbar__user { display: flex; align-items: center; gap: 10px; }\n\n.apex-topbar__username { font-weight: 600; color: #FFFFFF; }\n\n.apex-topbar__role {\n  font-size: 11px;\n  color: #9FB3C8;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  border: 1px solid rgba(255, 255, 255, 0.25);\n  border-radius: 10px;\n  padding: 2px 8px;\n}\n\n.apex-chrome .apex-btn--ghost {\n  color: #EAF0F7;\n  border-color: rgba(255, 255, 255, 0.3);\n}\n\n.apex-chrome .apex-btn--ghost:hover {\n  background: rgba(255, 255, 255, 0.1);\n  color: #fff;\n}\n\n.apex-primary-nav {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0;\n  background: transparent;\n  border-bottom: none;\n  flex: 1 1 auto;\n  min-width: 0;\n}\n\n.apex-primary-nav a {\n  color: #E0E0E0;\n  padding: 10px 11px;\n  font-size: 12px;\n  font-weight: 600;\n  text-decoration: none;\n  border-bottom: 3px solid transparent;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  white-space: nowrap;\n}\n\n.apex-primary-nav a:hover {\n  background: rgba(255, 255, 255, 0.06);\n  color: #fff;\n  text-decoration: none;\n}\n\n.apex-primary-nav a.active {\n  color: #fff;\n  border-bottom-color: #C62828;\n  background: #1f1f1f;\n}\n\n.apex-shell__body--full {\n  display: block;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow: auto;\n}\n\n.apex-shell__content--dense {\n  padding: 12px 16px 28px;\n  max-width: 100%;\n}\n\n.apex-redirect-notice {\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 14px;\n  color: var(--apex-text-muted);\n  font-family: Georgia, serif;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsY0FBYztFQUNkLG1CQUFtQjtFQUNuQixjQUFjO0VBQ2QseUNBQXlDO0VBQ3pDLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsU0FBUztFQUNULGVBQWU7RUFDZixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxrREFBa0Q7RUFDbEQsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtFQUNuQixlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsbUJBQW1CO0VBQ25CLGdDQUFnQztFQUNoQyxVQUFVO0VBQ1YsZ0JBQWdCO0VBQ2hCLG9CQUFvQjtBQUN0Qjs7QUFFQSxzQkFBc0IsYUFBYSxFQUFFLHFCQUFxQixFQUFFLFFBQVEsRUFBRTs7QUFDdEUscUJBQXFCLHVCQUF1QixFQUFFLGVBQWUsRUFBRTs7QUFDL0Q7RUFDRSw4Q0FBOEM7RUFDOUMsZUFBZTtFQUNmLHNCQUFzQjtFQUN0QixjQUFjO0VBQ2QsZ0JBQWdCO0FBQ2xCOztBQUNBO0VBQ0UsbUJBQW1CO0VBQ25CLFdBQVc7RUFDWCxlQUFlO0VBQ2YsZ0JBQWdCO0VBQ2hCLHNCQUFzQjtFQUN0QixnQkFBZ0I7RUFDaEIsbUJBQW1CO0VBQ25CLGdCQUFnQjtBQUNsQjs7QUFDQTtFQUNFLGVBQWU7RUFDZixjQUFjO0VBQ2QseUJBQXlCO0VBQ3pCLHNCQUFzQjtFQUN0QixnREFBZ0Q7RUFDaEQsa0JBQWtCO0VBQ2xCLGdCQUFnQjtBQUNsQjs7QUFDQSx1QkFBdUIsY0FBYyxFQUFFOztBQUV2QyxxQkFBcUIsYUFBYSxFQUFFLG1CQUFtQixFQUFFLFNBQVMsRUFBRTs7QUFDcEUseUJBQXlCLGdCQUFnQixFQUFFLGNBQWMsRUFBRTs7QUFDM0Q7RUFDRSxlQUFlO0VBQ2YsY0FBYztFQUNkLHlCQUF5QjtFQUN6QixzQkFBc0I7RUFDdEIsMkNBQTJDO0VBQzNDLG1CQUFtQjtFQUNuQixnQkFBZ0I7QUFDbEI7O0FBRUE7RUFDRSxjQUFjO0VBQ2Qsc0NBQXNDO0FBQ3hDOztBQUNBO0VBQ0Usb0NBQW9DO0VBQ3BDLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGFBQWE7RUFDYixlQUFlO0VBQ2YsTUFBTTtFQUNOLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsY0FBYztFQUNkLFlBQVk7QUFDZDs7QUFFQTtFQUNFLGNBQWM7RUFDZCxrQkFBa0I7RUFDbEIsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixxQkFBcUI7RUFDckIsb0NBQW9DO0VBQ3BDLG9CQUFvQjtFQUNwQixtQkFBbUI7RUFDbkIsUUFBUTtFQUNSLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLHFDQUFxQztFQUNyQyxXQUFXO0VBQ1gscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0UsV0FBVztFQUNYLDRCQUE0QjtFQUM1QixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxjQUFjO0VBQ2QsY0FBYztFQUNkLGFBQWE7RUFDYixjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsdUJBQXVCO0VBQ3ZCLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixtQkFBbUI7RUFDbkIsdUJBQXVCO0VBQ3ZCLFNBQVM7RUFDVCw2QkFBNkI7RUFDN0IsMkJBQTJCO0FBQzdCIiwiZmlsZSI6InNyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4uYXBleC1jaHJvbWUge1xuICBmbGV4OiAwIDAgYXV0bztcbiAgYmFja2dyb3VuZDogIzFhMWExYTtcbiAgY29sb3I6ICNFQUYwRjc7XG4gIGJveC1zaGFkb3c6IDAgMnB4IDZweCByZ2JhKDAsIDAsIDAsIDAuMjUpO1xuICB6LWluZGV4OiAyMDtcbn1cblxuLmFwZXgtY2hyb21lX19yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDEwcHg7XG4gIHBhZGRpbmc6IDAgMTZweDtcbiAgbWluLWhlaWdodDogNDRweDtcbn1cblxuLmFwZXgtY2hyb21lX19yb3ctLWJyYW5kIHtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCk7XG4gIHBhZGRpbmctdG9wOiA2cHg7XG4gIHBhZGRpbmctYm90dG9tOiA2cHg7XG4gIGZsZXgtd3JhcDogd3JhcDtcbn1cblxuLmFwZXgtY2hyb21lX19yb3ctLW5hdiB7XG4gIGJhY2tncm91bmQ6ICMyYTJhMmE7XG4gIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCAjQzYyODI4O1xuICBwYWRkaW5nOiAwO1xuICBtaW4taGVpZ2h0OiA0MHB4O1xuICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbn1cblxuLmFwZXgtdG9wYmFyX19icmFuZCB7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBiYXNlbGluZTsgZ2FwOiA4cHg7IH1cbi5hcGV4LXRvcGJhcl9fbWFyayB7IGNvbG9yOiB2YXIoLS1hcGV4LWdvbGQpOyBmb250LXNpemU6IDE4cHg7IH1cbi5hcGV4LXRvcGJhcl9fbmFtZSB7XG4gIGZvbnQtZmFtaWx5OiBHZW9yZ2lhLCBcIlRpbWVzIE5ldyBSb21hblwiLCBzZXJpZjtcbiAgZm9udC1zaXplOiAyMHB4O1xuICBsZXR0ZXItc3BhY2luZzogMC4wMmVtO1xuICBjb2xvcjogI0ZGRkZGRjtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbn1cbi5hcGV4LXRvcGJhcl9fdXcge1xuICBiYWNrZ3JvdW5kOiAjQzYyODI4O1xuICBjb2xvcjogI2ZmZjtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBsZXR0ZXItc3BhY2luZzogMC4wOGVtO1xuICBwYWRkaW5nOiAzcHggOHB4O1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICBtYXJnaW4tbGVmdDogNHB4O1xufVxuLmFwZXgtdG9wYmFyX190YWdsaW5lIHtcbiAgZm9udC1zaXplOiAxMXB4O1xuICBjb2xvcjogIzlGQjNDODtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgbGV0dGVyLXNwYWNpbmc6IDAuMDhlbTtcbiAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMjUpO1xuICBwYWRkaW5nLWxlZnQ6IDEwcHg7XG4gIG1hcmdpbi1sZWZ0OiAycHg7XG59XG4uYXBleC10b3BiYXJfX3NwYWNlciB7IGZsZXg6IDEgMSBhdXRvOyB9XG5cbi5hcGV4LXRvcGJhcl9fdXNlciB7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGdhcDogMTBweDsgfVxuLmFwZXgtdG9wYmFyX191c2VybmFtZSB7IGZvbnQtd2VpZ2h0OiA2MDA7IGNvbG9yOiAjRkZGRkZGOyB9XG4uYXBleC10b3BiYXJfX3JvbGUge1xuICBmb250LXNpemU6IDExcHg7XG4gIGNvbG9yOiAjOUZCM0M4O1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBsZXR0ZXItc3BhY2luZzogMC4wNWVtO1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMjUpO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICBwYWRkaW5nOiAycHggOHB4O1xufVxuXG4uYXBleC1jaHJvbWUgLmFwZXgtYnRuLS1naG9zdCB7XG4gIGNvbG9yOiAjRUFGMEY3O1xuICBib3JkZXItY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKTtcbn1cbi5hcGV4LWNocm9tZSAuYXBleC1idG4tLWdob3N0OmhvdmVyIHtcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpO1xuICBjb2xvcjogI2ZmZjtcbn1cblxuLmFwZXgtcHJpbWFyeS1uYXYge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGdhcDogMDtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1ib3R0b206IG5vbmU7XG4gIGZsZXg6IDEgMSBhdXRvO1xuICBtaW4td2lkdGg6IDA7XG59XG5cbi5hcGV4LXByaW1hcnktbmF2IGEge1xuICBjb2xvcjogI0UwRTBFMDtcbiAgcGFkZGluZzogMTBweCAxMXB4O1xuICBmb250LXNpemU6IDEycHg7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgYm9yZGVyLWJvdHRvbTogM3B4IHNvbGlkIHRyYW5zcGFyZW50O1xuICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiA2cHg7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XG59XG5cbi5hcGV4LXByaW1hcnktbmF2IGE6aG92ZXIge1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDYpO1xuICBjb2xvcjogI2ZmZjtcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xufVxuXG4uYXBleC1wcmltYXJ5LW5hdiBhLmFjdGl2ZSB7XG4gIGNvbG9yOiAjZmZmO1xuICBib3JkZXItYm90dG9tLWNvbG9yOiAjQzYyODI4O1xuICBiYWNrZ3JvdW5kOiAjMWYxZjFmO1xufVxuXG4uYXBleC1zaGVsbF9fYm9keS0tZnVsbCB7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICBmbGV4OiAxIDEgYXV0bztcbiAgbWluLWhlaWdodDogMDtcbiAgb3ZlcmZsb3c6IGF1dG87XG59XG5cbi5hcGV4LXNoZWxsX19jb250ZW50LS1kZW5zZSB7XG4gIHBhZGRpbmc6IDEycHggMTZweCAyOHB4O1xuICBtYXgtd2lkdGg6IDEwMCU7XG59XG5cbi5hcGV4LXJlZGlyZWN0LW5vdGljZSB7XG4gIG1pbi1oZWlnaHQ6IDEwMHZoO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZ2FwOiAxNHB4O1xuICBjb2xvcjogdmFyKC0tYXBleC10ZXh0LW11dGVkKTtcbiAgZm9udC1mYW1pbHk6IEdlb3JnaWEsIHNlcmlmO1xufVxuIl19 */");

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _core_auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/auth.service */ "./src/app/core/auth.service.ts");




let AppComponent = class AppComponent {
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
        this.title = 'Apex Insurance';
        this.currentPath = '';
        this.router.events.subscribe(event => {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_2__["NavigationEnd"]) {
                this.currentPath = event.urlAfterRedirects;
            }
        });
    }
    ngOnInit() {
        // Hybrid handoff: the AngularJS shell owns login. Unauthenticated visits
        // to an ng8 island bounce to the classic shell, which then returns with
        // ?token=... (see AuthService.hydrateFromQueryString).
        // Explicit /login remains available for standalone ng8 development only.
        if (!this.auth.isAuthenticated() && !this.isLoginRoute()) {
            this.auth.redirectToShellLogin();
        }
    }
    isLoginRoute() {
        return window.location.pathname.indexOf('/login') === 0;
    }
    get user() {
        return this.auth.currentUser();
    }
    get authenticated() {
        return this.auth.isAuthenticated();
    }
    isAdmin() {
        return this.auth.hasRole('Admin');
    }
    isManager() {
        return this.auth.hasRole('UnderwritingManager', 'Admin');
    }
    isActive(path) {
        return this.currentPath.indexOf(path) === 0;
    }
    logout() {
        this.auth.logout();
    }
    shellUrl(hashPath) {
        return this.auth.shellUrl(hashPath);
    }
};
AppComponent.ctorParameters = () => [
    { type: _core_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }
];
AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'apex-root',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_core_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
], AppComponent);



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm2015/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _core_auth_interceptor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./core/auth.interceptor */ "./src/app/core/auth.interceptor.ts");








let AppModule = class AppModule {
};
AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
        declarations: [
            _app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]
        ],
        imports: [
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
            _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__["SharedModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"]
        ],
        providers: [
            { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HTTP_INTERCEPTORS"], useClass: _core_auth_interceptor__WEBPACK_IMPORTED_MODULE_7__["AuthInterceptor"], multi: true }
        ],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]]
    })
], AppModule);



/***/ }),

/***/ "./src/app/core/auth.guard.ts":
/*!************************************!*\
  !*** ./src/app/core/auth.guard.ts ***!
  \************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./auth.service */ "./src/app/core/auth.service.ts");




let AuthGuard = class AuthGuard {
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
    }
    canActivate(route, _state) {
        if (this.auth.isAuthenticated()) {
            const requiredRole = route.data && route.data.role;
            if (requiredRole && !this.auth.hasRole(requiredRole)) {
                this.router.navigate(['/dashboard']);
                return false;
            }
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
};
AuthGuard.ctorParameters = () => [
    { type: _auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }
];
AuthGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_auth_service__WEBPACK_IMPORTED_MODULE_3__["AuthService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
], AuthGuard);



/***/ }),

/***/ "./src/app/core/auth.interceptor.ts":
/*!******************************************!*\
  !*** ./src/app/core/auth.interceptor.ts ***!
  \******************************************/
/*! exports provided: AuthInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthInterceptor", function() { return AuthInterceptor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./auth.service */ "./src/app/core/auth.service.ts");






let AuthInterceptor = class AuthInterceptor {
    constructor(auth) {
        this.auth = auth;
    }
    intercept(req, next) {
        let request = req;
        if (req.url.indexOf(_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].apiBaseUrl) === 0) {
            const token = this.auth.getToken();
            if (token) {
                request = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
            }
        }
        return next.handle(request).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(err => {
            // Don't bounce away while the user is submitting credentials on /login.
            const isLoginCall = req.url.indexOf('/auth/login') >= 0;
            if (err && err.status === 401 && !isLoginCall) {
                this.auth.redirectToLogin();
            }
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["throwError"])(err);
        }));
    }
};
AuthInterceptor.ctorParameters = () => [
    { type: _auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"] }
];
AuthInterceptor = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_auth_service__WEBPACK_IMPORTED_MODULE_5__["AuthService"]])
], AuthInterceptor);



/***/ }),

/***/ "./src/app/core/auth.service.ts":
/*!**************************************!*\
  !*** ./src/app/core/auth.service.ts ***!
  \**************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");





const TOKEN_KEY = 'apex_token';
const USER_KEY = 'apex_user';
const ROLE_BY_VALUE = {
    0: 'Underwriter',
    1: 'UnderwritingManager',
    2: 'BrokerOps',
    3: 'ClaimsHandler',
    4: 'Admin'
};
function normalizeRole(role) {
    if (typeof role === 'number') {
        return ROLE_BY_VALUE[role] || String(role);
    }
    if (role && !isNaN(Number(role)) && String(Number(role)) === String(role).trim()) {
        const asNum = Number(role);
        return ROLE_BY_VALUE[asNum] || role;
    }
    return role || '';
}
/**
 * Auth handoff in this hybrid app: the AngularJS shell normally owns the
 * login screen. When it links into an Angular 8 island it appends
 * `?token=...` to the URL; on boot this service adopts that token into
 * localStorage (scoped to this origin/port) so subsequent navigation within
 * the island doesn't need the query param anymore.
 *
 * The islands can also run standalone (e.g. hitting http://localhost:4201
 * directly during Angular 8 development) via the `/login` route below,
 * which talks to the same `POST /api/auth/login` endpoint the shell uses
 * and stores the token/user under the exact same localStorage keys
 * (`apex_token` / `apex_user`, see web/apex-shell/config.js) so both apps
 * stay in sync no matter which one signed the user in.
 */
let AuthService = class AuthService {
    constructor(http) {
        this.http = http;
        this.hydrateFromQueryString();
    }
    hydrateFromQueryString() {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
            // Ports 4200/4201 do not share localStorage — recover a minimal user from the demo token.
            this.tryHydrateUserFromToken(token);
            // Strip the token from the visible URL without reloading the page.
            params.delete('token');
            const cleanQuery = params.toString();
            const newUrl = window.location.pathname + (cleanQuery ? '?' + cleanQuery : '') + window.location.hash;
            window.history.replaceState({}, document.title, newUrl);
        }
    }
    tryHydrateUserFromToken(token) {
        try {
            const payload = JSON.parse(atob(token));
            const username = payload.Username || payload.username || '';
            const user = {
                id: payload.UserId || payload.userId || 0,
                username,
                displayName: username || 'User',
                role: normalizeRole(payload.Role || payload.role || '')
            };
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
        catch (_a) {
            // Token may not be demo-JSON; screens still work with bearer alone.
        }
    }
    /** Authenticates directly against the API. Used by the standalone /login screen. */
    login(username, password) {
        return this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].apiBaseUrl}/auth/login`, { username, password }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(res => {
            if (!res || !res.token) {
                throw { status: 401, error: { message: (res && res.errorMessage) || 'Login response did not include a token.' } };
            }
            const user = {
                id: res.user ? res.user.id : 0,
                username: res.user ? res.user.username : username,
                displayName: (res.user && res.user.fullName) || username,
                email: res.user ? res.user.email : undefined,
                // API may serialize UserRole as a number (Newtonsoft default) or string.
                role: normalizeRole(res.user ? res.user.role : ''),
                teamId: res.user ? res.user.teamId : undefined
            };
            localStorage.setItem(TOKEN_KEY, res.token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return user;
        }));
    }
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }
    isAuthenticated() {
        return !!this.getToken();
    }
    currentUser() {
        const raw = localStorage.getItem(USER_KEY);
        if (raw) {
            try {
                return JSON.parse(raw);
            }
            catch (_a) {
                // fall through to default below
            }
        }
        return { id: 0, username: '', displayName: 'Guest', role: '' };
    }
    hasRole(...roles) {
        const user = this.currentUser();
        return !!user.role && roles.indexOf(user.role) !== -1;
    }
    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        this.redirectToShellLogin();
    }
    /**
     * Hybrid auth: session bootstrap lives in the AngularJS shell (same origin).
     */
    redirectToShellLogin() {
        const returnTo = encodeURIComponent(window.location.href);
        window.location.href = `/#!/login?returnTo=${returnTo}`;
    }
    /** Alias used by the HTTP interceptor on 401. */
    redirectToLogin() {
        this.redirectToShellLogin();
    }
    shellUrl(hashPath) {
        const path = hashPath.indexOf('/') === 0 ? hashPath : '/' + hashPath;
        return `/#!${path}`;
    }
};
AuthService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
];
AuthService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
], AuthService);



/***/ }),

/***/ "./src/app/core/models.ts":
/*!********************************!*\
  !*** ./src/app/core/models.ts ***!
  \********************************/
/*! exports provided: LOB_OPTIONS, LOB_LABELS, SUBMISSION_STATUS_LABELS, SUBMISSION_STATUS_ORDER, POLICY_STATUS_LABELS, CLAIM_STATUS_LABELS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOB_OPTIONS", function() { return LOB_OPTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LOB_LABELS", function() { return LOB_LABELS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUBMISSION_STATUS_LABELS", function() { return SUBMISSION_STATUS_LABELS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SUBMISSION_STATUS_ORDER", function() { return SUBMISSION_STATUS_ORDER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "POLICY_STATUS_LABELS", function() { return POLICY_STATUS_LABELS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CLAIM_STATUS_LABELS", function() { return CLAIM_STATUS_LABELS; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/**
 * Shared TypeScript models mirroring the ApexInsurance API's actual JSON
 * contracts (see src/ApexInsurance.Api/Controllers + src/ApexInsurance.Api/Models
 * + src/ApexInsurance.Services/Dto) so the Angular 8 islands agree on shape
 * with the real backend.
 *
 * NOTE: WebApiConfig.cs configures CamelCasePropertyNamesContractResolver +
 * StringEnumConverter, so every C# `PascalCase` property crosses the wire as
 * `camelCase`, and every enum crosses the wire as its PascalCase *name*
 * (e.g. "NotTakenUp"), never as a number. Interfaces below use camelCase
 * fields and `string` for enum-typed fields.
 */

const LOB_OPTIONS = ['Property', 'Liability', 'ProfessionalIndemnity'];
const LOB_LABELS = {
    Property: 'Property',
    Liability: 'Liability',
    ProfessionalIndemnity: 'Professional Indemnity'
};
const SUBMISSION_STATUS_LABELS = {
    Received: 'Received', Triaged: 'Triaged', Quoted: 'Quoted', Referred: 'Referred',
    Bound: 'Bound', Declined: 'Declined', NotTakenUp: 'Not Taken Up'
};
/** Ordinal order of the submission pipeline, used for "has this stage happened yet" checks. */
const SUBMISSION_STATUS_ORDER = [
    'Received', 'Triaged', 'Quoted', 'Referred', 'Bound', 'Declined', 'NotTakenUp'
];
const POLICY_STATUS_LABELS = {
    Active: 'Active', Cancelled: 'Cancelled', Expired: 'Expired', PendingRenewal: 'Pending Renewal', Renewed: 'Renewed'
};
const CLAIM_STATUS_LABELS = {
    Open: 'Open', ReservedForPayment: 'Reserved for Payment', Paid: 'Paid',
    Closed: 'Closed', Declined: 'Declined', Reopened: 'Reopened'
};


/***/ }),

/***/ "./src/app/shared/empty-state.component.ts":
/*!*************************************************!*\
  !*** ./src/app/shared/empty-state.component.ts ***!
  \*************************************************/
/*! exports provided: EmptyStateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmptyStateComponent", function() { return EmptyStateComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


let EmptyStateComponent = class EmptyStateComponent {
    constructor() {
        this.title = 'Nothing to show';
        this.message = '';
    }
};
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
], EmptyStateComponent.prototype, "title", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
], EmptyStateComponent.prototype, "message", void 0);
EmptyStateComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'apex-empty-state',
        template: `
    <div class="apex-empty">
      <div class="apex-empty__icon">&#9723;</div>
      <div class="apex-empty__title">{{ title }}</div>
      <div>{{ message }}</div>
    </div>
  `
    })
], EmptyStateComponent);



/***/ }),

/***/ "./src/app/shared/loading.component.ts":
/*!*********************************************!*\
  !*** ./src/app/shared/loading.component.ts ***!
  \*********************************************/
/*! exports provided: LoadingComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoadingComponent", function() { return LoadingComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


let LoadingComponent = class LoadingComponent {
    constructor() {
        this.label = 'Loading…';
    }
};
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
], LoadingComponent.prototype, "label", void 0);
LoadingComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'apex-loading',
        template: `
    <div class="apex-loading">
      <span class="apex-spinner"></span> {{ label }}
    </div>
  `
    })
], LoadingComponent);



/***/ }),

/***/ "./src/app/shared/shared.module.ts":
/*!*****************************************!*\
  !*** ./src/app/shared/shared.module.ts ***!
  \*****************************************/
/*! exports provided: SharedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SharedModule", function() { return SharedModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _status_badge_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./status-badge.component */ "./src/app/shared/status-badge.component.ts");
/* harmony import */ var _empty_state_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./empty-state.component */ "./src/app/shared/empty-state.component.ts");
/* harmony import */ var _loading_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./loading.component */ "./src/app/shared/loading.component.ts");








let SharedModule = class SharedModule {
};
SharedModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [
            _status_badge_component__WEBPACK_IMPORTED_MODULE_5__["StatusBadgeComponent"],
            _empty_state_component__WEBPACK_IMPORTED_MODULE_6__["EmptyStateComponent"],
            _loading_component__WEBPACK_IMPORTED_MODULE_7__["LoadingComponent"]
        ],
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"]
        ],
        exports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
            _angular_router__WEBPACK_IMPORTED_MODULE_4__["RouterModule"],
            _status_badge_component__WEBPACK_IMPORTED_MODULE_5__["StatusBadgeComponent"],
            _empty_state_component__WEBPACK_IMPORTED_MODULE_6__["EmptyStateComponent"],
            _loading_component__WEBPACK_IMPORTED_MODULE_7__["LoadingComponent"]
        ]
    })
], SharedModule);



/***/ }),

/***/ "./src/app/shared/status-badge.component.ts":
/*!**************************************************!*\
  !*** ./src/app/shared/status-badge.component.ts ***!
  \**************************************************/
/*! exports provided: StatusBadgeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatusBadgeComponent", function() { return StatusBadgeComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _core_models__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/models */ "./src/app/core/models.ts");



// API enums cross the wire as PascalCase strings (StringEnumConverter), so
// both the label and CSS-class lookups below are keyed by that string name.
const BADGE_CLASS = {
    submission: { Received: 'neutral', Triaged: 'info', Quoted: 'gold', Referred: 'warn', Bound: 'success', Declined: 'danger', NotTakenUp: 'neutral' },
    policy: { Active: 'success', Cancelled: 'danger', Expired: 'neutral', PendingRenewal: 'warn', Renewed: 'info' },
    claim: { Open: 'info', ReservedForPayment: 'gold', Paid: 'success', Closed: 'neutral', Declined: 'danger', Reopened: 'warn' }
};
const LABELS = {
    submission: _core_models__WEBPACK_IMPORTED_MODULE_2__["SUBMISSION_STATUS_LABELS"],
    policy: _core_models__WEBPACK_IMPORTED_MODULE_2__["POLICY_STATUS_LABELS"],
    claim: _core_models__WEBPACK_IMPORTED_MODULE_2__["CLAIM_STATUS_LABELS"]
};
let StatusBadgeComponent = class StatusBadgeComponent {
    constructor() {
        this.kind = 'submission';
        this.label = '';
        this.badgeClass = 'neutral';
    }
    ngOnChanges() {
        const labels = LABELS[this.kind] || {};
        const classes = BADGE_CLASS[this.kind] || {};
        this.label = (this.value && labels[this.value]) || this.value || 'Unknown';
        this.badgeClass = (this.value && classes[this.value]) || 'neutral';
    }
};
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
], StatusBadgeComponent.prototype, "kind", void 0);
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", String)
], StatusBadgeComponent.prototype, "value", void 0);
StatusBadgeComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'apex-status-badge',
        template: `<span class="apex-badge" [ngClass]="'apex-badge--' + badgeClass">{{ label }}</span>`
    })
], StatusBadgeComponent);



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

const environment = {
    production: false,
    apiBaseUrl: 'http://localhost:52840/api',
    // Same origin as the AngularJS shell when hosted under /ng8/ on port 4200.
    shellBaseUrl: '',
    shellLoginPath: '/#!/login',
    /** UW Pricing portal (external). Override for real staging URL. */
    pricingUrl: 'https://example.invalid/pricing',
    /** Shared demo password for seeded accounts with a NULL PasswordHash. */
    demoPassword: 'Password1!',
    /**
     * Clickable demo personas. Keep in sync with web/apex-shell/config.js
     * and database seed users. To add a role: seed the user, then append here.
     */
    demoAccounts: [
        { username: 'uw1', role: 'Underwriter', name: 'Uma Underwriter', home: '/dashboard' },
        { username: 'mgr1', role: 'Underwriting Manager', name: 'Morgan Manager', home: '/dashboard' },
        { username: 'bro1', role: 'Broker Ops', name: 'Blair Broker Ops', home: '/dashboard' },
        { username: 'cl1', role: 'Claims Handler', name: 'Casey Claims', home: '/dashboard' },
        { username: 'admin', role: 'Admin', name: 'System Admin', home: '/admin' }
    ]
};


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm2015/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");





if (_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/dapatel/Projects/NetProjects/LegacyApps/ApexInsurancenet10/web/apex-ng8/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map