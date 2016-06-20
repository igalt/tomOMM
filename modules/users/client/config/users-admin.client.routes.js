(function () {
  'use strict';

  var app = angular.module('users.admin.routes');
  app.config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  // Setting up route
  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        component: 'userListComponent'
      })
      .state('admin.user', {
        url: '/users/:userId',
        component: 'userViewComponent',
        resolve: {
          user: getUser
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        component: 'userEditComponent',
        resolve: {
          user: getUser
        }
      });
  }

  getUser.$inject = ['$stateParams', 'Admin'];

  function getUser($stateParams, Admin) {
    return Admin.get({
      userId: $stateParams.userId
    });
  }

})();
