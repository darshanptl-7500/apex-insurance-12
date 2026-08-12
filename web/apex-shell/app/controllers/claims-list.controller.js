(function () {
    'use strict';

    angular.module('apexApp').controller('ClaimsListController', [
        '$location', 'ApiService', 'APEX_ENUMS',
        function ($location, ApiService, APEX_ENUMS) {
            var vm = this;

            vm.loading = true;
            vm.error = null;
            vm.claims = [];
            vm.enums = APEX_ENUMS;
            vm.policies = [];

            vm.filters = {
                status: '',
                policyId: $location.search().policyId || ''
            };

            vm.statusOptions = [
                { value: '', label: 'All open (default)' },
                { value: 'Open', label: 'Open' },
                { value: 'ReservedForPayment', label: 'Reserved for payment' },
                { value: 'Paid', label: 'Paid' },
                { value: 'Closed', label: 'Closed' },
                { value: 'Declined', label: 'Declined' },
                { value: 'Reopened', label: 'Reopened' }
            ];

            vm.showFnolForm = false;
            vm.fnolBusy = false;
            vm.fnolError = null;
            vm.fnol = {
                policyId: '',
                dateOfLoss: new Date(),
                description: '',
                initialReserve: 0
            };

            function toIsoDate(value) {
                if (!value) { return null; }
                if (typeof value === 'string') { return value; }
                var d = value instanceof Date ? value : new Date(value);
                if (isNaN(d.getTime())) { return null; }
                var y = d.getFullYear();
                var m = ('0' + (d.getMonth() + 1)).slice(-2);
                var day = ('0' + d.getDate()).slice(-2);
                return y + '-' + m + '-' + day;
            }

            ApiService.get('/policies', { pageSize: 100 }).then(function (data) {
                vm.policies = (data && data.items) || data || [];
            }).catch(function () {
                vm.policies = [];
            });

            function load() {
                vm.loading = true;
                vm.error = null;
                var params = {};
                if (vm.filters.policyId) { params.policyId = vm.filters.policyId; }
                if (vm.filters.status) { params.status = vm.filters.status; }
                ApiService.get('/claims', params).then(function (data) {
                    vm.claims = (data && data.items) || data || [];
                }).catch(function (err) {
                    vm.error = err.message;
                    vm.claims = [];
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.applyFilters = function () { load(); };
            vm.resetFilters = function () {
                vm.filters = { status: '', policyId: '' };
                $location.search({});
                load();
            };

            vm.toggleFnolForm = function () {
                vm.showFnolForm = !vm.showFnolForm;
                vm.fnolError = null;
            };

            vm.submitFnol = function () {
                if (!vm.fnol.policyId || !vm.fnol.dateOfLoss || !vm.fnol.description) {
                    vm.fnolError = 'Policy, loss date and description are required.';
                    return;
                }
                vm.fnolBusy = true;
                vm.fnolError = null;
                ApiService.post('/claims/fnol', {
                    policyId: Number(vm.fnol.policyId),
                    dateOfLoss: toIsoDate(vm.fnol.dateOfLoss),
                    description: vm.fnol.description,
                    initialReserve: Number(vm.fnol.initialReserve) || 0
                }).then(function (claim) {
                    $location.path('/claims/' + claim.id);
                }).catch(function (err) {
                    vm.fnolError = err.message;
                }).finally(function () {
                    vm.fnolBusy = false;
                });
            };

            load();
        }
    ]);
})();
