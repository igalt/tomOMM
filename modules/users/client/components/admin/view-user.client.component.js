(function(){
  'use strict';

  var app = angular.module('users.admin');
  app.component('userViewComponent', {
    bindings: {
      user: '='
    },
    templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
    controller: userViewComponent,
    controllerAs: 'vm'
  });

  userViewComponent.$inject = ['$scope', '$state', 'Authentication'];

  function userViewComponent($scope, $state, Authentication) {
    var vm = this;

    $scope.authentication = Authentication;
    $scope.user = vm.user;
    $scope.remove = remove;
    $scope.update = update;

    // Remove user
    function remove(user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    }

    //Update user
    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    }
  }
})();
