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
        date: {
          roles: ['guest', 'user', 'admin'],
          pageTitle: 'Open Makers Market'
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
