(function () {
    'use strict';

    angular.module('apexApp').controller('ClaimDetailController', [
        '$routeParams', 'ApiService', 'AuthService', 'APEX_ENUMS',
        function ($routeParams, ApiService, AuthService, APEX_ENUMS) {
            var vm = this;

            vm.id = $routeParams.id;
            vm.loading = true;
            vm.error = null;
            vm.claim = null;
            vm.enums = APEX_ENUMS;
            vm.busy = false;
            vm.actionError = null;
            vm.actionSuccess = null;
            vm.handlers = [];
            vm.paymentAmount = null;
            vm.draftStatus = '';
            vm.draftReserve = null;
            vm.draftHandlerId = '';

            vm.statusOptions = [
                { value: 'Open', label: 'Open' },
                { value: 'ReservedForPayment', label: 'Reserved for payment' },
                { value: 'Paid', label: 'Paid' },
                { value: 'Closed', label: 'Closed' },
                { value: 'Declined', label: 'Declined' },
                { value: 'Reopened', label: 'Reopened' }
            ];

            function applyClaim(data) {
                vm.claim = data;
                vm.draftStatus = data.status;
                vm.draftReserve = data.reserveAmount;
                vm.draftHandlerId = data.handlerUserId || '';
                vm.paymentAmount = null;
            }

            function load() {
                vm.loading = true;
                vm.error = null;
                ApiService.get('/claims/' + vm.id).then(function (data) {
                    applyClaim(data);
                }).catch(function (err) {
                    vm.error = err.message;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            // Prefer seeded claims handlers; Admin user list is Admin-gated.
            vm.handlers = [{ id: 4, fullName: 'Casey Claims', username: 'cl1' }];
            if (AuthService.hasRole('Admin')) {
                ApiService.get('/admin/users', { activeOnly: true }).then(function (users) {
                    var list = users || [];
                    var handlers = list.filter(function (u) {
                        return u.role === 'ClaimsHandler' || u.role === 3;
                    });
                    if (handlers.length) { vm.handlers = handlers; }
                }).catch(function () { /* keep fallback */ });
            }

            function run(promiseFactory, successMsg) {
                vm.busy = true;
                vm.actionError = null;
                vm.actionSuccess = null;
                promiseFactory()
                    .then(function (data) {
                        applyClaim(data);
                        vm.actionSuccess = successMsg;
                    })
                    .catch(function (err) {
                        vm.actionError = err.message;
                    })
                    .finally(function () {
                        vm.busy = false;
                    });
            }

            vm.updateStatus = function () {
                run(function () {
                    return ApiService.put('/claims/' + vm.id + '/status', { status: vm.draftStatus });
                }, 'Status updated.');
            };

            vm.updateReserve = function () {
                run(function () {
                    return ApiService.put('/claims/' + vm.id + '/reserve', {
                        reserveAmount: Number(vm.draftReserve) || 0
                    });
                }, 'Reserve updated.');
            };

            vm.postPayment = function () {
                if (!vm.paymentAmount || Number(vm.paymentAmount) <= 0) {
                    vm.actionError = 'Enter a payment amount greater than zero.';
                    return;
                }
                run(function () {
                    return ApiService.post('/claims/' + vm.id + '/payments', {
                        amount: Number(vm.paymentAmount)
                    });
                }, 'Payment recorded.');
            };

            vm.assignHandler = function () {
                if (!vm.draftHandlerId) {
                    vm.actionError = 'Select a handler.';
                    return;
                }
                run(function () {
                    return ApiService.put('/claims/' + vm.id + '/handler', {
                        handlerUserId: Number(vm.draftHandlerId)
                    });
                }, 'Handler assigned.');
            };

            vm.closeClaim = function () {
                run(function () {
                    return ApiService.post('/claims/' + vm.id + '/close', {});
                }, 'Claim closed.');
            };

            load();
        }
    ]);
})();
