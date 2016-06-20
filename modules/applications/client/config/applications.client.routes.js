(function () {
  'use strict';

  var app = angular.module('applications');
  app.config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('applications', {
        abstract: true,
        url: '/applications',
        template: '<ui-view class="applications-section" />'
      })
      .state('applications.create', {
        url: '/:makeathonId/create',
        component: 'applicationsCreateComponent',
        resolve: {
          application: newApplication,
          makeathon: getMakeathon
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Applications Create'
        }
      })
      .state('applications.list', {
        url: '/:makeathonId/list',
        component: 'applicationsListComponent',
        resolve: {
          applications: getApplicationsByMakeathonId,
          makeathon: getMakeathon
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Applications List'
        }
      })
      .state('applications.edit', {
        url: '/:makeathonId/:applicationId/edit',
        component: 'applicationsEditComponent',
        resolve: {
          application: getApplication,
          makeathon: getMakeathon
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Application {{ applicationResolve.name }}'
        }
      })
      .state('applications.view', {
        url: '/:makeathonId/:applicationId/view',
        component: 'applicationsEditComponent',
        resolve: {
          application: getApplication,
          makeathon: getMakeathon
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Application {{ articleResolve.name }}'
        }
      })
      .state('applications.terms', {
        url: '/terms',
        templateUrl: 'modules/applications/client/views/terms.client.view.html'
      })
      .state('applications.thanks', {
        url: '/:makeathonId/:applicationId/thanks',
        component: 'applicationsThanksComponent',
        resolve: {
          application: getApplication,
          makeathon: getMakeathon
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Thanks You'
        }
      });
  }

  getApplication.$inject = ['$stateParams', 'ApplicationsService'];

  function getApplication($stateParams, ApplicationsService) {
    return ApplicationsService.get({
      applicationId: $stateParams.applicationId
    }).$promise;
  }

  newApplication.$inject = ['ApplicationsService'];

  function newApplication(ApplicationsService) {
    return new ApplicationsService();
  }

  getMakeathon.$inject = ['$stateParams', 'MakeathonsService'];

  function getMakeathon($stateParams, MakeathonsService) {
    if (!$stateParams.makeathonId) {
      // default makeathon for blank applications that not belong to any
      return { name: 'TOM applications' };
    }
    return MakeathonsService.get({
      makeathonId: $stateParams.makeathonId
    }).$promise;
  }

  newMakeathon.$inject = ['MakeathonsService'];

  function newMakeathon(MakeathonsService) {
    return new MakeathonsService();
  }

  getApplicationsByMakeathonId.$inject = ['$stateParams', 'ApplicationsService'];

  function getApplicationsByMakeathonId($stateParams, ApplicationsService){

    var filter = '';
    if ($stateParams.makeathonId) {
      filter = { makeathonId: $stateParams.makeathonId };
    }
    return ApplicationsService.query(filter);
  }
})();
