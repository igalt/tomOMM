(function() {
  'use strict';

  var app = angular.module('makeathons');

  app.component('sidenavComponent', {
    bindings: {
      makeathon: '=',
      menuitems: '='
    },
    templateUrl: 'modules/makeathons/client/views/sidenav.client.view.html',
    controller: sidenavComponent,
    controllerAs: 'vm'
  });

  sidenavComponent.$inject = ['$scope','$state', 'MakeathonsUtils'];

  function sidenavComponent ($scope, $state, MakeathonsUtils) {

    var vm = this;
    sideMenuInit();

    vm.isAllow = MakeathonsUtils.isAllow(vm.makeathon);
    vm.currentState = getStateData();
    vm.goToState = goToState;
    vm.isStateActive = isStateActive;
    vm.isChecklistCompleted = isChecklistCompleted;
    vm.nodeName = nodeName;


    function sideMenuInit() {
      vm.sideMenu = vm.menuitems[0].sideMenu;
      vm.opts = vm.menuitems[0].sideMenuOpts;

    }

    function nodeName(node){
      return node.params;
    }

    function isChecklistCompleted(node){
      if (node.state === 'manage.checklist' && node.params){
        return vm.makeathon.checklists[node.params].completed;
      }
    }

    function isStateActive(node){
      switch(node.state) {
        case 'manage.checklist':
          return (node.params === $state.params.checklistName);
        case 'manage.wiki':
          return (node.params === $state.params.wikiPage);
        case $state.current.name:
          return true;
        default: return false;
      }
    }

    function getStateData(){
      return vm.sideMenu.filter(function(node){
        return node.state === $state.current.name;
      })[0];
    }

    function goToState($event, node){
      var elm = $event.currentTarget.getElementsByTagName('i')[0];
      var stateParams = {
        makeathonId: $state.params.makeathonId
      };
      switch(node.state) {
        case 'manage.checklist':
          stateParams.checklistName = node.params;
          break;
        case 'manage.wiki':
          stateParams.wikiPage = node.params;
          break;
        default: break;
      }
      if (elm.classList.contains('glyphicon-plus-sign') || elm.classList.contains('glyphicon-minus-sign')){
        $(elm).toggleClass('glyphicon-plus-sign glyphicon-minus-sign');
      }

      document.body.style.cursor='wait';
      $scope.$on('$stateChangeSuccess', function() {
        document.body.style.cursor='default';
      });
      $state.go(node.state, stateParams);


    }


  }
})();
