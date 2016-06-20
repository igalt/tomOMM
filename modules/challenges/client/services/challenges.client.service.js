//Challenges service used to communicate Challenges REST endpoints
(function () {
  'use strict';

  angular
    .module('challenges')
    .factory('ChallengesService', ChallengesService);

  ChallengesService.$inject = ['$resource'];

  function ChallengesService($resource) {
    return $resource('api/challenges/:challengeId', {
      challengeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
