(function () {
    'use strict';

    var apexApp = angular.module('apexApp');

    /**
     * Attaches "Authorization: Bearer <token>" to every request aimed at the
     * Apex API, and redirects to /login on a 401 response (expired/invalid
     * token), preserving the path the user was trying to reach.
     */
    apexApp.factory('AuthInterceptor', [
        '$q', '$injector', '$window', 'API_BASE_URL', 'APEX_CONFIG',
        function ($q, $injector, $window, API_BASE_URL, APEX_CONFIG) {

            var TOKEN_KEY = (APEX_CONFIG && APEX_CONFIG.tokenStorageKey) || 'apex_token';

            return {
                request: function (config) {
                    if (config.url.indexOf(API_BASE_URL) === 0) {
                        var token = $window.localStorage.getItem(TOKEN_KEY);
                        if (token) {
                            config.headers = config.headers || {};
                            config.headers.Authorization = 'Bearer ' + token;
                        }
                    }
                    return config;
                },
                responseError: function (rejection) {
                    if (rejection.status === 401) {
                        var $location = $injector.get('$location');
                        $window.localStorage.removeItem(TOKEN_KEY);
                        $location.path('/login');
                    }
                    return $q.reject(rejection);
                }
            };
        }
    ]);

    apexApp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }]);

    /**
     * Thin REST wrapper. Every screen goes through here so the base URL,
     * error normalisation, and auth headers stay in exactly one place.
     *
     * API contract assumed by this shell (see /web/README.md for the full
     * list) — the legacy Web API host is expected to expose:
     *   POST   /auth/login
     *   GET    /submissions            GET /submissions/:id
     *   POST   /submissions/:id/quotes POST /submissions/:id/risk-answers
     *   POST   /submissions/:id/select-quote
     *   PUT    /submissions/:id
     *   GET    /policies               GET /policies/:id
     *   POST   /policies/:id/endorsements
     *   POST   /policies/:id/cancel
     *   GET    /claims                 GET /claims/:id     POST /claims
     *   PUT    /claims/:id
     *   GET    /brokers                GET /brokers/:id
     *   GET    /documents              POST /documents (multipart)
     */
    apexApp.factory('ApiService', [
        '$http', '$q', 'API_BASE_URL',
        function ($http, $q, API_BASE_URL) {

            function url(path) {
                if (path.indexOf('http') === 0) { return path; }
                return API_BASE_URL + path;
            }

            function normaliseError(err) {
                var message = 'Unexpected error contacting the API.';
                if (err) {
                    if (err.status === 0) {
                        message = 'Could not reach the Apex API at ' + API_BASE_URL + '. Confirm the service is running.';
                    } else if (err.data && err.data.message) {
                        message = err.data.message;
                    } else if (err.status) {
                        message = 'API returned HTTP ' + err.status + (err.statusText ? (' ' + err.statusText) : '') + '.';
                    }
                }
                return { message: message, status: err ? err.status : null, raw: err };
            }

            var service = {
                get: function (path, params) {
                    return $http.get(url(path), { params: params || {} })
                        .then(function (r) { return r.data; })
                        .catch(function (e) { return $q.reject(normaliseError(e)); });
                },
                post: function (path, body) {
                    return $http.post(url(path), body || {})
                        .then(function (r) { return r.data; })
                        .catch(function (e) { return $q.reject(normaliseError(e)); });
                },
                put: function (path, body) {
                    return $http.put(url(path), body || {})
                        .then(function (r) { return r.data; })
                        .catch(function (e) { return $q.reject(normaliseError(e)); });
                },
                remove: function (path) {
                    return $http.delete(url(path))
                        .then(function (r) { return r.data; })
                        .catch(function (e) { return $q.reject(normaliseError(e)); });
                },
                upload: function (path, formData) {
                    return $http.post(url(path), formData, {
                        transformRequest: angular.identity,
                        headers: { 'Content-Type': undefined }
                    })
                        .then(function (r) { return r.data; })
                        .catch(function (e) { return $q.reject(normaliseError(e)); });
                },
                normaliseError: normaliseError,
                baseUrl: API_BASE_URL
            };

            return service;
        }
    ]);
})();
