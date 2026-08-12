(function () {
    'use strict';

    angular.module('apexApp').controller('ShellController', [
        '$scope', '$location', '$interval', '$window', 'ApiService', 'AuthService', 'APEX_CONFIG',
        function ($scope, $location, $interval, $window, ApiService, AuthService, APEX_CONFIG) {
            var vm = this;

            vm.year = new Date().getFullYear();
            vm.now = new Date();
            vm.roe = $window.localStorage.getItem('apex_roe') || 'GBP';
            vm.badges = { openTasks: 0, referrals: 0, da: 0, ePlacement: 0 };
            vm.globalSearch = { category: 'all', text: '' };
            vm.deepLinks = {
                openBox: (APEX_CONFIG && APEX_CONFIG.openBoxUrl) || 'https://example.invalid/openbox',
                ePlacement: (APEX_CONFIG && APEX_CONFIG.ePlacementUrl) || 'https://example.invalid/e-placement',
                selfService: (APEX_CONFIG && APEX_CONFIG.selfServiceUrl) || 'https://example.invalid/self-service'
            };

            $interval(function () { vm.now = new Date(); }, 30000);

            vm.showChrome = function () {
                return AuthService.isAuthenticated() && $location.path() !== '/login';
            };

            vm.currentUser = function () {
                return AuthService.currentUser();
            };

            vm.isAdmin = function () {
                return AuthService.hasRole('Admin');
            };

            vm.isActive = function (path) {
                return $location.path().indexOf(path) === 0;
            };

            vm.isNg8 = function () {
                return false;
            };

            vm.logout = function () {
                AuthService.logout();
                $location.path('/login');
            };

            vm.ng8Url = function (routeKey) {
                var base = (APEX_CONFIG && APEX_CONFIG.ng8BaseUrl) || '/ng8';
                var route = (APEX_CONFIG && APEX_CONFIG.ng8Routes && APEX_CONFIG.ng8Routes[routeKey]) || '/';
                return base + route;
            };

            vm.setRoe = function (ccy) {
                vm.roe = ccy;
                $window.localStorage.setItem('apex_roe', ccy);
            };

            vm.refresh = function () {
                refreshBadges();
                $scope.$broadcast('apex:refresh');
            };

            vm.runGlobalSearch = function () {
                var q = (vm.globalSearch.text || '').trim();
                if (!q) { return; }
                $location.path('/search').search({ q: q, cat: vm.globalSearch.category });
            };

            function refreshBadges() {
                if (!AuthService.isAuthenticated()) { return; }
                ApiService.get('/pipeline/summary').then(function (data) {
                    vm.badges.openTasks = (data && data.openTasks) || 0;
                    vm.badges.referrals = (data && data.referrals) || 0;
                    vm.badges.da = (data && data.delegatedAuthority) || 0;
                    vm.badges.ePlacement = (data && data.ePlacement) || 0;
                }).catch(function () { /* ignore */ });
            }

            $scope.$watch(function () { return AuthService.isAuthenticated(); }, function (authed) {
                if (authed) { refreshBadges(); }
            });

            refreshBadges();
        }
    ]);
})();
