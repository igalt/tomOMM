(function () {
  'use strict';

    var app = angular.module('market');
    app.config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('market', {
          abstract: true,
          url: '/market',
          template: '<ui-view class="applications-section" />'
        })
        .state('market.home', {
        url: '',
        component: 'marketComponent',
        data: {
          roles: ['guest', 'user', 'admin'],
          pageTitle: 'Open Makers Market'
        }
      })
    .state('market.searchResults', {
      url: '/search',
      component: 'marketSearchComponent',
      params: {'searchTerm': ''},
      data: {
        roles: ['guest', 'user', 'admin'],
        pageTitle: 'Search Results'
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
