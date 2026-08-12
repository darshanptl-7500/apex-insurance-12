(function () {
    'use strict';

    angular.module('apexApp').controller('PoliciesListController', [
        'ApiService', 'APEX_ENUMS',
        function (ApiService, APEX_ENUMS) {
            var vm = this;

            vm.loading = true;
            vm.error = null;
            vm.policies = [];
            vm.enums = APEX_ENUMS;

            vm.filters = { status: '', lineOfBusiness: '', search: '' };

            vm.statusOptions = [
                { value: '', label: 'All statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Cancelled', label: 'Cancelled' },
                { value: 'Expired', label: 'Expired' },
                { value: 'PendingRenewal', label: 'Pending Renewal' }
            ];

            vm.lobOptions = [
                { value: '', label: 'All lines of business' },
                { value: 'Property', label: 'Property' },
                { value: 'Liability', label: 'Liability' },
                { value: 'ProfessionalIndemnity', label: 'Professional Indemnity' }
            ];

            function load() {
                vm.loading = true;
                vm.error = null;
                ApiService.get('/policies', {
                    status: vm.filters.status || undefined,
                    lineOfBusiness: vm.filters.lineOfBusiness || undefined,
                    search: vm.filters.search || undefined
                }).then(function (data) {
                    vm.policies = (data && data.items) || data || [];
                }).catch(function (err) {
                    vm.error = err.message;
                    vm.policies = [];
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.applyFilters = function () { load(); };
            vm.resetFilters = function () {
                vm.filters = { status: '', lineOfBusiness: '', search: '' };
                load();
            };

            load();
        }
    ]);
})();
