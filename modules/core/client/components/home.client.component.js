(function () {
  'use strict';
  var app = angular.module('core');

  app.component('homeComponent', {
    bindings: {
    },
    templateUrl: 'modules/core/client/views/home.client.view.html',
    controller: homeComponent,
    controllerAs: 'vm'
  });

  homeComponent.$inject = ['Authentication'];

  function homeComponent (Authentication) {
    var vm = this;

    // This provides Authentication context.
    vm.authentication = Authentication;

  }
})();
