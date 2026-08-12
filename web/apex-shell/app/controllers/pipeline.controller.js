(function () {
    'use strict';

    angular.module('apexApp').controller('PipelineController', [
        '$routeParams', '$location', '$scope', '$window', '$timeout', 'ApiService', 'AuthService', 'APEX_CONFIG',
        function ($routeParams, $location, $scope, $window, $timeout, ApiService, AuthService, APEX_CONFIG) {
            var vm = this;
            var PROFILE_KEY = 'apex_pipeline_profile';
            var gridApi = null;

            vm.bucket = ($routeParams.bucket || 'upcoming').toLowerCase();
            vm.loading = true;
            vm.error = null;
            vm.rows = [];
            vm.filteredCount = 0;
            vm.summary = {};
            vm.filters = {
                search: '',
                businessArea: '',
                expiringRenewalsOnly: false,
                showNonRenewable: false,
                dateFromDays: -90,
                dateToDays: 90
            };
            vm.pageSize = 25;
            vm.columnVisibility = {
                badges: true, area: true, account: true, reference: true, sc1: true, mop: true,
                description: true, nr: true, uw: true, inception: true, expiry: true, status: true,
                net100: true, netShare: true, broker: true, contact: true, exposure: true
            };
            vm.columnOptions = [
                { key: 'badges', label: 'Badges', colId: 'badges' },
                { key: 'area', label: 'Area', colId: 'area' },
                { key: 'account', label: 'Account', colId: 'accountName' },
                { key: 'reference', label: 'Reference', colId: 'reference' },
                { key: 'sc1', label: 'SC1', colId: 'statCode1' },
                { key: 'mop', label: 'MOP', colId: 'mop' },
                { key: 'description', label: 'Description', colId: 'description' },
                { key: 'nr', label: 'N/R', colId: 'newOrRenewal' },
                { key: 'uw', label: 'UW', colId: 'underwriterName' },
                { key: 'inception', label: 'Inception', colId: 'inception' },
                { key: 'expiry', label: 'Expiry', colId: 'expiry' },
                { key: 'status', label: 'Status', colId: 'status' },
                { key: 'net100', label: 'Net (100%)', colId: 'net100' },
                { key: 'netShare', label: 'Net Share', colId: 'netSharePremium' },
                { key: 'broker', label: 'Broker', colId: 'brokerName' },
                { key: 'contact', label: 'Contact', colId: 'brokerContact' },
                { key: 'exposure', label: 'Exposure', colId: 'exposure' }
            ];
            vm.showGridDisplay = false;

            vm.buckets = [
                { key: 'recent', label: 'Recent Activity', countKey: 'recentActivity', group: 'shortcuts' },
                { key: 'day-file', label: 'Day File', countKey: 'dayFile', group: 'shortcuts' },
                { key: 'queries', label: 'Queries', countKey: 'queries', group: 'shortcuts' },
                { key: 'upcoming', label: 'Upcoming', countKey: 'upcoming', group: 'pipeline' },
                { key: 'bound', label: 'Bound', countKey: 'bound', group: 'pipeline' },
                { key: 'ntu', label: 'NTU / Declined', countKey: 'ntuDeclined', group: 'pipeline' },
                { key: 'referrals', label: 'Referrals', countKey: 'referrals', group: 'pipeline' },
                { key: 'da', label: 'Delegated Authority', countKey: 'delegatedAuthority', group: 'da' }
            ];

            vm.areaOptions = [
                { value: 'PROP', label: 'Property' },
                { value: 'LIAB', label: 'Liability' },
                { value: 'PI', label: 'PI' },
                { value: 'CARGO', label: 'Cargo' },
                { value: 'UPSEN', label: 'Upstream Energy' }
            ];

            vm.queryForm = {
                submissionId: null,
                queryType: 'Clarification',
                assignedToUserId: null,
                body: '',
                priority: 'Normal',
                dueDays: 3
            };
            vm.queryBusy = false;
            vm.queryError = null;
            vm.querySuccess = null;
            vm.users = [];
            vm.submissionsForQuery = [];

            function moneyFormatter(params) {
                if (params.value == null || params.value === '') { return '—'; }
                var n = Number(params.value);
                if (isNaN(n)) { return '—'; }
                return '£' + n.toLocaleString('en-GB', { maximumFractionDigits: 0 });
            }

            function dateFormatter(params) {
                if (!params.value) { return '—'; }
                var d = new Date(params.value);
                if (isNaN(d.getTime())) { return '—'; }
                var dd = ('0' + d.getDate()).slice(-2);
                var mm = ('0' + (d.getMonth() + 1)).slice(-2);
                return dd + '/' + mm + '/' + d.getFullYear();
            }

            function badgesRenderer(params) {
                var r = params.data || {};
                var parts = [];
                if (!r.isReferral && !r.isOverdue && !r.isDelegatedAuthority) {
                    parts.push('<span class="apex-chip apex-chip--ok">OK</span>');
                }
                if (r.isReferral) { parts.push('<span class="apex-chip apex-chip--ref">RF</span>'); }
                if (r.isOverdue) { parts.push('<span class="apex-chip apex-chip--due">DU</span>'); }
                if (r.isDelegatedAuthority) { parts.push('<span class="apex-chip apex-chip--da">DA</span>'); }
                if (r.hasSecondSight) { parts.push('<span class="apex-chip apex-chip--wf" title="Second Sight">SS</span>'); }
                if (r.hasFrontSheet) { parts.push('<span class="apex-chip apex-chip--wf" title="Front Sheet">FS</span>'); }
                if (r.hasModelling) { parts.push('<span class="apex-chip apex-chip--wf" title="Modelling">M</span>'); }
                return parts.join(' ');
            }

            function textFilter() {
                return {
                    filter: 'agTextColumnFilter',
                    filterParams: {
                        filterOptions: [
                            'contains', 'notContains', 'equals', 'notEqual',
                            'startsWith', 'endsWith', 'blank', 'notBlank'
                        ],
                        defaultOption: 'contains',
                        buttons: ['apply', 'reset'],
                        closeOnApply: true
                    }
                };
            }

            function numberFilter() {
                return {
                    filter: 'agNumberColumnFilter',
                    filterParams: {
                        filterOptions: [
                            'equals', 'notEqual', 'greaterThan', 'greaterThanOrEqual',
                            'lessThan', 'lessThanOrEqual', 'inRange', 'blank', 'notBlank'
                        ],
                        defaultOption: 'greaterThanOrEqual',
                        buttons: ['apply', 'reset'],
                        closeOnApply: true
                    }
                };
            }

            function dateFilter() {
                return {
                    filter: 'agDateColumnFilter',
                    filterParams: {
                        filterOptions: [
                            'equals', 'notEqual', 'lessThan', 'greaterThan',
                            'inRange', 'blank', 'notBlank'
                        ],
                        defaultOption: 'equals',
                        buttons: ['apply', 'reset'],
                        closeOnApply: true,
                        comparator: function (filterLocalDateAtMidnight, cellValue) {
                            if (!cellValue) { return -1; }
                            var cell = new Date(cellValue);
                            cell.setHours(0, 0, 0, 0);
                            if (cell.getTime() === filterLocalDateAtMidnight.getTime()) { return 0; }
                            return cell < filterLocalDateAtMidnight ? -1 : 1;
                        }
                    }
                };
            }

            function buildColumnDefs() {
                return [
                    {
                        colId: 'badges', headerName: '', field: 'badges', width: 110, pinned: 'left',
                        sortable: false, filter: false, cellRenderer: badgesRenderer,
                        hide: !vm.columnVisibility.badges
                    },
                    Object.assign({
                        colId: 'area', headerName: 'Area', field: 'area', width: 100,
                        valueGetter: function (p) { return p.data.businessArea || p.data.lineOfBusiness || ''; },
                        hide: !vm.columnVisibility.area
                    }, textFilter()),
                    Object.assign({
                        colId: 'accountName', headerName: 'Account Name', field: 'accountName',
                        minWidth: 160, flex: 1, hide: !vm.columnVisibility.account,
                        cellClass: 'apex-table__link'
                    }, textFilter()),
                    Object.assign({
                        colId: 'reference', headerName: 'Reference', field: 'reference',
                        width: 140, hide: !vm.columnVisibility.reference, cellClass: 'apex-mono'
                    }, textFilter()),
                    Object.assign({
                        colId: 'statCode1', headerName: 'SC1', field: 'statCode1',
                        width: 80, hide: !vm.columnVisibility.sc1
                    }, textFilter()),
                    Object.assign({
                        colId: 'mop', headerName: 'MOP', field: 'mop',
                        width: 90, hide: !vm.columnVisibility.mop
                    }, textFilter()),
                    Object.assign({
                        colId: 'description', headerName: 'Policy Description', field: 'description',
                        minWidth: 180, flex: 1, hide: !vm.columnVisibility.description
                    }, textFilter()),
                    Object.assign({
                        colId: 'newOrRenewal', headerName: 'N/R', field: 'newOrRenewal',
                        width: 70, hide: !vm.columnVisibility.nr
                    }, textFilter()),
                    Object.assign({
                        colId: 'underwriterName', headerName: 'UW', field: 'underwriterName',
                        width: 130, hide: !vm.columnVisibility.uw
                    }, textFilter()),
                    Object.assign({
                        colId: 'inception', headerName: 'Inception', field: 'inception',
                        width: 110, hide: !vm.columnVisibility.inception,
                        valueFormatter: dateFormatter
                    }, dateFilter()),
                    Object.assign({
                        colId: 'expiry', headerName: 'Expiry', field: 'expiry',
                        width: 110, hide: !vm.columnVisibility.expiry,
                        valueFormatter: dateFormatter
                    }, dateFilter()),
                    Object.assign({
                        colId: 'status', headerName: 'Status', field: 'status',
                        width: 110, hide: !vm.columnVisibility.status
                    }, textFilter()),
                    Object.assign({
                        colId: 'net100', headerName: 'Net (100%)',
                        width: 120, hide: !vm.columnVisibility.net100,
                        valueGetter: function (p) {
                            return p.data.netPremium != null ? p.data.netPremium : p.data.premium;
                        },
                        valueFormatter: moneyFormatter
                    }, numberFilter()),
                    Object.assign({
                        colId: 'netSharePremium', headerName: 'Net Share', field: 'netSharePremium',
                        width: 110, hide: !vm.columnVisibility.netShare,
                        valueFormatter: moneyFormatter
                    }, numberFilter()),
                    Object.assign({
                        colId: 'brokerName', headerName: 'Broker', field: 'brokerName',
                        width: 140, hide: !vm.columnVisibility.broker
                    }, textFilter()),
                    Object.assign({
                        colId: 'brokerContact', headerName: 'Contact', field: 'brokerContact',
                        width: 150, hide: !vm.columnVisibility.contact
                    }, textFilter()),
                    Object.assign({
                        colId: 'exposure', headerName: 'Exposure', field: 'exposure',
                        width: 120, hide: !vm.columnVisibility.exposure,
                        valueFormatter: moneyFormatter
                    }, numberFilter())
                ];
            }

            function updateFilteredCount() {
                if (!gridApi) {
                    vm.filteredCount = vm.rows.length;
                    return;
                }
                var count = 0;
                gridApi.forEachNodeAfterFilter(function () { count += 1; });
                vm.filteredCount = count;
            }

            function ensureGrid() {
                var el = $window.document.getElementById('apex-pipeline-grid');
                if (!el || !window.agGrid) { return; }
                if (gridApi) {
                    gridApi.setGridOption('rowData', vm.rows);
                    updateFilteredCount();
                    return;
                }

                var options = {
                    columnDefs: buildColumnDefs(),
                    rowData: vm.rows,
                    defaultColDef: {
                        sortable: true,
                        resizable: true,
                        floatingFilter: true,
                        suppressHeaderMenuButton: false,
                        filter: true
                    },
                    animateRows: true,
                    rowSelection: 'single',
                    suppressCellFocus: true,
                    popupParent: $window.document.body,
                    pagination: true,
                    paginationPageSize: vm.pageSize || 25,
                    paginationPageSizeSelector: [10, 25, 50, 100],
                    getRowClass: function (params) {
                        var classes = [];
                        if (params.data && params.data.isOverdue) { classes.push('apex-row--warn'); }
                        if (params.data && params.data.isReferral) { classes.push('apex-row--referral'); }
                        return classes.join(' ');
                    },
                    onGridReady: function (e) {
                        gridApi = e.api;
                        updateFilteredCount();
                        if (!$scope.$$phase) { $scope.$applyAsync(); }
                    },
                    onFilterChanged: function () {
                        updateFilteredCount();
                        if (!$scope.$$phase) { $scope.$applyAsync(); }
                    },
                    onPaginationChanged: function () {
                        if (gridApi) {
                            vm.pageSize = gridApi.paginationGetPageSize();
                        }
                    },
                    onRowClicked: function (e) {
                        if (e && e.data) {
                            $scope.$applyAsync(function () { vm.openRow(e.data); });
                        }
                    }
                };

                // AG Grid 31+: createGrid; older: new agGrid.Grid
                if (typeof window.agGrid.createGrid === 'function') {
                    gridApi = window.agGrid.createGrid(el, options);
                } else {
                    new window.agGrid.Grid(el, options);
                    // legacy sets api via onGridReady
                }
            }

            function destroyGrid() {
                if (gridApi && typeof gridApi.destroy === 'function') {
                    gridApi.destroy();
                }
                gridApi = null;
            }

            function loadProfile() {
                try {
                    var raw = $window.localStorage.getItem(PROFILE_KEY);
                    if (!raw) { return; }
                    var p = JSON.parse(raw);
                    if (p.filters) {
                        angular.extend(vm.filters, p.filters);
                        // Migrate legacy multi-select chip profile → single dropdown
                        if (!vm.filters.businessArea && angular.isArray(p.filters.businessAreas) && p.filters.businessAreas.length) {
                            vm.filters.businessArea = p.filters.businessAreas[0];
                        }
                        delete vm.filters.businessAreas;
                    }
                    if (p.columnVisibility) { angular.extend(vm.columnVisibility, p.columnVisibility); }
                    if (p.pageSize) { vm.pageSize = p.pageSize; }
                } catch (e) { /* ignore */ }
            }

            vm.saveProfile = function () {
                $window.localStorage.setItem(PROFILE_KEY, JSON.stringify({
                    filters: vm.filters,
                    columnVisibility: vm.columnVisibility,
                    pageSize: vm.pageSize
                }));
                vm.profileSaved = true;
            };

            vm.toggleGridDisplay = function () {
                vm.showGridDisplay = !vm.showGridDisplay;
            };

            vm.syncColumnVisibility = function () {
                if (!gridApi) { return; }
                vm.columnOptions.forEach(function (c) {
                    gridApi.setColumnsVisible([c.colId], !!vm.columnVisibility[c.key]);
                });
            };

            vm.clearColumnFilters = function () {
                if (gridApi) { gridApi.setFilterModel(null); }
                updateFilteredCount();
            };

            function loadSummary() {
                return ApiService.get('/pipeline/summary').then(function (data) {
                    vm.summary = data || {};
                });
            }

            function applyClientFilters(rows) {
                var today = new Date();
                today.setHours(0, 0, 0, 0);
                var from = new Date(today);
                from.setDate(from.getDate() + (Number(vm.filters.dateFromDays) || 0));
                var to = new Date(today);
                to.setDate(to.getDate() + (Number(vm.filters.dateToDays) || 0));
                to.setHours(23, 59, 59, 999);

                return (rows || []).filter(function (r) {
                    if (vm.filters.businessArea) {
                        var area = String(r.businessArea || r.lineOfBusiness || '').toUpperCase();
                        var c = String(vm.filters.businessArea).toUpperCase();
                        var hit = area === c
                            || (c === 'PROP' && area.indexOf('PROP') === 0)
                            || (c === 'LIAB' && (area.indexOf('LIAB') === 0 || area.indexOf('GL') === 0))
                            || (c === 'PI' && (area === 'PI' || area.indexOf('PROF') === 0))
                            || (c === 'CARGO' && area.indexOf('CARGO') === 0)
                            || (c === 'UPSEN' && (area.indexOf('UPSEN') === 0 || area.indexOf('ENERGY') >= 0));
                        if (!hit) { return false; }
                    }
                    if (vm.filters.expiringRenewalsOnly) {
                        if (!r.expiry) { return false; }
                        var horizon = new Date();
                        horizon.setDate(horizon.getDate() + 90);
                        if (new Date(r.expiry) > horizon) { return false; }
                        if ((r.newOrRenewal || '').toUpperCase() !== 'R') { return false; }
                    }
                    if (!vm.filters.showNonRenewable && r.isNonRenewable === true) {
                        return false;
                    }
                    var anchor = r.inception ? new Date(r.inception) : (r.expiry ? new Date(r.expiry) : null);
                    if (anchor && !isNaN(anchor.getTime())) {
                        if (anchor < from || anchor > to) { return false; }
                    }
                    return true;
                });
            }

            function loadRows() {
                vm.loading = true;
                vm.error = null;
                destroyGrid();
                return ApiService.get('/pipeline/' + vm.bucket, {
                    search: vm.filters.search || undefined,
                    lineOfBusiness: vm.filters.businessArea || undefined,
                    pageSize: 200
                }).then(function (data) {
                    vm.rows = applyClientFilters(data || []);
                    vm.filteredCount = vm.rows.length;
                }).catch(function (err) {
                    vm.error = err.message;
                    vm.rows = [];
                    vm.filteredCount = 0;
                }).finally(function () {
                    vm.loading = false;
                    // Wait for ng-if to create #apex-pipeline-grid before mounting AG Grid
                    $timeout(function () { ensureGrid(); }, 0);
                });
            }

            function loadQueryLookups() {
                vm.users = [
                    { id: 1, fullName: 'Uma Underwriter' },
                    { id: 2, fullName: 'Morgan Manager' },
                    { id: 3, fullName: 'Blair Broker Ops' },
                    { id: 4, fullName: 'Casey Claims' },
                    { id: 5, fullName: 'System Admin' }
                ];
                var me = AuthService.currentUser();
                vm.queryForm.assignedToUserId = (me && me.id) ? me.id : 1;

                ApiService.get('/pipeline/upcoming', { pageSize: 100 }).then(function (data) {
                    vm.submissionsForQuery = (data || []).filter(function (r) { return r.submissionId; });
                }).catch(function () { vm.submissionsForQuery = []; });
            }

            vm.selectBucket = function (key) {
                destroyGrid();
                $location.path('/pipeline/' + key);
            };

            vm.applyFilters = function () {
                loadRows();
            };

            vm.countFor = function (bucket) {
                return vm.summary[bucket.countKey] || 0;
            };

            vm.openRow = function (row) {
                var base = (APEX_CONFIG && APEX_CONFIG.ng8BaseUrl) || '/ng8';
                if (row.rowType === 'task' && row.entityId) {
                    $location.path('/tasks/' + row.entityId);
                    return;
                }
                if (row.submissionId) {
                    window.location.href = base + '/case-hub/' + row.submissionId;
                    return;
                }
                if (row.policyId) {
                    $location.path('/policies/' + row.policyId);
                }
            };

            vm.createQuery = function () {
                vm.queryError = null;
                vm.querySuccess = null;
                if (!vm.queryForm.submissionId) {
                    vm.queryError = 'Select a risk / submission.';
                    return;
                }
                if (!vm.queryForm.assignedToUserId) {
                    vm.queryError = 'Select an assignee.';
                    return;
                }
                if (!vm.queryForm.body) {
                    vm.queryError = 'Enter the query body.';
                    return;
                }
                var due = new Date();
                due.setDate(due.getDate() + (Number(vm.queryForm.dueDays) || 3));
                vm.queryBusy = true;
                ApiService.post('/workflow/tasks', {
                    title: '[Query] ' + vm.queryForm.queryType,
                    description: vm.queryForm.body,
                    submissionId: Number(vm.queryForm.submissionId),
                    assignedToUserId: Number(vm.queryForm.assignedToUserId),
                    dueDate: due.toISOString(),
                    priority: vm.queryForm.priority || 'Normal',
                    taskType: 'Query'
                }).then(function () {
                    vm.querySuccess = 'Query created.';
                    vm.queryForm.body = '';
                    loadSummary();
                    if (vm.bucket === 'queries') { loadRows(); }
                }).catch(function (err) {
                    vm.queryError = err.message || 'Failed to create query.';
                }).finally(function () {
                    vm.queryBusy = false;
                });
            };

            vm.exportExcel = function () {
                var exportRows = [];
                if (gridApi) {
                    gridApi.forEachNodeAfterFilterAndSort(function (node) {
                        if (node.data) { exportRows.push(node.data); }
                    });
                } else {
                    exportRows = vm.rows;
                }
                var header = ['Area', 'Account', 'Reference', 'SC1', 'MOP', 'Description', 'N/R', 'UW', 'Inception', 'Status', 'Net100', 'NetShare', 'Broker', 'Contact', 'Exposure'];
                var lines = [header.join(',')];
                exportRows.forEach(function (r) {
                    lines.push([
                        r.businessArea || r.lineOfBusiness || '',
                        '"' + (r.accountName || '').replace(/"/g, '""') + '"',
                        r.reference || '',
                        r.statCode1 || '',
                        r.mop || '',
                        '"' + (r.description || '').replace(/"/g, '""') + '"',
                        r.newOrRenewal || '',
                        '"' + (r.underwriterName || '').replace(/"/g, '""') + '"',
                        r.inception || '',
                        r.status || '',
                        r.netPremium != null ? r.netPremium : (r.premium || ''),
                        r.netSharePremium || '',
                        '"' + (r.brokerName || '').replace(/"/g, '""') + '"',
                        '"' + (r.brokerContact || '').replace(/"/g, '""') + '"',
                        r.exposure || ''
                    ].join(','));
                });
                var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'pipeline-' + vm.bucket + '.csv';
                a.click();
                URL.revokeObjectURL(url);
            };

            $scope.$on('apex:refresh', function () {
                loadSummary();
                loadRows();
            });

            $scope.$on('$destroy', function () {
                destroyGrid();
            });

            loadProfile();
            loadSummary();
            loadRows();
            if (vm.bucket === 'queries') { loadQueryLookups(); }
        }
    ]);
})();
