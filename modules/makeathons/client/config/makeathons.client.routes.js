(function () {
  'use strict';

  var app = angular.module('makeathons');
  app.config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
        .state('makeathons', {
          abstract: true,
          url: '/makeathons',
          template: '<ui-view class="makeathon-section"/>'
        })
        .state('makeathons.list', {
          url: '',
          component: 'makeathonsListComponent',
          data: {
            roles: ['user', 'admin'],
            pageTitle: 'Makeathons List'
          }
        })
        .state('makeathons.create', {
          url: '/create',
          component: 'makeathonsCreateComponent',
          resolve: {
            makeathon: newMakeathon,
            menuitems: getSideMenu
          },
          data: {
            roles: ['admin'],
            pageTitle : 'Makeathons Create'
          }
        })
        .state('makeathons.view', {
          url: '/:makeathonId',
          component: 'makeathonsViewComponent',
          resolve: {
            makeathon: getMakeathon
          },
          data:{
            roles: ['user', 'admin'],
            pageTitle: 'Makeathon {{ makeathon.name }}'
          }
        })
        .state('makeathons.thanks', {
          url: '/:makeathonId/thanks',
          component: 'makeathonsThanksComponent',
          resolve: {
            makeathon: getMakeathon
          },
          data:{
            roles: ['user', 'admin'],
            pageTitle: 'Thanks You'
          }
        });
  }

  getMakeathon.$inject = ['$stateParams', 'MakeathonsService'];

  function getMakeathon($stateParams, MakeathonsService) {
    return MakeathonsService.get({
      makeathonId: $stateParams.makeathonId
    }).$promise;
  }

  newMakeathon.$inject = ['MakeathonsService'];

  function newMakeathon(MakeathonsService) {
    return new MakeathonsService();
  }

  getSideMenu.$inject = ['$http', '$resource'];

  function getSideMenu($http, $resource) {
    var Menu = $resource('/api/sideMenu', { menuId:'@id' });
    return Menu.query().$promise;
  }

})();
