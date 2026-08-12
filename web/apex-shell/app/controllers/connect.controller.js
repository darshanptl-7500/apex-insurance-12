(function () {
    'use strict';

    angular.module('apexApp').controller('ConnectController', [
        'ApiService',
        function (ApiService) {
            var vm = this;
            vm.tab = 'brokers';
            vm.loading = true;
            vm.error = null;
            vm.brokers = [];
            vm.insureds = [];

            vm.setTab = function (tab) {
                vm.tab = tab;
            };

            function load() {
                vm.loading = true;
                vm.error = null;
                var pending = 2;
                function done() {
                    pending -= 1;
                    if (pending === 0) { vm.loading = false; }
                }
                ApiService.get('/brokers', { pageSize: 100 }).then(function (data) {
                    vm.brokers = (data && data.items) || data || [];
                    done();
                }).catch(function (err) {
                    vm.error = err.message;
                    done();
                });
                ApiService.get('/insureds', { pageSize: 100 }).then(function (data) {
                    vm.insureds = (data && data.items) || data || [];
                    done();
                }).catch(function () {
                    vm.insureds = [];
                    done();
                });
            }

            load();
        }
    ]);
})();
