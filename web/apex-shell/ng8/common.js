(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["common"],{

/***/ "./src/app/core/api.service.ts":
/*!*************************************!*\
  !*** ./src/app/core/api.service.ts ***!
  \*************************************/
/*! exports provided: ApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiService", function() { return ApiService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");






/**
 * Thin REST wrapper shared by every feature module. Centralising this here
 * keeps the base URL, param handling, and error normalisation in one place.
 *
 * The Angular 8 islands assume the same API contract as the AngularJS shell
 * (see /web/README.md "API contract" section) plus a handful of aggregate
 * endpoints for dashboard/reporting/modelling/admin screens:
 *   GET /dashboard/summary
 *   GET /modelling/exposure?groupBy=lob|territory|broker
 *   GET /reporting/premium-vs-target | /broker-league | /pipeline | /loss-ratio
 *   GET /audit?entityType=&entityId=
 *   GET/POST/PUT /admin/users | /admin/rate-tables | /admin/referral-rules | /admin/parameters
 */
let ApiService = class ApiService {
    constructor(http) {
        this.http = http;
        this.baseUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiBaseUrl;
    }
    get(path, params) {
        return this.http.get(this.url(path), { params: this.toHttpParams(params) })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(err => this.handleError(err)));
    }
    post(path, body = {}) {
        return this.http.post(this.url(path), body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(err => this.handleError(err)));
    }
    put(path, body = {}) {
        return this.http.put(this.url(path), body)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(err => this.handleError(err)));
    }
    delete(path) {
        return this.http.delete(this.url(path))
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["catchError"])(err => this.handleError(err)));
    }
    url(path) {
        return path.indexOf('http') === 0 ? path : `${this.baseUrl}${path}`;
    }
    toHttpParams(params) {
        let httpParams = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpParams"]();
        if (!params) {
            return httpParams;
        }
        Object.keys(params).forEach(key => {
            const value = params[key];
            if (value !== null && value !== undefined && value !== '') {
                httpParams = httpParams.set(key, String(value));
            }
        });
        return httpParams;
    }
    handleError(err) {
        let message = 'Unexpected error contacting the API.';
        if (err.status === 0) {
            message = `Could not reach the Apex API at ${this.baseUrl}. Confirm the service is running.`;
        }
        else if (err.error && err.error.message) {
            message = err.error.message;
        }
        else if (err.status) {
            message = `API returned HTTP ${err.status} ${err.statusText || ''}`.trim() + '.';
        }
        const apiError = { message, status: err.status || null };
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_3__["throwError"])(apiError);
    }
};
ApiService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
];
ApiService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
], ApiService);



/***/ })

}]);
//# sourceMappingURL=common.js.map