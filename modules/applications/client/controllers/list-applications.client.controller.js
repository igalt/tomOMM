(function () {
  'use strict';

  angular
    .module('applications')
    .controller('ApplicationsListController', ApplicationsListController);

  ApplicationsListController.$inject = ['$state', 'MakeathonsUtils', 'makeathonResolve', 'applicationResolve', 'CommonService'];

  function ApplicationsListController($state, MakeathonsUtils, makeathon, applications, CommonService) {
    var vm = this;

    var jsonToCSV = MakeathonsUtils.jsonToCSV;
    vm.makeathon = makeathon;
    vm.applications = applications;
    vm.isAllow = MakeathonsUtils.isAllow(vm.makeathon);
    vm.exportToCsv = exportToCsv;
    vm.goBack = CommonService.goBack;

    if (!vm.isAllow){
      $state.go('forbidden');
    }

    function exportToCsv(){
      var data = angular.copy(vm.applications);
      //console.log('data ',data);
      data.forEach(function(item){
        item.userName = item.user.displayName;
        item.skillSet = item.skillSet.map(function(value) { return [value.text]; });
        item.skillSet = [].concat.apply([], item.skillSet);
        delete item.user;
        delete item.__v;
      });
      data = JSON.stringify(data);

      jsonToCSV(data, 'Applications', true);
    }

  }
})();
