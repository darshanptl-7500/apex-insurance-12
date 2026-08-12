(function () {
    'use strict';

    angular.module('apexApp').controller('SubmissionsListController', [
        'ApiService', 'APEX_ENUMS',
        function (ApiService, APEX_ENUMS) {
            var vm = this;

            vm.loading = true;
            vm.error = null;
            vm.submissions = [];
            vm.enums = APEX_ENUMS;

            vm.filters = {
                status: '',
                lineOfBusiness: '',
                search: ''
            };

            // API expects enum names (strings), not numeric values.
            vm.statusOptions = [
                { value: '', label: 'All statuses' },
                { value: 'Received', label: 'Received' },
                { value: 'Triaged', label: 'Triaged' },
                { value: 'Quoted', label: 'Quoted' },
                { value: 'Referred', label: 'Referred' },
                { value: 'Bound', label: 'Bound' },
                { value: 'Declined', label: 'Declined' },
                { value: 'NotTakenUp', label: 'Not Taken Up' }
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
                ApiService.get('/submissions', {
                    status: vm.filters.status || undefined,
                    lineOfBusiness: vm.filters.lineOfBusiness || undefined,
                    search: vm.filters.search || undefined
                }).then(function (data) {
                    vm.submissions = (data && data.items) || data || [];
                }).catch(function (err) {
                    vm.error = err.message;
                    vm.submissions = [];
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.applyFilters = function () {
                load();
            };

            vm.resetFilters = function () {
                vm.filters = { status: '', lineOfBusiness: '', search: '' };
                load();
            };

            load();
        }
    ]);
})();
