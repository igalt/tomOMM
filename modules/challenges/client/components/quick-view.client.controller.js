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

        
    };

    app.component('challengeQuickViewComponent2', {
        templateUrl: 'modules/challenges/client/views/quick-view-challenge-2.client.view.html',
        controller: challengeQuickViewComponent2,
        controllerAs: 'vm'
    });
    challengeQuickViewComponent2.$inject = ['$state'];

    function challengeQuickViewComponent2 ($state) {
        var vm = this;


    };

    app.component('challengeQuickViewComponent3', {
        templateUrl: 'modules/challenges/client/views/quick-view-challenge-3.client.view.html',
        controller: challengeQuickViewComponent2,
        controllerAs: 'vm'
    });
    challengeQuickViewComponent3.$inject = ['$state'];

    function challengeQuickViewComponent3 ($state) {
        var vm = this;


    };


})();
