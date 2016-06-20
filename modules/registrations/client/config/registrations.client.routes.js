(function () {
  'use strict';

  angular
    .module('registrations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('registrations', {
        abstract: true,
        url: '/registrations',
        template: '<ui-view/>'
      })
      .state('registrations.list', {
        url: '',
        templateUrl: 'modules/registrations/client/views/list-registrations.client.view.html',
        controller: 'RegistrationsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: 'Registrations List'
        }
      })
      .state('registrations.create', {
        url: '/create',
        templateUrl: 'modules/registrations/client/views/form-registration.client.view.html',
        controller: 'RegistrationsController',
        controllerAs: 'vm',
        resolve: {
          registrationResolve: newRegistration
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Registrations Create'
        }
      })
      .state('registrations.edit', {
        url: '/:registrationId/edit',
        templateUrl: 'modules/registrations/client/views/form-registration.client.view.html',
        controller: 'RegistrationsController',
        controllerAs: 'vm',
        resolve: {
          registrationResolve: getRegistration
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Registration {{ registrationResolve.name }}'
        }
      })
      .state('registrations.view', {
        url: '/:registrationId',
        templateUrl: 'modules/registrations/client/views/view-registration.client.view.html',
        controller: 'RegistrationsController',
        controllerAs: 'vm',
        resolve: {
          registrationResolve: getRegistration
        },
        data:{
          roles: ['admin'],
          pageTitle: 'Registration {{ articleResolve.name }}'
        }
      });
  }

  getRegistration.$inject = ['$stateParams', 'RegistrationsService'];

  function getRegistration($stateParams, RegistrationsService) {
    return RegistrationsService.get({
      registrationId: $stateParams.registrationId
    }).$promise;
  }

  newRegistration.$inject = ['RegistrationsService'];

  function newRegistration(RegistrationsService) {
    return new RegistrationsService();
  }
})();
