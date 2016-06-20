(function () {
  'use strict';

  var app = angular.module('challenges');

  app.component('challengesListComponent', {
    bindings: {
      challenges: '=',
      makeathon: '='
    },
    templateUrl: 'modules/challenges/client/views/list-challenges.client.view.html',
    controller: challengesListComponent,
    controllerAs: 'vm'
  });
  challengesListComponent.$inject = ['$state', 'MakeathonsUtils', 'CommonService'];

  function challengesListComponent($state, MakeathonsUtils, CommonService) {
    var vm = this;

    var jsonToCSV = MakeathonsUtils.jsonToCSV;
    vm.isAllow = MakeathonsUtils.isAllow(vm.makeathon);
    vm.exportToCsv = exportToCsv;
    vm.goBack = CommonService.goBack;

    if (!vm.isAllow){
      $state.go('forbidden');
    }

    function exportToCsv(){
      var data = angular.copy(vm.challenges);
      //console.log('data ',data);
      data.forEach(function(item){
        item.userName = item.user.displayName;
        item.files = (item.files.length > 0);
        delete item.user;
        delete item.__v;
      });
      data = JSON.stringify(data);

      jsonToCSV(data, 'Challenges', true);
    }
  }
})();
