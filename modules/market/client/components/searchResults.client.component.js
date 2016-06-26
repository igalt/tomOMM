(function () {
    'use strict';
    var app = angular.module('core');

    app.component('marketSearchComponent', {
        templateUrl: 'modules/market/client/views/searchResults.client.view.html',
        controller: marketSearchComponent,
        controllerAs: 'vm'
    });

    marketSearchComponent.$inject = ['Authentication', '$state', '$stateParams'];

    function marketSearchComponent (Authentication ,$state, $stateParams) {
        var vm = this;
        vm.searchTerm = $stateParams.searchTerm;
        // This provides Authentication context.
        vm.authentication = Authentication;

        function goToResults(){
            console.log('search: ' + vm.searchText);
            $state.go('market.searchResults',{
                'searchTerm': vm.searchText
            });
        }

        function goToLogin() {
            $state.go('market.login');
        }

    }
})();


