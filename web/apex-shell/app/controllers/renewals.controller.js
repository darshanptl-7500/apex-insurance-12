(function () {
    'use strict';

    angular.module('apexApp').controller('RenewalsController', [
        '$location', 'ApiService',
        function ($location, ApiService) {
            var vm = this;

            vm.loading = true;
            vm.error = null;
            vm.items = [];
            vm.daysAhead = 90;
            vm.busyId = null;
            vm.actionError = null;

            function load() {
                vm.loading = true;
                vm.error = null;
                ApiService.get('/policies/renewal-diary', { daysAhead: vm.daysAhead })
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

            vm.reload = load;

            vm.createRenewal = function (item) {
                vm.busyId = item.policyId;
                vm.actionError = null;
                ApiService.post('/policies/' + item.policyId + '/create-renewal', {})
                    .then(function (data) {
                        var sid = data && (data.submissionId || data.SubmissionId);
                        if (sid) {
                            $location.path('/submissions/' + sid);
                        } else {
                            load();
                        }
                    })
                    .catch(function (err) {
                        vm.actionError = err.message;
                    })
                    .finally(function () {
                        vm.busyId = null;
                    });
            };

            load();
        }
    ]);
})();
