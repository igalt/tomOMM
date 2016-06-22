(function () {
    'use strict';
    
    var app = angular.module('makeathons');
    
    app.component('projectQuickViewComponent', {
        templateUrl: 'modules/projects/client/views/quick-view-project.client.view.html',
        controller: projectQuickViewComponent,
        controllerAs: 'vm'
    });
    projectQuickViewComponent.$inject = ['$state', 'Authentication', 'MakeathonsUtils', 'CommonService', '$window'];
    
    function projectQuickViewComponent ($state, Authentication, CommonService, $window) {
        var vm = this;
    }
})();
