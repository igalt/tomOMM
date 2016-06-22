(function () {
  'use strict';

  angular
    .module('market')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('market', {
        url: '/market',
        component: 'marketComponent',
        data: {
          roles: ['guest', 'user', 'admin'],
          pageTitle: 'Open Makers Market'
        }
      })
      .state('tomSite', {
        url: 'http://tomglobal.org',
        external: true,
        data: {
          roles: ['guest', 'user', 'admin']
        }
    });
  }

  getMarket.$inject = ['$stateParams', 'marketService'];

  function getMarket($stateParams, marketService) {
    return marketService.get({
      marketId: $stateParams.marketId
    }).$promise;
  }

  newMarket.$inject = ['marketService'];

  function newMarket(MarketService) {
    return new MarketService();
  }
})();
