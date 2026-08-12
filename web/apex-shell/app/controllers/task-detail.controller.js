(function () {
    'use strict';

    angular.module('apexApp').controller('TaskDetailController', [
        '$routeParams', '$location', '$sce', 'ApiService', 'AuthService', 'APEX_CONFIG',
        function ($routeParams, $location, $sce, ApiService, AuthService, APEX_CONFIG) {
            var vm = this;
            vm.taskId = Number($routeParams.id);
            vm.loading = true;
            vm.error = null;
            vm.task = null;
            vm.busy = false;
            vm.commentText = '';
            vm.previewUrl = null;
            vm.lineSlip = {
                customerType: 'Corporate',
                bulking: false,
                apex100: false,
                followOn: ''
            };

            function applyQuestionnaire() {
                if (!vm.task || !vm.task.questionnaireJson) { return; }
                try {
                    var q = JSON.parse(vm.task.questionnaireJson);
                    angular.extend(vm.lineSlip, q);
                } catch (e) { /* ignore */ }
            }

            function load() {
                vm.loading = true;
                vm.error = null;
                ApiService.get('/workflow/tasks/' + vm.taskId).then(function (data) {
                    vm.task = data;
                    applyQuestionnaire();
                    if (vm.task.documentId) {
                        var dl = ApiService.baseUrl + '/documents/' + vm.task.documentId + '/download';
                        var token = AuthService.getToken && AuthService.getToken();
                        if (token) { dl += '?access_token=' + encodeURIComponent(token); }
                        vm.previewUrl = $sce.trustAsResourceUrl(dl);
                    } else {
                        vm.previewUrl = null;
                    }
                }).catch(function (err) {
                    vm.error = err.message || 'Task not found.';
                    vm.task = null;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.isLineSlip = function () {
                if (!vm.task) { return false; }
                var t = (vm.task.taskType || vm.task.title || '').toLowerCase();
                return t.indexOf('line slip') >= 0 || t.indexOf('lineslip') >= 0;
            };

            vm.caseHubUrl = function () {
                if (!vm.task || !vm.task.submissionId) { return null; }
                var base = (APEX_CONFIG && APEX_CONFIG.ng8BaseUrl) || '/ng8';
                return base + '/case-hub/' + vm.task.submissionId;
            };

            vm.save = function () {
                vm.busy = true;
                vm.error = null;
                var body = {
                    assignedToUserId: Number(vm.task.assignedToUserId),
                    priority: vm.task.priority,
                    dueDate: vm.task.dueDate,
                    status: vm.task.status,
                    description: vm.task.description,
                    questionnaireJson: vm.isLineSlip() ? JSON.stringify(vm.lineSlip) : vm.task.questionnaireJson
                };
                ApiService.put('/workflow/tasks/' + vm.taskId, body).then(function (data) {
                    vm.task = data;
                    applyQuestionnaire();
                }).catch(function (err) {
                    vm.error = err.message;
                }).finally(function () {
                    vm.busy = false;
                });
            };

            vm.complete = function () {
                vm.busy = true;
                ApiService.put('/workflow/tasks/' + vm.taskId + '/complete', {}).then(function (data) {
                    vm.task = data;
                }).catch(function (err) {
                    vm.error = err.message;
                }).finally(function () {
                    vm.busy = false;
                });
            };

            vm.cancel = function () {
                vm.busy = true;
                ApiService.put('/workflow/tasks/' + vm.taskId + '/cancel', {}).then(function (data) {
                    vm.task = data;
                }).catch(function (err) {
                    vm.error = err.message;
                }).finally(function () {
                    vm.busy = false;
                });
            };

            vm.addComment = function () {
                if (!vm.commentText) { return; }
                vm.busy = true;
                ApiService.post('/workflow/tasks/' + vm.taskId + '/comments', {
                    body: vm.commentText
                }).then(function () {
                    vm.commentText = '';
                    return ApiService.get('/workflow/tasks/' + vm.taskId);
                }).then(function (data) {
                    vm.task = data;
                    applyQuestionnaire();
                }).catch(function (err) {
                    vm.error = err.message;
                }).finally(function () {
                    vm.busy = false;
                });
            };

            vm.back = function () {
                $location.path('/inbox');
            };

            load();
        }
    ]);
})();
