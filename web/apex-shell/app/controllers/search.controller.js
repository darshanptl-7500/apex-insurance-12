(function () {
    'use strict';

    angular.module('apexApp').controller('SearchController', [
        '$location', 'ApiService', 'APEX_CONFIG',
        function ($location, ApiService, APEX_CONFIG) {
            var vm = this;
            var SAVED_KEY = 'apex_bud_saved_searches';

            // Stable arrays — ng-options must not get a new array every digest
            // or AngularJS hits $rootScope:infdig and the Policy Search UI goes blank.
            var OPS_ALL = [
                { value: 'equals', label: 'Equal To' },
                { value: 'notEquals', label: 'Not Equal To' },
                { value: 'contains', label: 'Contains' },
                { value: 'notContains', label: 'Does Not Contain' },
                { value: 'gt', label: 'Greater Than' },
                { value: 'gte', label: 'Greater Or Equal' },
                { value: 'lt', label: 'Less Than' },
                { value: 'lte', label: 'Less Or Equal' },
                { value: 'between', label: 'Between' }
            ];
            var OPS_TEXT = OPS_ALL.filter(function (o) {
                return ['equals', 'notEquals', 'contains', 'notContains'].indexOf(o.value) >= 0;
            });
            var OPS_NUMBER = OPS_ALL.filter(function (o) {
                return ['equals', 'notEquals', 'gt', 'gte', 'lt', 'lte', 'between'].indexOf(o.value) >= 0;
            });
            var OPS_SELECT = OPS_ALL.filter(function (o) {
                return ['equals', 'notEquals'].indexOf(o.value) >= 0;
            });
            var EMPTY_SELECT = [];

            vm.mode = 'policy';
            vm.criteria = [emptyRow()];
            vm.fieldOptions = [
                { value: 'assured', label: 'Assured Name', type: 'text' },
                { value: 'broker', label: 'Broker', type: 'text' },
                { value: 'brokerContact', label: 'Broker Contact', type: 'text' },
                { value: 'reference', label: 'UW Reference', type: 'text' },
                { value: 'policyNumber', label: 'Policy Number', type: 'text' },
                { value: 'submissionNumber', label: 'Submission Number', type: 'text' },
                { value: 'lineOfBusiness', label: 'Class Of Business', type: 'select' },
                { value: 'status', label: 'Risk Status', type: 'text' },
                { value: 'underwriter', label: 'Underwriter', type: 'text' },
                { value: 'inception', label: 'Inception', type: 'date' },
                { value: 'expiry', label: 'Expiry', type: 'date' },
                { value: 'yoa', label: 'YOA', type: 'number' },
                { value: 'grossPremium', label: 'Gross Premium', type: 'number' },
                { value: 'netPremium', label: 'Net Premium', type: 'number' },
                { value: 'exposure', label: 'Exposure / Sum Insured', type: 'number' },
                { value: 'description', label: 'Policy Description', type: 'text' }
            ];
            vm.operatorOptions = OPS_ALL;
            vm.operatorsByType = {
                text: OPS_TEXT,
                date: OPS_NUMBER,
                number: OPS_NUMBER,
                select: OPS_SELECT
            };
            vm.lobSelect = [
                { value: 'Property', label: 'Property' },
                { value: 'Liability', label: 'Liability' },
                { value: 'ProfessionalIndemnity', label: 'Professional Indemnity' }
            ];
            vm.vesselFields = [
                { value: 'vesselType', label: 'Vessel Type' },
                { value: 'yearOfBuild', label: 'Year of Build' },
                { value: 'gt', label: 'GT' },
                { value: 'dwt', label: 'DWT' },
                { value: 'riskCode', label: 'Risk Code' },
                { value: 'classOfBusiness', label: 'Class Of Business' },
                { value: 'statCode', label: 'Stat Code' },
                { value: 'riskStatus', label: 'Risk Status' }
            ];
            vm.vesselCriteria = [
                { field: 'vesselType', operator: 'equals', value: '' },
                { field: 'yearOfBuild', operator: 'gt', value: '' },
                { field: 'gt', operator: 'between', value: '', valueTo: '' },
                { field: 'classOfBusiness', operator: 'equals', value: '' }
            ];

            vm.loading = false;
            vm.error = null;
            vm.info = null;
            vm.results = [];
            vm.searched = false;
            vm.savedSearches = loadSaved();
            vm.queryFilter = '';
            vm.queryLoading = false;
            vm.queryResults = [];
            vm.criteriaJoin = 'and';

            function emptyRow() {
                return { field: 'assured', operator: 'contains', value: '', valueTo: '', join: 'and' };
            }

            function fieldMeta(field) {
                for (var i = 0; i < vm.fieldOptions.length; i++) {
                    if (vm.fieldOptions[i].value === field) { return vm.fieldOptions[i]; }
                }
                return { type: 'text' };
            }

            vm.isDateField = function (field) {
                return fieldMeta(field).type === 'date';
            };

            vm.isSelectField = function (field) {
                return fieldMeta(field).type === 'select';
            };

            vm.isBetween = function (row) {
                return row && row.operator === 'between';
            };

            vm.selectOptions = function (field) {
                if (field === 'lineOfBusiness') { return vm.lobSelect; }
                return EMPTY_SELECT;
            };

            vm.operatorsFor = function (row) {
                var type = fieldMeta(row && row.field).type;
                return vm.operatorsByType[type] || OPS_TEXT;
            };

            vm.onFieldChange = function (row) {
                var ops = vm.operatorsFor(row);
                var ok = false;
                for (var i = 0; i < ops.length; i++) {
                    if (ops[i].value === row.operator) { ok = true; break; }
                }
                if (!ok) { row.operator = ops[0].value; }
                row.value = '';
                row.valueTo = '';
            };

            vm.setMode = function (mode) {
                vm.mode = mode;
                vm.error = null;
                vm.info = null;
                if (mode === 'query') {
                    vm.searchQueries();
                }
            };

            vm.addRow = function () {
                vm.criteria.push(emptyRow());
            };

            vm.removeRow = function (idx) {
                if (vm.criteria.length === 1) {
                    vm.criteria[0] = emptyRow();
                    return;
                }
                vm.criteria.splice(idx, 1);
            };

            vm.reset = function () {
                vm.criteria = [emptyRow()];
                vm.results = [];
                vm.searched = false;
                vm.error = null;
                vm.info = null;
                $location.search({});
            };

            function loadSaved() {
                try {
                    return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
                } catch (e) {
                    return [];
                }
            }

            function persistSaved() {
                localStorage.setItem(SAVED_KEY, JSON.stringify(vm.savedSearches));
            }

            vm.saveSearch = function (andRun) {
                var name = window.prompt('Saved search name', 'My search ' + (vm.savedSearches.length + 1));
                if (!name) { return; }
                vm.savedSearches.unshift({
                    name: name,
                    criteria: angular.copy(vm.criteria),
                    savedAt: new Date().toISOString()
                });
                persistSaved();
                vm.info = 'Saved "' + name + '".';
                if (andRun) {
                    vm.search();
                }
            };

            vm.loadSaved = function (s) {
                vm.criteria = angular.copy(s.criteria);
                vm.mode = 'policy';
                vm.search();
            };

            vm.deleteSaved = function (idx) {
                vm.savedSearches.splice(idx, 1);
                persistSaved();
            };

            function asDate(value) {
                if (!value) { return null; }
                if (value instanceof Date) { return value; }
                var d = new Date(value);
                return isNaN(d.getTime()) ? null : d;
            }

            function asNumber(value) {
                if (value === null || value === undefined || value === '') { return null; }
                var n = Number(value);
                return isNaN(n) ? null : n;
            }

            function getHay(item, field) {
                switch (field) {
                    case 'assured': return item.accountName || item.insuredName || '';
                    case 'broker': return item.brokerName || '';
                    case 'brokerContact': return item.brokerContact || '';
                    case 'reference':
                    case 'policyNumber':
                    case 'submissionNumber':
                        return item.reference || item.policyNumber || item.submissionNumber || '';
                    case 'lineOfBusiness': return String(item.lineOfBusiness || '');
                    case 'status': return String(item.status || '');
                    case 'underwriter': return item.underwriterName || '';
                    case 'description': return item.description || item.notes || '';
                    case 'inception': return asDate(item.inception || item.effectiveDate || item.requestedEffectiveDate);
                    case 'expiry': return asDate(item.expiry || item.expiryDate);
                    case 'yoa':
                        var inc = asDate(item.inception || item.effectiveDate || item.requestedEffectiveDate);
                        return inc ? inc.getUTCFullYear() : null;
                    case 'grossPremium': return asNumber(item.grossPremium != null ? item.grossPremium : item.premium);
                    case 'netPremium': return asNumber(item.netPremium);
                    case 'exposure': return asNumber(item.exposure != null ? item.exposure : item.sumInsured);
                    default: return '';
                }
            }

            function matchRow(item, row) {
                if (!row) { return true; }
                var hasValue = row.value !== null && row.value !== undefined && row.value !== '';
                var hasValueTo = row.valueTo !== null && row.valueTo !== undefined && row.valueTo !== '';
                if (row.operator === 'between') {
                    if (!hasValue && !hasValueTo) { return true; }
                } else if (!hasValue && row.value !== 0) {
                    return true;
                }

                var type = fieldMeta(row.field).type;
                var hay = getHay(item, row.field);
                var op = row.operator;

                if (type === 'date') {
                    var d = hay instanceof Date ? hay : asDate(hay);
                    var from = asDate(row.value);
                    var to = asDate(row.valueTo);
                    if (!d) { return false; }
                    var t = d.getTime();
                    if (op === 'equals' && from) { return t === from.getTime(); }
                    if (op === 'notEquals' && from) { return t !== from.getTime(); }
                    if (op === 'gt' && from) { return t > from.getTime(); }
                    if (op === 'gte' && from) { return t >= from.getTime(); }
                    if (op === 'lt' && from) { return t < from.getTime(); }
                    if (op === 'lte' && from) { return t <= from.getTime(); }
                    if (op === 'between') {
                        if (from && t < from.getTime()) { return false; }
                        if (to && t > to.getTime()) { return false; }
                        return !!(from || to);
                    }
                    return true;
                }

                if (type === 'number') {
                    var n = typeof hay === 'number' ? hay : asNumber(hay);
                    var a = asNumber(row.value);
                    var b = asNumber(row.valueTo);
                    if (n === null) { return false; }
                    if (op === 'equals') { return n === a; }
                    if (op === 'notEquals') { return n !== a; }
                    if (op === 'gt') { return n > a; }
                    if (op === 'gte') { return n >= a; }
                    if (op === 'lt') { return n < a; }
                    if (op === 'lte') { return n <= a; }
                    if (op === 'between') {
                        if (a !== null && n < a) { return false; }
                        if (b !== null && n > b) { return false; }
                        return a !== null || b !== null;
                    }
                    return true;
                }

                var text = String(hay == null ? '' : hay).toLowerCase();
                var needle = String(row.value || '').toLowerCase();
                if (!needle) { return true; }
                if (op === 'equals') { return text === needle; }
                if (op === 'notEquals') { return text !== needle; }
                if (op === 'contains') { return text.indexOf(needle) !== -1; }
                if (op === 'notContains') { return text.indexOf(needle) === -1; }
                return true;
            }

            function matchesCriteria(item) {
                if (!vm.criteria.length) { return true; }
                var result = matchRow(item, vm.criteria[0]);
                for (var i = 1; i < vm.criteria.length; i++) {
                    var join = (vm.criteria[i].join || vm.criteriaJoin || 'and').toLowerCase();
                    var next = matchRow(item, vm.criteria[i]);
                    result = join === 'or' ? (result || next) : (result && next);
                }
                return result;
            }

            function mapSubmission(s) {
                return {
                    kind: 'Submission',
                    id: s.id,
                    submissionId: s.id,
                    reference: s.submissionNumber,
                    accountName: s.insuredName,
                    brokerName: s.brokerName,
                    brokerContact: s.brokerContact || s.brokerEmail || '',
                    underwriterName: s.underwriterName,
                    status: s.status,
                    lineOfBusiness: s.lineOfBusiness,
                    inception: s.requestedEffectiveDate,
                    expiry: null,
                    grossPremium: s.targetPremium,
                    netPremium: null,
                    exposure: null,
                    description: s.notes || ('Submission ' + s.submissionNumber)
                };
            }

            function mapPolicy(p) {
                var status = p.status;
                if (typeof status === 'number') {
                    var statusMap = ['Bound', 'Cancelled', 'Expired', 'Lapsed'];
                    status = statusMap[status] || String(status);
                }
                return {
                    kind: 'Policy',
                    id: p.id,
                    submissionId: p.submissionId,
                    reference: p.policyNumber,
                    accountName: p.insuredName,
                    brokerName: p.brokerName,
                    brokerContact: p.brokerContact || p.brokerContactEmail || '',
                    underwriterName: p.underwriterName || '',
                    status: status,
                    lineOfBusiness: p.lineOfBusiness,
                    inception: p.effectiveDate,
                    expiry: p.expiryDate,
                    grossPremium: p.grossPremium,
                    netPremium: p.netPremium,
                    exposure: p.sumInsured,
                    description: 'Bound policy'
                };
            }

            vm.search = function () {
                vm.loading = true;
                vm.error = null;
                vm.info = null;
                vm.searched = true;
                vm.mode = 'policy';
                var pending = 2;
                var subs = [];
                var pols = [];

                function done() {
                    pending -= 1;
                    if (pending > 0) { return; }
                    var combined = [];
                    (subs || []).forEach(function (s) {
                        var row = mapSubmission(s);
                        if (matchesCriteria(row)) { combined.push(row); }
                    });
                    (pols || []).forEach(function (p) {
                        var row = mapPolicy(p);
                        if (matchesCriteria(row)) { combined.push(row); }
                    });
                    vm.results = combined;
                    vm.loading = false;
                    if (!combined.length && !vm.error) {
                        vm.info = 'No matches for the current criteria. Clear values and Search again to list all risks.';
                    }
                }

                ApiService.get('/submissions', { pageSize: 500 }).then(function (data) {
                    subs = (data && data.items) || data || [];
                    done();
                }).catch(function (err) {
                    vm.error = err.message;
                    done();
                });

                ApiService.get('/policies', { pageSize: 500 }).then(function (data) {
                    pols = (data && data.items) || data || [];
                    done();
                }).catch(function () {
                    done();
                });
            };

            vm.searchQueries = function () {
                vm.queryLoading = true;
                ApiService.get('/pipeline/queries', { pageSize: 200 }).then(function (data) {
                    var rows = data || [];
                    var term = String(vm.queryFilter || '').toLowerCase();
                    if (term) {
                        rows = rows.filter(function (r) {
                            return String(r.accountName || '').toLowerCase().indexOf(term) >= 0
                                || String(r.description || '').toLowerCase().indexOf(term) >= 0
                                || String(r.underwriterName || '').toLowerCase().indexOf(term) >= 0
                                || String(r.reference || '').toLowerCase().indexOf(term) >= 0;
                        });
                    }
                    vm.queryResults = rows;
                }).catch(function (err) {
                    vm.error = err.message;
                    vm.queryResults = [];
                }).finally(function () {
                    vm.queryLoading = false;
                });
            };

            vm.open = function (row) {
                var base = (APEX_CONFIG && APEX_CONFIG.ng8BaseUrl) || '/ng8';
                if (row.submissionId) {
                    window.location.href = base + '/case-hub/' + row.submissionId;
                }
            };

            vm.openQuery = function (q) {
                if (q.rowType === 'task' && q.entityId) {
                    window.location.href = '#!/tasks/' + q.entityId;
                    return;
                }
                var base = (APEX_CONFIG && APEX_CONFIG.ng8BaseUrl) || '/ng8';
                if (q.submissionId) {
                    window.location.href = base + '/case-hub/' + q.submissionId;
                } else {
                    window.location.href = '#!/inbox';
                }
            };

            function applyGlobalSearchParams() {
                var params = $location.search() || {};
                var q = (params.q || '').toString().trim();
                var cat = (params.cat || 'all').toString().toLowerCase();
                if (!q) { return false; }

                vm.mode = 'policy';
                if (cat === 'reference') {
                    vm.criteria = [{ field: 'reference', operator: 'contains', value: q, valueTo: '', join: 'and' }];
                } else if (cat === 'account') {
                    vm.criteria = [{ field: 'assured', operator: 'contains', value: q, valueTo: '', join: 'and' }];
                } else if (cat === 'policy') {
                    vm.criteria = [{ field: 'policyNumber', operator: 'contains', value: q, valueTo: '', join: 'and' }];
                } else {
                    // All — match across reference, account, policy number (OR)
                    vm.criteria = [
                        { field: 'assured', operator: 'contains', value: q, valueTo: '', join: 'and' },
                        { field: 'reference', operator: 'contains', value: q, valueTo: '', join: 'or' },
                        { field: 'policyNumber', operator: 'contains', value: q, valueTo: '', join: 'or' },
                        { field: 'submissionNumber', operator: 'contains', value: q, valueTo: '', join: 'or' }
                    ];
                }
                return true;
            }

            if (applyGlobalSearchParams()) {
                vm.search();
            }
        }
    ]);
})();
