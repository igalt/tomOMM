//market service used to communicate market REST endpoints
(function () {
  'use strict';

  angular
    .module('market')
    .factory('marketService', marketService);

  marketService.$inject = ['$resource'];

  function marketService($resource) {
    return $resource('api/market/:marketId', {
      marketId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
