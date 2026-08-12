(function () {
    'use strict';

    angular.module('apexApp').controller('DocumentsController', [
        '$location', '$http', '$window', '$sce', 'ApiService', 'AuthService', 'APEX_ENUMS',
        function ($location, $http, $window, $sce, ApiService, AuthService, APEX_ENUMS) {
            var vm = this;
            var search = $location.search();

            function documentDownloadUrl(id) {
                var url = ApiService.baseUrl + '/documents/' + id + '/download';
                var token = AuthService.getToken && AuthService.getToken();
                return token ? (url + '?access_token=' + encodeURIComponent(token)) : url;
            }

            vm.loading = true;
            vm.error = null;
            vm.documents = [];
            vm.enums = APEX_ENUMS;
            vm.folderFilter = null;
            vm.folders = [];
            vm.previewDoc = null;
            vm.previewIsPdf = false;
            vm.previewTrustedUrl = null;

            vm.context = {
                submissionId: search.submissionId || '',
                policyId: search.policyId || '',
                claimId: search.claimId || ''
            };

            vm.docTypeOptions = [
                { value: 'ProposalForm', label: 'Proposal Form' },
                { value: 'SOV', label: 'Statement of Values' },
                { value: 'LossRuns', label: 'Loss Runs' },
                { value: 'Schedule', label: 'Schedule' },
                { value: 'Quote', label: 'Quote' },
                { value: 'Policy', label: 'Policy' },
                { value: 'Endorsement', label: 'Endorsement' },
                { value: 'ClaimDoc', label: 'Claim Document' },
                { value: 'Other', label: 'Other' }
            ];

            vm.spawnOptions = ['Data Entry', 'Second Sight', 'Front Sheet', 'Modelling', 'Referral', 'Wording'];

            vm.upload = emptyUpload();
            vm.uploadBusy = false;
            vm.uploadError = null;
            vm.uploadSuccess = null;

            function emptyUpload() {
                return {
                    file: null,
                    documentType: 'ProposalForm',
                    notes: '',
                    author: '',
                    endorsementNo: '',
                    displayName: '',
                    externalReference: '',
                    spawn: {}
                };
            }

            vm.hasContext = function () {
                return !!(vm.context.submissionId || vm.context.policyId || vm.context.claimId);
            };

            function loadParams() {
                var params = {};
                if (vm.context.submissionId) { params.submissionId = vm.context.submissionId; }
                if (vm.context.policyId) { params.policyId = vm.context.policyId; }
                if (vm.context.claimId) { params.claimId = vm.context.claimId; }
                return params;
            }

            function parseMeta(notes) {
                var meta = { author: null, displayName: null, notes: notes };
                if (!notes || notes.indexOf('META|') !== 0) { return meta; }
                notes.split('|').slice(1).forEach(function (part) {
                    var kv = part.split('=');
                    if (kv.length < 2) { return; }
                    if (kv[0] === 'author') { meta.author = kv.slice(1).join('='); }
                    if (kv[0] === 'name') { meta.displayName = kv.slice(1).join('='); }
                    if (kv[0] === 'notes') { meta.notes = kv.slice(1).join('='); }
                });
                return meta;
            }

            function load() {
                vm.loading = true;
                vm.error = null;
                ApiService.get('/documents', loadParams()).then(function (data) {
                    vm.documents = ((data && data.items) || data || []).map(function (d) {
                        var meta = parseMeta(d.notes);
                        d.author = meta.author;
                        d.displayName = meta.displayName || d.fileName;
                        return d;
                    });
                    var set = {};
                    vm.documents.forEach(function (d) {
                        set[d.documentType || 'Other'] = true;
                    });
                    vm.folders = Object.keys(set).sort();
                }).catch(function (err) {
                    vm.error = err.message;
                    vm.documents = [];
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.countInFolder = function (f) {
                return vm.documents.filter(function (d) { return d.documentType === f; }).length;
            };

            vm.filteredDocs = function () {
                if (!vm.folderFilter) { return vm.documents; }
                return vm.documents.filter(function (d) { return d.documentType === vm.folderFilter; });
            };

            vm.onFileSelected = function (element) {
                vm.upload.file = element.files && element.files[0];
            };

            vm.submitUpload = function () {
                if (!vm.upload.file) {
                    vm.uploadError = 'Choose a file to upload.';
                    return;
                }
                vm.uploadBusy = true;
                vm.uploadError = null;
                vm.uploadSuccess = null;

                var spawn = vm.spawnOptions.filter(function (t) { return vm.upload.spawn[t]; });
                var formData = new FormData();
                formData.append('file', vm.upload.file);
                formData.append('documentType', vm.upload.documentType);
                formData.append('notes', vm.upload.notes || '');
                formData.append('author', vm.upload.author || '');
                formData.append('endorsementNo', vm.upload.endorsementNo || '');
                formData.append('displayName', vm.upload.displayName || '');
                formData.append('externalReference', vm.upload.externalReference || '');
                formData.append('spawnTasks', spawn.join(','));
                if (vm.context.submissionId) { formData.append('submissionId', vm.context.submissionId); }
                if (vm.context.policyId) { formData.append('policyId', vm.context.policyId); }
                if (vm.context.claimId) { formData.append('claimId', vm.context.claimId); }

                ApiService.upload('/documents/upload', formData).then(function () {
                    vm.upload = emptyUpload();
                    vm.uploadSuccess = spawn.length
                        ? ('Uploaded and spawned ' + spawn.length + ' task(s).')
                        : 'Uploaded.';
                    load();
                }).catch(function (err) {
                    vm.uploadError = err.message;
                }).finally(function () {
                    vm.uploadBusy = false;
                });
            };

            vm.download = function (doc) {
                if (!doc || !doc.id) { return; }
                $http.get(ApiService.baseUrl + '/documents/' + doc.id + '/download', {
                    responseType: 'arraybuffer'
                }).then(function (response) {
                    var type = (doc.contentType) || 'application/octet-stream';
                    var blob = new Blob([response.data], { type: type });
                    var url = $window.URL.createObjectURL(blob);
                    var link = $window.document.createElement('a');
                    link.href = url;
                    link.download = doc.fileName || ('document-' + doc.id);
                    $window.document.body.appendChild(link);
                    link.click();
                    link.remove();
                    $window.URL.revokeObjectURL(url);
                }).catch(function () {
                    vm.error = 'Download failed.';
                });
            };

            vm.preview = function (doc) {
                vm.previewDoc = doc;
                var ct = (doc.contentType || '').toLowerCase();
                var name = (doc.fileName || '').toLowerCase();
                vm.previewIsPdf = ct.indexOf('pdf') >= 0 || name.slice(-4) === '.pdf';
                if (vm.previewIsPdf) {
                    vm.previewTrustedUrl = $sce.trustAsResourceUrl(documentDownloadUrl(doc.id));
                } else {
                    vm.previewTrustedUrl = null;
                }
            };

            vm.clearPreview = function () {
                vm.previewDoc = null;
                vm.previewTrustedUrl = null;
            };

            vm.clearContext = function () {
                vm.context = { submissionId: '', policyId: '', claimId: '' };
                $location.search({});
                load();
            };

            load();
        }
    ]);
})();
