(function () {
  'use strict';

  var app = angular.module('users');
  app.config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

// Setting up route
  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('users', {
          abstract: true,
          url: '/users',
          template: '<ui-view/>'
      })
      .state('settings', {
        abstract: true,
        url: '/settings',
        component: 'settingsComponent',
        data: {
          roles: ['guest', 'user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        component: 'editProfileComponent',
        data: {
          roles: ['guest', 'user', 'admin']
        }
      })
      .state('settings.password', {
        url: '/password',
        component: 'changePasswordComponent',
        data: {
          roles: ['guest', 'user', 'admin']
        }
      })
      .state('settings.accounts', {
        url: '/accounts',
        component: 'socialAccountsComponent',
        data: {
          roles: ['guest', 'user', 'admin']
        }
      })
      .state('settings.picture', {
        url: '/picture',
        component: 'changeProfilePictureComponent',
        data: {
          roles: ['guest', 'user', 'admin']
        }
      })
      .state('userprofile', {
        abstract: true,
        url: '/userprofile',
        component: 'userProfileComponent'
      })
      .state('userprofile.view', {
        url: '/view',
        component: 'showUserProfileComponent',
        data: {
          roles: ['guest','user','admin']
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        component: 'authenticationComponent'
      })
      .state('authentication.signup', {
        url: '/signup',
        component: 'signupComponent'
      })
      .state('authentication.signin', {
        url: '/signin?err',
        component: 'signinComponent'
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        component: 'forgotPasswordComponent'
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html'
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html'
      })
      .state('password.reset.form', {
          url: '/:token',
          component: 'resetPasswordComponent'
      })
      .state('users.view', {
            url: '/:userId',
            templateUrl: 'modules/users/client/views/profile/show-profile.client.view.html',
              controller: 'showUserProfileComponent',
              controllerAs: 'vm',
              resolve: {
                userResolve: getUser
              },
              data:{
                pageTitle: 'Project {{ articleResolve.name }}'
              }
            });

    getUser.$inject = ['$stateParams', 'UsersService'];

    function getUser($stateParams, UsersService) {
      return UsersService.get({
        userId: $stateParams.userId
      }).$promise;
    }
  }
})();
