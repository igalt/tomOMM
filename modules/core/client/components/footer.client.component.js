(function () {
  'use strict';
  var app = angular.module('core');

  app.component('footerComponent', {
    bindings: {
    },
    templateUrl: 'modules/core/client/views/footer.client.view.html',
    controller: footerComponent,
    controllerAs: 'vm'
  });

  footerComponent.$inject = [];

  function footerComponent () {
    var vm = this;

  }
})();
