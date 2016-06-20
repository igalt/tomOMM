(function() {
  'use strict';

  var app = angular.module('makeathons');

  app.component('checklistComponent', {
    bindings: {
      makeathon: '=',
      checklist: '='
    },
    templateUrl: 'modules/makeathons/client/views/checklist.client.view.html',
    controller: checklistComponent,
    controllerAs: 'vm'
  });

  checklistComponent.$inject = ['$scope', '$state', '$stateParams', 'MakeathonsUtils'];

  function checklistComponent ($scope, $state, $stateParams, MakeathonsUtils) {

    var vm = this;
    var stateName = $state.params.checklistName;
    checklistInit();

    vm.isAllow = MakeathonsUtils.isAllow;
    vm.checkAll = checkAll;
    vm.uncheckAll = uncheckAll;

    function checklistInit(){
      vm.checklist.completed = vm.makeathon.checklists[stateName].completed;
      vm.checklist.model = vm.makeathon.checklists[stateName].model ? vm.makeathon.checklists[stateName].model:{ labels: [] };

      $scope.$watch(function () {
        return vm.checklist.model;
      }, updateMakeathonModel, true);
    }

    function updateMakeathonModel(){
      updateClassCompleted();
      vm.makeathon.checklists[stateName].model = vm.checklist.model;
      //console.log('UPDATE vm.makeathon ',vm.makeathon);
      vm.makeathon.$update(successCallback, errorCallback);
    }

    function updateClassCompleted(){
      vm.checklist.completed = (vm.checklist.model.labels.length === vm.checklist.labels.length);
      vm.makeathon.checklists[stateName].completed = vm.checklist.completed;
      //var iconElm = document.getElementsByName(stateName)[0];
      var iconElm = document.querySelector('i[name="'+stateName+'"]');
      if (!iconElm) return;
      if (vm.checklist.completed){
        iconElm.classList.add('glyphicon-ok-sign');
      } else {
        iconElm.classList.remove('glyphicon-ok-sign');
      }
    }

    function checkAll() {
      vm.checklist.model.labels = vm.checklist.labels.map(function(item) { return item.text; });
    }

    function uncheckAll() {
      vm.checklist.model.labels = [];
    }

    function successCallback(res) {
      //logger('info', 'Success respond to makeathon ' + res._id);
      console.log(vm.checklist.header,' updated');
    }

    function errorCallback(res) {
      //logger('error', 'Error respond to makeathon ' + res.message);
      var error = res.message;
      console.log(vm.checklist.header, ' update error ',error);
    }

  }
})();
