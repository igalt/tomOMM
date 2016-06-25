(function(){
    'use strict';

    var app = angular.module('users');
    app.component('userQuickViewComponent', {
        bindings: {},
        templateUrl: 'modules/users/client/views/profile/quick-view.client.view.html',
        controller: userQuickViewComponent,
        controllerAs: 'vm'

    });
    userQuickViewComponent.$inject = ['$state'];

    function userQuickViewComponent ($state) {
        var vm = this;
    }

    app.component('userQuickViewComponent2', {
        bindings: {},
        templateUrl: 'modules/users/client/views/profile/quick-view-2.client.view.html',
        controller: userQuickViewComponent2,
        controllerAs: 'vm'

    });
    userQuickViewComponent2.$inject = ['$state'];

    function userQuickViewComponent2 ($state) {
        var vm = this;
    }

    app.component('userQuickViewComponent3', {
        bindings: {},
        templateUrl: 'modules/users/client/views/profile/quick-view-3.client.view.html',
        controller: userQuickViewComponent3,
        controllerAs: 'vm'

    });
    userQuickViewComponent3.$inject = ['$state'];

    function userQuickViewComponent3 ($state) {
        var vm = this;
    }

})();
