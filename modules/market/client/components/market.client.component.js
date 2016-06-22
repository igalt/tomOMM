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

    marketComponent.$inject = ['Authentication'];

    function marketComponent (Authentication) {
        var vm = this;

        // This provides Authentication context.
        vm.authentication = Authentication;

    }
})();

