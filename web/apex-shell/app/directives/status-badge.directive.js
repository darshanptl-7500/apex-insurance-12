(function () {
    'use strict';

    /**
     * <apex-status-badge kind="'submission'" value="submission.status"></apex-status-badge>
     * kind: 'submission' | 'policy' | 'claim' | 'task'
     */
    angular.module('apexApp').directive('apexStatusBadge', ['APEX_ENUMS', function (APEX_ENUMS) {
        var MAP = {
            submission: APEX_ENUMS.submissionStatus,
            policy: APEX_ENUMS.policyStatus,
            claim: APEX_ENUMS.claimStatus,
            task: APEX_ENUMS.workflowTaskStatus
        };

        return {
            restrict: 'E',
            scope: {
                kind: '=',
                value: '='
            },
            template: '<span class="apex-badge" ng-class="\'apex-badge--\' + badgeClass">{{label}}</span>',
            link: function (scope) {
                function refresh() {
                    var lookup = MAP[scope.kind] || {};
                    var entry = lookup[scope.value];
                    scope.label = entry ? entry.label : (scope.value || 'Unknown');
                    scope.badgeClass = entry ? entry.badge : 'neutral';
                }
                scope.$watch('kind', refresh);
                scope.$watch('value', refresh);
            }
        };
    }]);
})();
