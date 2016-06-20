//Makeathons service used to communicate Makeathons REST endpoints
(function () {
  'use strict';

  angular
    .module('makeathons')
    .factory('MakeathonsService', MakeathonsService);

  MakeathonsService.$inject = ['$resource'];

  function MakeathonsService($resource) {
    return $resource('api/makeathons/:makeathonId', {
      makeathonId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
