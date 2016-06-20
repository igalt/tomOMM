(function(){
  'use strict';

  var app = angular.module('users');
  app.component('forgotPasswordComponent', {
    bindings: {},
    templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html',
    controller: forgotPasswordComponent
  });

  forgotPasswordComponent.$inject = ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator'];

  function forgotPasswordComponent($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {

    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();
    $scope.askForPasswordReset = askForPasswordReset;

    ////If user is signed in then redirect back home
    //if ($scope.authentication.user) {
    //  $location.path('/');
    //}

    // Submit forgotten password account id
    function askForPasswordReset(isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');
        return false;
      }
      $http.post('/api/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    }
  }
})();
