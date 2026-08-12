(function () {
    'use strict';

    angular.module('apexApp').controller('BrokersListController', [
        '$location', 'ApiService', 'AuthService',
        function ($location, ApiService, AuthService) {
            var vm = this;

            vm.loading = true;
            vm.error = null;
            vm.brokers = [];
            vm.filters = { search: '', isActive: true };
            vm.showCreate = false;
            vm.createBusy = false;
            vm.createError = null;
            vm.draft = emptyDraft();

            vm.canEdit = function () {
                return AuthService.hasRole('BrokerOps', 'Admin');
            };

            function emptyDraft() {
                return {
                    name: '',
                    brokerCode: '',
                    contactEmail: '',
                    contactPhone: '',
                    address: '',
                    agreementRef: '',
                    productionTarget: 0
                };
            }

            function load() {
                vm.loading = true;
                vm.error = null;
                ApiService.get('/brokers', {
                    search: vm.filters.search || undefined,
                    isActive: vm.filters.isActive === true ? true : undefined
                })
                    .then(function (data) {
                        vm.brokers = (data && data.items) || data || [];
                    })
                    .catch(function (err) {
                        vm.error = err.message;
                        vm.brokers = [];
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            vm.applyFilters = function () { load(); };

            vm.toggleCreate = function () {
                vm.showCreate = !vm.showCreate;
                vm.createError = null;
                vm.draft = emptyDraft();
            };

            vm.createBroker = function () {
                if (!vm.draft.name || !vm.draft.brokerCode) {
                    vm.createError = 'Name and broker code are required.';
                    return;
                }
                vm.createBusy = true;
                vm.createError = null;
                ApiService.post('/brokers', {
                    name: vm.draft.name,
                    brokerCode: vm.draft.brokerCode,
                    contactEmail: vm.draft.contactEmail || null,
                    contactPhone: vm.draft.contactPhone || null,
                    address: vm.draft.address || null,
                    agreementRef: vm.draft.agreementRef || null,
                    productionTarget: Number(vm.draft.productionTarget) || 0
                }).then(function (created) {
                    $location.path('/brokers/' + created.id);
                }).catch(function (err) {
                    vm.createError = err.message;
                }).finally(function () {
                    vm.createBusy = false;
                });
            };

            load();
        }
    ]);
})();
