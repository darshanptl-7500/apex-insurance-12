(function () {
    'use strict';

    /**
     * <apex-empty-state title="'No submissions found'" message="'Try widening your filters.'"></apex-empty-state>
     */
    angular.module('apexApp').directive('apexEmptyState', [function () {
        return {
            restrict: 'E',
            scope: {
                title: '=',
                message: '='
            },
            template:
                '<div class="apex-empty">' +
                '  <div class="apex-empty__icon">&#9723;</div>' +
                '  <div class="apex-empty__title">{{title}}</div>' +
                '  <div>{{message}}</div>' +
                '</div>'
        };
    }]);
})();
