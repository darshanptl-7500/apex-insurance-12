(function () {
    'use strict';

    angular.module('apexApp').config([
        '$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {

            $routeProvider
                .when('/login', {
                    templateUrl: 'app/views/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    publicRoute: true
                })
                .when('/pipeline', { redirectTo: '/pipeline/upcoming' })
                .when('/pipeline/:bucket', {
                    templateUrl: 'app/views/pipeline.html',
                    controller: 'PipelineController',
                    controllerAs: 'vm'
                })
                .when('/search', {
                    templateUrl: 'app/views/search.html',
                    controller: 'SearchController',
                    controllerAs: 'vm'
                })
                .when('/openbox', {
                    templateUrl: 'app/views/openbox.html',
                    controller: 'OpenBoxController',
                    controllerAs: 'vm'
                })
                .when('/connect', {
                    templateUrl: 'app/views/connect.html',
                    controller: 'ConnectController',
                    controllerAs: 'vm'
                })
                .when('/support', {
                    templateUrl: 'app/views/support.html',
                    controller: 'SupportController',
                    controllerAs: 'vm'
                })
                .when('/submissions', {
                    templateUrl: 'app/views/submissions-list.html',
                    controller: 'SubmissionsListController',
                    controllerAs: 'vm'
                })
                .when('/submissions/new', {
                    templateUrl: 'app/views/submission-create.html',
                    controller: 'SubmissionCreateController',
                    controllerAs: 'vm'
                })
                .when('/submissions/:id', {
                    templateUrl: 'app/views/submission-detail.html',
                    controller: 'SubmissionDetailController',
                    controllerAs: 'vm'
                })
                .when('/policies', {
                    templateUrl: 'app/views/policies-list.html',
                    controller: 'PoliciesListController',
                    controllerAs: 'vm'
                })
                .when('/policies/:id', {
                    templateUrl: 'app/views/policy-detail.html',
                    controller: 'PolicyDetailController',
                    controllerAs: 'vm'
                })
                .when('/claims', {
                    templateUrl: 'app/views/claims-list.html',
                    controller: 'ClaimsListController',
                    controllerAs: 'vm'
                })
                .when('/claims/:id', {
                    templateUrl: 'app/views/claim-detail.html',
                    controller: 'ClaimDetailController',
                    controllerAs: 'vm'
                })
                .when('/referrals', {
                    templateUrl: 'app/views/referrals.html',
                    controller: 'ReferralsController',
                    controllerAs: 'vm'
                })
                .when('/inbox', {
                    templateUrl: 'app/views/inbox.html',
                    controller: 'InboxController',
                    controllerAs: 'vm'
                })
                .when('/tasks/:id', {
                    templateUrl: 'app/views/task-detail.html',
                    controller: 'TaskDetailController',
                    controllerAs: 'vm'
                })
                .when('/tasks', { redirectTo: '/inbox' })
                .when('/renewals', {
                    templateUrl: 'app/views/renewals.html',
                    controller: 'RenewalsController',
                    controllerAs: 'vm'
                })
                .when('/brokers', {
                    templateUrl: 'app/views/brokers-list.html',
                    controller: 'BrokersListController',
                    controllerAs: 'vm'
                })
                .when('/brokers/:id', {
                    templateUrl: 'app/views/broker-detail.html',
                    controller: 'BrokerDetailController',
                    controllerAs: 'vm'
                })
                .when('/documents', {
                    templateUrl: 'app/views/documents.html',
                    controller: 'DocumentsController',
                    controllerAs: 'vm'
                })
                .otherwise({ redirectTo: '/pipeline/upcoming' });

            // hashbang (#!/) routing keeps this deployable on any static host
            // without server-side rewrite rules, unlike html5Mode.
            $locationProvider.hashPrefix('!');
        }
    ]);
})();
