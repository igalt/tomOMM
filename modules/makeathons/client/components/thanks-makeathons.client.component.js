(function() {
  'use strict';

  var app = angular.module('makeathons');

  app.component('makeathonsThanksComponent', {
    bindings: {
      makeathon: '='
    },
    templateUrl: 'modules/makeathons/client/views/thanks-makeathons.client.view.html',
    controller: makeathonsThanksComponent,
    controllerAs: 'vm'
  });

  makeathonsThanksComponent.$inject = ['$state', 'Authentication', 'MakeathonsUtils'];

  function makeathonsThanksComponent ($state, Authentication, MakeathonsUtils) {
    var vm = this;

    vm.authentication = Authentication;
    vm.isAllow = MakeathonsUtils.isAllow;
    vm.htmlHeader = 'was created successfully';


    if ($state.previous.state.name === 'manage.makeathonEdit'){
      vm.htmlHeader = 'was update successfully';
    }

  }
})();
