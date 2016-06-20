(function(){
  'use strict';
  var app = angular.module('applications');

  app.component('applicationsThanksComponent', {
    bindings: {
      application: '=',
      makeathon: '='
    },
    templateUrl: 'modules/applications/client/views/thanks-application.client.view.html',
    controller: applicationsThanksComponent,
    controllerAs: 'vm'
  });

  applicationsThanksComponent.$inject = [];

  function applicationsThanksComponent () {
    var vm = this;

  }
})();
