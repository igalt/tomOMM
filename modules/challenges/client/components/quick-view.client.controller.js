(function () {
    'use strict';
    
    var app = angular.module('makeathons');
    
    app.component('challengeQuickViewComponent', {
        templateUrl: 'modules/challenges/client/views/quick-view-challenge.client.view.html',
        controller: challengeQuickViewComponent,
        controllerAs: 'vm'
    });
    challengeQuickViewComponent.$inject = ['$state'];
    
    function challengeQuickViewComponent ($state) {
        var vm = this;

        
    }
})();
