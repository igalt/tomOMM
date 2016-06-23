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

    marketComponent.$inject = ['Authentication', '$rootScope', '$window', '$state'];

    function marketComponent (Authentication, $rootScope, $window, $state) {
        var vm = this;
        vm.searchTerm = '';
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

        vm.goToResults = function(){
            $state.go('market.searchResults', {
                searchTerm: vm.searchTerm
            });
        };

    }
})();

