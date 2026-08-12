(function () {
    'use strict';

    angular.module('apexApp').controller('OpenBoxController', [
        'ApiService',
        function (ApiService) {
            var vm = this;
            vm.loading = true;
            vm.error = null;
            vm.status = null;
            vm.risks = [];
            vm.messages = [];
            vm.search = '';
            vm.selected = null;
            vm.partyBusy = false;
            vm.partyError = null;
            vm.partySuccess = null;
            vm.party = emptyParty();

            function emptyParty() {
                return {
                    name: '',
                    externalId: '',
                    registrationNumber: '',
                    city: '',
                    postCode: '',
                    tradeCode: 'OFFICE',
                    tradingName: '',
                    address: '',
                    occupancy: ''
                };
            }

            vm.reload = function () {
                vm.loadStatus();
                vm.loadRisks();
                vm.loadMessages();
            };

            vm.loadStatus = function () {
                return ApiService.get('/openbox/status').then(function (data) {
                    vm.status = data;
                }).catch(function () { /* ignore */ });
            };

            vm.loadRisks = function () {
                vm.loading = true;
                vm.error = null;
                return ApiService.get('/openbox/risks', {
                    take: 200,
                    search: vm.search || undefined
                }).then(function (data) {
                    vm.risks = data || [];
                    if (vm.selected) {
                        var id = vm.selected.submissionId;
                        vm.selected = vm.risks.find(function (r) { return r.submissionId === id; }) || null;
                    }
                }).catch(function (err) {
                    vm.error = err.message;
                    vm.risks = [];
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.loadMessages = function () {
                return ApiService.get('/openbox/bus/messages', { take: 40 }).then(function (data) {
                    vm.messages = data || [];
                }).catch(function () {
                    vm.messages = [];
                });
            };

            vm.select = function (row) {
                vm.selected = row;
            };

            vm.publishInsured = function () {
                if (!vm.party.name) {
                    vm.partyError = 'Name is required.';
                    return;
                }
                vm.partyBusy = true;
                vm.partyError = null;
                vm.partySuccess = null;
                ApiService.post('/insureds/from-external', {
                    eventType: 'InsuredCreated',
                    externalId: vm.party.externalId || undefined,
                    name: vm.party.name,
                    tradingName: vm.party.tradingName || undefined,
                    registrationNumber: vm.party.registrationNumber || undefined,
                    address: vm.party.address || undefined,
                    city: vm.party.city || undefined,
                    postCode: vm.party.postCode || undefined,
                    tradeCode: vm.party.tradeCode || undefined,
                    occupancy: vm.party.occupancy || undefined,
                    source: 'OpenBox.Lab'
                }).then(function (res) {
                    if (res.published) {
                        vm.partySuccess = 'Published ' + res.externalId + ' to RabbitMQ (' + res.routingKey + '). Check Connect / insured list in a moment.';
                    } else {
                        vm.partySuccess = (res.created ? 'Created' : 'Updated') + ' locally: ' + (res.insured && res.insured.name) + ' (broker fallback).';
                    }
                    vm.party = emptyParty();
                    vm.loadMessages();
                    vm.loadStatus();
                }).catch(function (err) {
                    vm.partyError = err.message || 'Publish failed.';
                }).finally(function () {
                    vm.partyBusy = false;
                });
            };

            vm.reload();
        }
    ]);
})();
