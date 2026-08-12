(function () {
    'use strict';

    angular.module('apexApp').run([
        '$rootScope', '$location', 'AuthService',
        function ($rootScope, $location, AuthService) {

            // Guard every route change: unauthenticated users are bounced to
            // /login, and authenticated users hitting /login are sent home.
            $rootScope.$on('$routeChangeStart', function (event, next) {
                var isPublic = next && next.$$route && next.$$route.publicRoute;
                var authenticated = AuthService.isAuthenticated();

                if (!authenticated && !isPublic) {
                    event.preventDefault();
                    $location.path('/login');
                } else if (authenticated && isPublic) {
                    event.preventDefault();
                    $location.path('/submissions');
                }
            });

            // Legacy AngularJS 1.6 caveat: $routeChangeStart's preventDefault
            // can leave $location half-updated on the very first load, so we
            // nudge it once more on the following digest.
            $rootScope.$on('$routeChangeError', function () {
                $location.path('/login');
            });
        }
    ]);
})();
