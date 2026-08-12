(function () {
    'use strict';

    angular.module('apexApp').factory('AuthService', [
        '$http', '$q', 'API_BASE_URL', 'APEX_CONFIG',
        function ($http, $q, API_BASE_URL, APEX_CONFIG) {

            var TOKEN_KEY = (APEX_CONFIG && APEX_CONFIG.tokenStorageKey) || 'apex_token';
            var USER_KEY = (APEX_CONFIG && APEX_CONFIG.userStorageKey) || 'apex_user';

            function readUser() {
                var raw = localStorage.getItem(USER_KEY);
                if (!raw) { return null; }
                try {
                    return JSON.parse(raw);
                } catch (e) {
                    return null;
                }
            }

            var service = {

                login: function (username, password) {
                    return $http.post(API_BASE_URL + '/auth/login', {
                        username: username,
                        password: password
                    }).then(function (response) {
                        var data = response.data || {};
                        if (!data.token) {
                            return $q.reject({ data: { message: 'Login response did not include a token.' } });
                        }
                        var apiUser = data.user || {};
                        var roleMap = {
                            0: 'Underwriter',
                            1: 'UnderwritingManager',
                            2: 'BrokerOps',
                            3: 'ClaimsHandler',
                            4: 'Admin'
                        };
                        var role = apiUser.role;
                        if (typeof role === 'number') {
                            role = roleMap[role] || String(role);
                        }
                        var user = {
                            id: apiUser.id,
                            username: apiUser.username,
                            email: apiUser.email,
                            displayName: apiUser.fullName || apiUser.displayName || apiUser.username,
                            role: role,
                            teamId: apiUser.teamId
                        };
                        localStorage.setItem(TOKEN_KEY, data.token);
                        localStorage.setItem(USER_KEY, JSON.stringify(user));
                        data.user = user;
                        return data;
                    });
                },

                logout: function () {
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(USER_KEY);
                },

                getToken: function () {
                    return localStorage.getItem(TOKEN_KEY);
                },

                isAuthenticated: function () {
                    return !!localStorage.getItem(TOKEN_KEY);
                },

                currentUser: function () {
                    return readUser() || { displayName: 'Guest', role: '', username: '' };
                },

                hasRole: function () {
                    var roles = Array.prototype.slice.call(arguments);
                    var user = readUser();
                    if (!user || !user.role) { return false; }
                    return roles.indexOf(user.role) !== -1;
                }
            };

            return service;
        }
    ]);
})();
