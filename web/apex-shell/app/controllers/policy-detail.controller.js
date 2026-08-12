(function () {
    'use strict';

    angular.module('apexApp').controller('PolicyDetailController', [
        '$routeParams', 'ApiService', 'APEX_ENUMS',
        function ($routeParams, ApiService, APEX_ENUMS) {
            var vm = this;

            vm.id = $routeParams.id;
            vm.loading = true;
            vm.error = null;
            vm.policy = null;
            vm.enums = APEX_ENUMS;
            vm.activeTab = 'endorsements';

            vm.showEndorseForm = false;
            vm.showCancelForm = false;
            vm.busy = false;
            vm.actionError = null;
            vm.actionSuccess = null;

            vm.endorsementDraft = { effectiveDate: null, description: '', premiumChange: 0 };
            vm.cancelDraft = { cancellationDate: null, reason: '' };

            vm.setTab = function (tab) { vm.activeTab = tab; };

            function load() {
                vm.loading = true;
                vm.error = null;
                ApiService.get('/policies/' + vm.id).then(function (data) {
                    vm.policy = data;
                    vm.policy.endorsements = vm.policy.endorsements || [];
                    vm.policy.claims = vm.policy.claims || [];
                    vm.policy.documents = vm.policy.documents || [];
                }).catch(function (err) {
                    vm.error = err.message;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.toggleEndorseForm = function () {
                vm.showEndorseForm = !vm.showEndorseForm;
                vm.showCancelForm = false;
                vm.actionError = null;
            };

            vm.toggleCancelForm = function () {
                vm.showCancelForm = !vm.showCancelForm;
                vm.showEndorseForm = false;
                vm.actionError = null;
            };

            vm.submitEndorsement = function () {
                if (!vm.endorsementDraft.description) {
                    vm.actionError = 'Please describe the endorsement.';
                    return;
                }
                vm.busy = true;
                vm.actionError = null;
                ApiService.post('/policies/' + vm.id + '/endorsements', {
                    policyId: Number(vm.id),
                    description: vm.endorsementDraft.description,
                    premiumChange: Number(vm.endorsementDraft.premiumChange) || 0,
                    effectiveDate: vm.endorsementDraft.effectiveDate
                })
                    .then(function (updated) {
                        vm.policy = updated;
                        vm.policy.endorsements = vm.policy.endorsements || [];
                        vm.policy.claims = vm.policy.claims || [];
                        vm.policy.documents = vm.policy.documents || [];
                        vm.endorsementDraft = { effectiveDate: null, description: '', premiumChange: 0 };
                        vm.showEndorseForm = false;
                        vm.actionSuccess = 'Endorsement recorded.';
                    })
                    .catch(function (err) { vm.actionError = err.message; })
                    .finally(function () { vm.busy = false; });
            };

            vm.submitCancellation = function () {
                if (!vm.cancelDraft.cancellationDate || !vm.cancelDraft.reason) {
                    vm.actionError = 'Cancellation date and reason are required.';
                    return;
                }
                vm.busy = true;
                vm.actionError = null;
                ApiService.post('/policies/' + vm.id + '/cancel', {
                    policyId: Number(vm.id),
                    cancellationDate: vm.cancelDraft.cancellationDate,
                    reason: vm.cancelDraft.reason
                })
                    .then(function (updated) {
                        vm.policy = updated;
                        vm.policy.endorsements = vm.policy.endorsements || [];
                        vm.policy.claims = vm.policy.claims || [];
                        vm.policy.documents = vm.policy.documents || [];
                        vm.showCancelForm = false;
                        vm.actionSuccess = 'Policy cancelled.';
                    })
                    .catch(function (err) { vm.actionError = err.message; })
                    .finally(function () { vm.busy = false; });
            };

            vm.reinstate = function () {
                vm.busy = true;
                vm.actionError = null;
                vm.actionSuccess = null;
                ApiService.post('/policies/' + vm.id + '/reinstate', {})
                    .then(function (updated) {
                        vm.policy = updated;
                        vm.policy.endorsements = vm.policy.endorsements || [];
                        vm.policy.claims = vm.policy.claims || [];
                        vm.policy.documents = vm.policy.documents || [];
                        vm.actionSuccess = 'Policy reinstated.';
                    })
                    .catch(function (err) { vm.actionError = err.message; })
                    .finally(function () { vm.busy = false; });
            };

            load();
        }
    ]);
})();
