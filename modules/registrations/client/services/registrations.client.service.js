//Registrations service used to communicate Registrations REST endpoints
(function () {
  'use strict';

  angular
    .module('registrations')
    .factory('RegistrationsService', RegistrationsService);

  RegistrationsService.$inject = ['$resource'];

  function RegistrationsService($resource) {
    return $resource('api/registrations/:registrationId', {
      registrationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
