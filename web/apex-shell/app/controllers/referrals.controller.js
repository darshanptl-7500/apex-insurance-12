(function () {
    'use strict';

    angular.module('apexApp').controller('ReferralsController', [
        'ApiService', 'AuthService',
        function (ApiService, AuthService) {
            var vm = this;

            vm.loading = true;
            vm.error = null;
            vm.items = [];
            vm.busyId = null;
            vm.actionError = null;
            vm.comments = {};

            function load() {
                vm.loading = true;
                vm.error = null;
                ApiService.get('/workflow/referrals')
                    .then(function (data) {
                        vm.items = data || [];
                    })
                    .catch(function (err) {
                        vm.error = err.message;
                        vm.items = [];
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            function act(item, action) {
                vm.busyId = item.quoteId;
                vm.actionError = null;
                var body = { comments: vm.comments[item.quoteId] || null };
                ApiService.put('/workflow/referrals/' + item.quoteId + '/' + action, body)
                    .then(function () {
                        delete vm.comments[item.quoteId];
                        load();
                    })
                    .catch(function (err) {
                        vm.actionError = err.message;
                    })
                    .finally(function () {
                        vm.busyId = null;
                    });
            }

            vm.approve = function (item) { act(item, 'approve'); };
            vm.decline = function (item) { act(item, 'decline'); };
            vm.requestInfo = function (item) { act(item, 'request-info'); };

            vm.canManage = function () {
                return AuthService.hasRole('UnderwritingManager', 'Admin');
            };

            load();
        }
    ]);
})();
