(function() {
  'use strict';

  var app = angular.module('makeathons');

  app.component('makeathonsListComponent', {
    bindings: {
    },
    templateUrl: 'modules/makeathons/client/views/list-makeathons.client.view.html',
    controller: makeathonsListComponent,
    controllerAs: 'vm'
  });

  makeathonsListComponent.$inject = ['$state', 'MakeathonsService', 'Authentication', 'MakeathonsUtils'];

  function makeathonsListComponent ($state, MakeathonsService, Authentication, MakeathonsUtils) {
    var vm = this;
    //console.log('makeathonsListComponent ');

    vm.goToState = goToState;
    vm.authentication = Authentication;
    vm.isAllow = MakeathonsUtils.isAllow;
    vm.tableHeaders = ['Event', 'Location', 'Event Date', 'Registration Closes', 'Actions'];
    init();

    function init() {
      if (vm.authentication.user) {
        MakeathonsService.query().$promise.then(function (result) {
          vm.makeathons = result;
          vm.makeathons.forEach(function (makeathon) {
            MakeathonsUtils.datesDisplayFormat(makeathon);
          });
        });

      }
    }

    function goToState(makeathon){
      if (vm.isAllow(makeathon)){
        $state.go('manage.makeathonView', {
          makeathonId: makeathon._id
        });
      } else {
        $state.go('makeathons.view', {
          makeathonId: makeathon._id
        });
      }
    }
  }
})();
