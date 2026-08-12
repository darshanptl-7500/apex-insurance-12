(function () {
    'use strict';

    angular.module('apexApp').controller('SubmissionCreateController', [
        '$location', 'ApiService', 'APEX_CONFIG',
        function ($location, ApiService, APEX_CONFIG) {
            var vm = this;

            vm.busy = false;
            vm.error = null;
            vm.brokers = [];
            vm.insureds = [];
            vm.lookupsLoading = true;

            vm.draft = {
                brokerId: null,
                insuredId: null,
                lineOfBusiness: 'Property',
                businessArea: 'PROP',
                requestedEffectiveDate: null,
                expiryDate: null,
                yoa: null,
                targetPremium: null,
                brokerContact: '',
                policyType: 'Facultative',
                mop: 'COVERS',
                policyDescription: '',
                riskAppetite: 'Standard',
                newOrRenewal: 'N',
                isDelegatedAuthority: false,
                notes: ''
            };

            vm.lobOptions = [
                { value: 'Property', label: 'Property' },
                { value: 'Liability', label: 'Liability' },
                { value: 'ProfessionalIndemnity', label: 'Professional Indemnity' }
            ];
            vm.areaOptions = [
                { value: 'PROP', label: 'Property' },
                { value: 'LIAB', label: 'Liability' },
                { value: 'PI', label: 'Professional Indemnity' },
                { value: 'CARGO', label: 'Cargo' },
                { value: 'UPSEN', label: 'Upstream Energy' }
            ];
            vm.policyTypeOptions = [
                { value: 'Facultative', label: 'Facultative' },
                { value: 'Lineslip', label: 'Lineslip' },
                { value: 'Binder', label: 'Binder' }
            ];
            vm.mopOptions = [
                { value: 'COVERS', label: 'COVERS' },
                { value: 'LINESLIPS', label: 'LINESLIPS' },
                { value: 'OPENMARKET', label: 'Open Market' }
            ];

            function toIsoDate(value) {
                if (!value) { return null; }
                if (typeof value === 'string') { return value; }
                var d = value instanceof Date ? value : new Date(value);
                if (isNaN(d.getTime())) { return null; }
                var y = d.getFullYear();
                var m = ('0' + (d.getMonth() + 1)).slice(-2);
                var day = ('0' + d.getDate()).slice(-2);
                return y + '-' + m + '-' + day;
            }

            vm.onInception = function () {
                var d = vm.draft.requestedEffectiveDate;
                if (!d) { return; }
                var inception = d instanceof Date ? d : new Date(d);
                vm.draft.yoa = inception.getFullYear();
                if (!vm.draft.expiryDate) {
                    var exp = new Date(inception.getTime());
                    exp.setFullYear(exp.getFullYear() + 1);
                    vm.draft.expiryDate = exp;
                }
            };

            var today = new Date();
            vm.draft.requestedEffectiveDate = today;
            vm.onInception();

            ApiService.get('/brokers', { pageSize: 100 }).then(function (data) {
                vm.brokers = (data && data.items) || data || [];
            }).catch(function () { vm.brokers = []; });

            ApiService.get('/insureds', { pageSize: 100 }).then(function (data) {
                vm.insureds = (data && data.items) || data || [];
            }).catch(function () { vm.insureds = []; })
            .finally(function () { vm.lookupsLoading = false; });

            vm.cancel = function () {
                $location.path('/pipeline/upcoming');
            };

            vm.submit = function () {
                if (!vm.draft.brokerId || !vm.draft.insuredId || !vm.draft.requestedEffectiveDate || !vm.draft.expiryDate) {
                    vm.error = 'Insured, broker, inception and expiry are required.';
                    return;
                }
                vm.busy = true;
                vm.error = null;

                ApiService.post('/submissions', {
                    brokerId: Number(vm.draft.brokerId),
                    insuredId: Number(vm.draft.insuredId),
                    lineOfBusiness: vm.draft.lineOfBusiness,
                    requestedEffectiveDate: toIsoDate(vm.draft.requestedEffectiveDate),
                    expiryDate: toIsoDate(vm.draft.expiryDate),
                    targetPremium: vm.draft.targetPremium != null && vm.draft.targetPremium !== ''
                        ? Number(vm.draft.targetPremium) : null,
                    notes: vm.draft.notes || null,
                    brokerContact: vm.draft.brokerContact || null,
                    policyType: vm.draft.policyType,
                    mop: vm.draft.mop,
                    policyDescription: vm.draft.policyDescription || null,
                    riskAppetite: vm.draft.riskAppetite || null,
                    businessArea: vm.draft.businessArea,
                    newOrRenewal: vm.draft.newOrRenewal,
                    isDelegatedAuthority: !!vm.draft.isDelegatedAuthority
                }).then(function (created) {
                    var base = (APEX_CONFIG && APEX_CONFIG.ng8BaseUrl) || '/ng8';
                    window.location.href = base + '/case-hub/' + created.id;
                }).catch(function (err) {
                    vm.error = err.message;
                }).finally(function () {
                    vm.busy = false;
                });
            };
        }
    ]);
})();
