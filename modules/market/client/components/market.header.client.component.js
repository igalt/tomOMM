(function () {
  'use strict';
  var app = angular.module('core');

  app.component('marketHeaderComponent', {
    bindings: {
    },
    templateUrl: 'modules/market/client/views/market.header.client.view.html',
    controller: marketHeaderComponent,
    controllerAs: 'vm'
  });

  marketHeaderComponent.$inject = ['$scope', 'Authentication', 'Menus'];

  function marketHeaderComponent($scope, Authentication, Menus) {
    var vm = this;

    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = Menus.getMenu('market');

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }
  }
}());

