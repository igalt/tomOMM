(function () {
  'use strict';

  var app = angular.module('core.admin.routes');
  app.config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];
  // Setting up route
  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view class="admin-section"/>',
        data: {
          roles: ['admin']
        }
      });
  }
})();
