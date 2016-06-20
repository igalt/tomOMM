(function () {
  'use strict';

  angular
      .module('core')
      .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', 'Authentication', 'Menus'];

  function HeaderController($scope, Authentication, Menus) {
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

