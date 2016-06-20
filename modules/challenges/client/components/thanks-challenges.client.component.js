(function () {
  'use strict';

  var app = angular.module('challenges');

  app.component('challengesThanksComponent', {
    bindings: {
      challenge: '=',
      makeathon: '='
    },
    templateUrl: 'modules/challenges/client/views/thanks-challenge.client.view.html',
    controller: challengesThanksComponent,
    controllerAs: 'vm'
  });

  challengesThanksComponent.$inject = [];

  function challengesThanksComponent () {
    var vm = this;

  }
})();
