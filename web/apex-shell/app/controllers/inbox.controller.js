(function () {
    'use strict';

    angular.module('apexApp').controller('InboxController', [
        '$location', 'ApiService', 'AuthService',
        function ($location, ApiService, AuthService) {
            var vm = this;

            vm.loading = true;
            vm.error = null;
            vm.tasks = [];
            vm.notifications = [];
            vm.busyTaskId = null;
            vm.busyNotifId = null;
            vm.actionError = null;
            vm.showOverdue = false;
            vm.submissionFilter = ($location.search().submissionId) || null;

            vm.canSeeOverdue = function () {
                return AuthService.hasRole('UnderwritingManager', 'Admin');
            };

            function userId() {
                var u = AuthService.currentUser();
                return u && u.id;
            }

            function loadTasks() {
                var params = {};
                if (vm.submissionFilter) {
                    params.submissionId = vm.submissionFilter;
                } else if (!vm.showOverdue) {
                    params.userId = userId();
                }
                return ApiService.get('/workflow/tasks', params).then(function (data) {
                    vm.tasks = data || [];
                });
            }

            function loadNotifications() {
                return ApiService.get('/workflow/notifications', { page: 1, pageSize: 50 })
                    .then(function (data) {
                        vm.notifications = (data && data.items) || data || [];
                    });
            }

            function load() {
                vm.loading = true;
                vm.error = null;
                Promise.all([loadTasks(), loadNotifications()])
                    .catch(function (err) {
                        vm.error = (err && err.message) || 'Failed to load inbox.';
                        vm.tasks = [];
                        vm.notifications = [];
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            // Angular 1.6 may not have native Promise.finally on all browsers — use then/catch pattern via ApiService promises
            function loadSafe() {
                vm.loading = true;
                vm.error = null;
                var pending = 2;
                var failed = null;
                function done() {
                    pending -= 1;
                    if (pending === 0) {
                        if (failed) { vm.error = failed; }
                        vm.loading = false;
                    }
                }
                loadTasks().then(done).catch(function (err) {
                    failed = err.message;
                    vm.tasks = [];
                    done();
                });
                loadNotifications().then(done).catch(function (err) {
                    failed = err.message;
                    vm.notifications = [];
                    done();
                });
            }

            vm.toggleOverdue = function () {
                if (!vm.canSeeOverdue()) { return; }
                vm.showOverdue = !vm.showOverdue;
                loadSafe();
            };

            vm.completeTask = function (task) {
                vm.busyTaskId = task.id;
                vm.actionError = null;
                ApiService.put('/workflow/tasks/' + task.id + '/complete', {})
                    .then(function () { loadSafe(); })
                    .catch(function (err) { vm.actionError = err.message; })
                    .finally(function () { vm.busyTaskId = null; });
            };

            vm.markRead = function (n) {
                if (n.isRead) { return; }
                vm.busyNotifId = n.id;
                ApiService.put('/workflow/notifications/' + n.id + '/read', {})
                    .then(function () {
                        n.isRead = true;
                    })
                    .catch(function (err) { vm.actionError = err.message; })
                    .finally(function () { vm.busyNotifId = null; });
            };

            vm.taskLink = function (task) {
                if (task && task.id) { return '#!/tasks/' + task.id; }
                return null;
            };

            vm.openTask = function (task) {
                if (task && task.id) {
                    window.location.hash = '#!/tasks/' + task.id;
                }
            };

            vm.notifLink = function (n) {
                if (n.linkUrl) { return n.linkUrl; }
                if (n.relatedEntityType === 'Submission' && n.relatedEntityId) {
                    return '#!/submissions/' + n.relatedEntityId;
                }
                if (n.relatedEntityType === 'Claim' && n.relatedEntityId) {
                    return '#!/claims/' + n.relatedEntityId;
                }
                if (n.relatedEntityType === 'Quote' && n.relatedEntityId) {
                    return '#!/referrals';
                }
                return null;
            };

            loadSafe();
        }
    ]);
})();
