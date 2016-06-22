(function () {
    'use strict';
    var app = angular.module('core');

    app.component('marketComponent', {
        bindings: {
        },
        templateUrl: 'modules/market/client/views/market.client.view.html',
        controller: marketComponent,
        controllerAs: 'vm'
    });

    marketComponent.$inject = ['Authentication', '$rootScope', '$window'];

    function marketComponent (Authentication, $rootScope, $window) {
        var vm = this;

        // This provides Authentication context.
        vm.authentication = Authentication;

        // allows for using external links with ui-router
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams) {
                if (toState.external) {
                    event.preventDefault();
                    $window.open(toState.url, '_self');
                }
            });

    }
})();

