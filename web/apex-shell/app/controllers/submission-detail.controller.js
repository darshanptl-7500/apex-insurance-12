(function () {
    'use strict';

    angular.module('apexApp').controller('SubmissionDetailController', [
        '$routeParams', 'ApiService', 'AuthService', 'APEX_CONFIG', 'APEX_ENUMS',
        function ($routeParams, ApiService, AuthService, APEX_CONFIG, APEX_ENUMS) {
            var vm = this;

            vm.id = $routeParams.id;
            vm.loading = true;
            vm.error = null;
            vm.submission = null;
            vm.enums = APEX_ENUMS;
            vm.activeTab = 'quotes';
            vm.busy = false;
            vm.actionError = null;
            vm.actionSuccess = null;
            vm.pipelineSteps = APEX_ENUMS.submissionPipeline;

            vm.assignDraft = { underwriterId: null };
            vm.dueDraft = { dueDate: null };
            // Seed underwriters — /admin/users is Admin-gated
            vm.underwriters = [
                { id: 2, fullName: 'Una Underwriter', username: 'uw1' },
                { id: 3, fullName: 'Morgan Manager', username: 'mgr1' }
            ];

            vm.canAssign = function () {
                return AuthService.hasRole('UnderwritingManager', 'Admin', 'Underwriter');
            };

            vm.caseHubUrl = function () {
                var base = (APEX_CONFIG && APEX_CONFIG.ng8BaseUrl) || '/ng8';
                return base + '/case-hub/' + vm.id;
            };

            vm.setTab = function (tab) {
                vm.activeTab = tab;
            };

            vm.pipelineStepClass = function (stepLabel) {
                if (!vm.submission) { return ''; }
                var statusEntry = APEX_ENUMS.submissionStatus[vm.submission.status];
                var statusLabel = statusEntry ? statusEntry.label : String(vm.submission.status || '');

                if (vm.submission.status === 'Declined' || vm.submission.status === 'NotTakenUp' ||
                    vm.submission.status === 5 || vm.submission.status === 6) {
                    return statusLabel === stepLabel ? 'declined' : '';
                }

                var stepIndex = vm.pipelineSteps.indexOf(stepLabel);
                var currentIndex = vm.pipelineSteps.indexOf(statusLabel);
                if (statusLabel === 'Referred') { currentIndex = vm.pipelineSteps.indexOf('Quoted'); }
                if (currentIndex === -1) { return ''; }
                if (stepIndex < currentIndex) { return 'done'; }
                if (stepIndex === currentIndex) { return 'current'; }
                return '';
            };

            function toDateValue(value) {
                if (!value) { return null; }
                var d = new Date(value);
                return isNaN(d.getTime()) ? null : d;
            }

            function applySubmission(data) {
                vm.submission = data;
                vm.submission.riskAnswers = vm.submission.riskAnswers || [];
                vm.submission.quotes = vm.submission.quotes || [];
                vm.submission.documents = vm.submission.documents || [];
                vm.submission.tasks = vm.submission.tasks || [];
                vm.assignDraft.underwriterId = vm.submission.underwriterUserId || null;
                vm.dueDraft.dueDate = toDateValue(vm.submission.dueDate);
            }

            function load() {
                vm.loading = true;
                vm.error = null;
                ApiService.get('/submissions/' + vm.id).then(function (data) {
                    applySubmission(data);
                }).catch(function (err) {
                    vm.error = err.message;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            if (AuthService.hasRole('Admin')) {
                ApiService.get('/admin/users', { activeOnly: true }).then(function (users) {
                    var list = (users || []).filter(function (u) {
                        return u.role === 'Underwriter' || u.role === 'UnderwritingManager' ||
                            u.role === 0 || u.role === 1;
                    });
                    if (list.length) { vm.underwriters = list; }
                }).catch(function () { /* keep seed fallback */ });
            }

            vm.assignUnderwriter = function () {
                if (!vm.assignDraft.underwriterId) {
                    vm.actionError = 'Select an underwriter.';
                    return;
                }
                vm.busy = true;
                vm.actionError = null;
                ApiService.put('/submissions/' + vm.id + '/assign', {
                    underwriterId: Number(vm.assignDraft.underwriterId)
                }).then(function (data) {
                    applySubmission(data);
                    vm.actionSuccess = 'Underwriter assigned.';
                }).catch(function (err) {
                    vm.actionError = err.message;
                }).finally(function () {
                    vm.busy = false;
                });
            };

            vm.saveDueDate = function () {
                vm.busy = true;
                vm.actionError = null;
                ApiService.put('/submissions/' + vm.id + '/due-date', {
                    dueDate: vm.dueDraft.dueDate || null
                }).then(function (data) {
                    applySubmission(data);
                    vm.actionSuccess = 'Due date updated.';
                }).catch(function (err) {
                    vm.actionError = err.message;
                }).finally(function () {
                    vm.busy = false;
                });
            };

            vm.reload = load;
            load();
        }
    ]);
})();
