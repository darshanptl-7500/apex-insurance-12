(function () {
    'use strict';

    angular.module('apexApp').controller('BrokerDetailController', [
        '$routeParams', '$location', 'ApiService', 'AuthService', 'APEX_ENUMS',
        function ($routeParams, $location, ApiService, AuthService, APEX_ENUMS) {
            var vm = this;

            vm.id = $routeParams.id;
            vm.loading = true;
            vm.error = null;
            vm.broker = null;
            vm.performance = null;
            vm.enums = APEX_ENUMS;
            vm.busy = false;
            vm.actionError = null;
            vm.actionSuccess = null;
            vm.editing = false;
            vm.draft = null;

            vm.canEdit = function () {
                return AuthService.hasRole('BrokerOps', 'Admin');
            };

            function load() {
                vm.loading = true;
                vm.error = null;
                ApiService.get('/brokers/' + vm.id).then(function (data) {
                    vm.broker = data;
                    vm.draft = angular.copy(data);
                }).catch(function (err) {
                    vm.error = err.message;
                }).finally(function () {
                    vm.loading = false;
                });

                ApiService.get('/brokers/' + vm.id + '/performance').then(function (data) {
                    vm.performance = data;
                }).catch(function () {
                    vm.performance = null;
                });
            }

            vm.startEdit = function () {
                vm.editing = true;
                vm.draft = angular.copy(vm.broker);
                vm.actionError = null;
                vm.actionSuccess = null;
            };

            vm.cancelEdit = function () {
                vm.editing = false;
                vm.draft = angular.copy(vm.broker);
            };

            vm.save = function () {
                vm.busy = true;
                vm.actionError = null;
                ApiService.put('/brokers/' + vm.id, {
                    name: vm.draft.name,
                    contactEmail: vm.draft.contactEmail,
                    contactPhone: vm.draft.contactPhone,
                    address: vm.draft.address,
                    agreementRef: vm.draft.agreementRef,
                    productionTarget: Number(vm.draft.productionTarget) || 0,
                    isActive: !!vm.draft.isActive
                }).then(function (updated) {
                    vm.broker = updated;
                    vm.editing = false;
                    vm.actionSuccess = 'Broker updated.';
                }).catch(function (err) {
                    vm.actionError = err.message;
                }).finally(function () {
                    vm.busy = false;
                });
            };

            vm.deactivate = function () {
                if (!window.confirm('Deactivate this broker?')) { return; }
                vm.busy = true;
                vm.actionError = null;
                ApiService.post('/brokers/' + vm.id + '/deactivate', {}).then(function (updated) {
                    vm.broker = updated;
                    vm.draft = angular.copy(updated);
                    vm.actionSuccess = 'Broker deactivated.';
                }).catch(function (err) {
                    vm.actionError = err.message;
                }).finally(function () {
                    vm.busy = false;
                });
            };

            load();
        }
    ]);
})();
