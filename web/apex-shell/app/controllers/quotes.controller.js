(function () {
    'use strict';

    /**
     * Nested inside submission-detail.html via QuotesController as quotesVm.
     * Uses live API: POST /quotes, PUT /quotes/:id/select, POST /policies/bind.
     */
    angular.module('apexApp').controller('QuotesController', [
        '$scope', '$routeParams', '$location', 'ApiService',
        function ($scope, $routeParams, $location, ApiService) {
            var vm = this;

            vm.submissionId = Number($routeParams.id);
            vm.showForm = false;
            vm.busy = false;
            vm.error = null;
            vm.quotes = [];
            vm.loadingQuotes = false;

            vm.draft = {
                sumInsured: 1000000,
                limitOfIndemnity: 1000000,
                deductible: 1000,
                commissionPercent: 15
            };

            function parentVm() {
                return $scope.vm;
            }

            vm.toggleForm = function () {
                vm.showForm = !vm.showForm;
                vm.error = null;
            };

            vm.loadQuotes = function () {
                vm.loadingQuotes = true;
                vm.error = null;
                ApiService.get('/quotes/by-submission/' + vm.submissionId)
                    .then(function (data) {
                        vm.quotes = data || [];
                        var parent = parentVm();
                        if (parent && parent.submission) {
                            parent.submission.quotes = vm.quotes;
                        }
                    })
                    .catch(function (err) {
                        vm.error = err.message;
                        vm.quotes = [];
                    })
                    .finally(function () {
                        vm.loadingQuotes = false;
                    });
            };

            vm.createQuote = function () {
                if (!vm.draft.sumInsured || !vm.draft.limitOfIndemnity) {
                    vm.error = 'Sum insured and limit of indemnity are required.';
                    return;
                }
                vm.busy = true;
                vm.error = null;

                ApiService.post('/quotes', {
                    submissionId: vm.submissionId,
                    sumInsured: Number(vm.draft.sumInsured),
                    limitOfIndemnity: Number(vm.draft.limitOfIndemnity),
                    deductible: Number(vm.draft.deductible) || 0,
                    commissionPercent: Number(vm.draft.commissionPercent) || 0
                }).then(function (quote) {
                    vm.quotes.push(quote);
                    var parent = parentVm();
                    if (parent && parent.submission) {
                        parent.submission.quotes = vm.quotes;
                        parent.submission.status = quote.isReferralRequired ? 'Referred' : 'Quoted';
                        if (parent.actionSuccess !== undefined) {
                            parent.actionSuccess = quote.isReferralRequired
                                ? 'Quote raised — referral required before select/bind.'
                                : 'Quote raised via rating engine.';
                        }
                    }
                    vm.showForm = false;
                }).catch(function (err) {
                    vm.error = err.message;
                }).finally(function () {
                    vm.busy = false;
                });
            };

            vm.selectQuote = function (quote) {
                vm.busy = true;
                vm.error = null;
                ApiService.put('/quotes/' + quote.id + '/select', {})
                    .then(function () {
                        angular.forEach(vm.quotes, function (q) {
                            q.isSelected = (q.id === quote.id);
                        });
                    })
                    .catch(function (err) {
                        vm.error = err.message;
                    })
                    .finally(function () {
                        vm.busy = false;
                    });
            };

            vm.bindQuote = function (quote) {
                if (!quote) { return; }
                vm.busy = true;
                vm.error = null;
                ApiService.post('/policies/bind', { quoteId: quote.id })
                    .then(function (policy) {
                        var parent = parentVm();
                        if (parent && parent.submission) {
                            parent.submission.status = 'Bound';
                            parent.actionSuccess = 'Bound as ' + (policy.policyNumber || ('policy #' + policy.id));
                        }
                        $location.path('/policies/' + policy.id);
                    })
                    .catch(function (err) {
                        vm.error = err.message;
                    })
                    .finally(function () {
                        vm.busy = false;
                    });
            };

            vm.canBind = function (quote) {
                if (!quote) { return false; }
                if (quote.isReferralRequired) {
                    // ReferralDecision: NotRequired=0, Pending=1, Approved=2, Declined=3
                    var d = quote.referralDecision;
                    if (d !== 'Approved' && d !== 2) { return false; }
                }
                return true;
            };

            vm.loadQuotes();
        }
    ]);
})();
