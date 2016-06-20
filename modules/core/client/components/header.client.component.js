(function () {
  'use strict';
  var app = angular.module('core');

  app.component('headerComponent', {
    bindings: {
    },
    templateUrl: 'modules/core/client/views/header.client.view.html',
    controller: headerComponent,
    controllerAs: 'vm'
  });

  headerComponent.$inject = ['$scope', 'Authentication', 'Menus'];

  function headerComponent($scope, Authentication, Menus) {
    var vm = this;

    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = Menus.getMenu('topbar');

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }
  }
}());

