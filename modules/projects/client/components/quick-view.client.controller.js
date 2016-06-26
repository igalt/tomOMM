(function () {
    'use strict';
    
    var app = angular.module('makeathons');
    
    app.component('projectQuickViewComponent', {
        templateUrl: 'modules/projects/client/views/quick-view-project.client.view.html',
        controller: projectQuickViewComponent,
        controllerAs: 'vm'
    });
    projectQuickViewComponent.$inject = ['$state'];

    function projectQuickViewComponent ($state) {
        var vm = this;
    }

    app.component('projectQuickViewComponent2', {
        templateUrl: 'modules/projects/client/views/quick-view-project-2.client.view.html',
        controller: projectQuickViewComponent2,
        controllerAs: 'vm'
    });
    projectQuickViewComponent2.$inject = ['$state'];

    function projectQuickViewComponent2 ($state) {
        var vm = this;
    };

    app.component('projectQuickViewComponent3', {
        templateUrl: 'modules/projects/client/views/quick-view-project-3.client.view.html',
        controller: projectQuickViewComponent3,
        controllerAs: 'vm'
    });
    projectQuickViewComponent3.$inject = ['$state'];

    function projectQuickViewComponent3 ($state) {
        var vm = this;
    };
})();
