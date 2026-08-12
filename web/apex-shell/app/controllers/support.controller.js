(function () {
    'use strict';

    angular.module('apexApp').controller('SupportController', [
        'ApiService',
        function (ApiService) {
            var vm = this;
            vm.tab = 'health';
            vm.loading = false;
            vm.error = null;
            vm.items = [];
            vm.activity = [];
            vm.jobs = [];

            vm.reload = function () {
                vm.loading = true;
                vm.error = null;
                ApiService.get('/support/health').then(function (data) {
                    vm.items = data || [];
                }).catch(function (err) {
                    vm.error = err.message;
                    vm.items = [];
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.loadActivity = function () {
                ApiService.get('/support/integration-activity').then(function (data) {
                    vm.activity = data || [];
                }).catch(function () { vm.activity = []; });
            };

            vm.loadJobs = function () {
                ApiService.get('/support/scheduled-jobs').then(function (data) {
                    vm.jobs = data || [];
                }).catch(function () { vm.jobs = []; });
            };

            vm.reload();
        }
    ]);
})();
