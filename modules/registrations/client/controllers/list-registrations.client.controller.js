(function () {
  'use strict';

  angular
    .module('registrations')
    .controller('RegistrationsListController', RegistrationsListController);

  RegistrationsListController.$inject = ['RegistrationsService'];

  function RegistrationsListController(RegistrationsService) {
    var vm = this;

    vm.registrations = RegistrationsService.query();
  }
})();
