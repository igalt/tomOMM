(function () {
  'use strict';

  angular
    .module('challenges')
    .controller('ChallengesListController', ChallengesListController);

  ChallengesListController.$inject = ['$state', 'MakeathonsUtils', 'makeathonResolve', 'challengeResolve', 'CommonService'];

  function ChallengesListController($state, MakeathonsUtils, makeathon, challenges, CommonService) {
    var vm = this;

    var jsonToCSV = MakeathonsUtils.jsonToCSV;
    vm.makeathon = makeathon;
    vm.challenges = challenges;
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
