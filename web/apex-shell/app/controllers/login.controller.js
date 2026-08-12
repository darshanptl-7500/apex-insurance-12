(function () {
    'use strict';

    angular.module('apexApp').controller('LoginController', [
        '$location', 'AuthService', 'APEX_CONFIG',
        function ($location, AuthService, APEX_CONFIG) {
            var vm = this;
            var demoPassword = (APEX_CONFIG && APEX_CONFIG.demoPassword) || 'Password1!';

            vm.credentials = { username: '', password: '' };
            vm.busy = false;
            vm.error = null;
            vm.demoAccounts = (APEX_CONFIG && APEX_CONFIG.demoAccounts) || [];
            vm.demoPassword = demoPassword;

            function goHome(account) {
                var returnTo = $location.search().returnTo;
                if (returnTo) {
                    window.location.href = returnTo;
                    return;
                }
                if (account && account.home) {
                    $location.path(account.home);
                    return;
                }
                $location.path('/pipeline/upcoming');
            }

            vm.submit = function (account) {
                if (!vm.credentials.username || !vm.credentials.password) {
                    vm.error = 'Enter both a username and password.';
                    return;
                }
                vm.busy = true;
                vm.error = null;

                AuthService.login(vm.credentials.username, vm.credentials.password)
                    .then(function () {
                        goHome(account);
                    })
                    .catch(function (err) {
                        var errData = (err && err.data) || {};
                        if (err && err.status === 0) {
                            vm.error = 'Could not reach the Apex API. Confirm the service is running.';
                        } else if (err && err.status === 401) {
                            vm.error = 'Invalid username or password.';
                        } else {
                            vm.error = errData.message || 'Login failed. Please try again.';
                        }
                    })
                    .finally(function () {
                        vm.busy = false;
                    });
            };

            /** One-click demo: fill credentials and sign in as that role. */
            vm.useDemo = function (account) {
                if (!account || vm.busy) return;
                vm.credentials.username = account.username;
                vm.credentials.password = demoPassword;
                vm.submit(account);
            };
        }
    ]);
})();
