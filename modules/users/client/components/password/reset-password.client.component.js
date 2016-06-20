(function(){
  'use strict';

  var app = angular.module('users');
  app.component('resetPasswordComponent', {
    bindings: {},
    templateUrl: 'modules/users/client/views/password/reset-password.client.view.html',
    controller: resetPasswordComponent
  });

  resetPasswordComponent.$inject = ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator'];

  function resetPasswordComponent($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {

    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();
    $scope.resetUserPassword = resetUserPassword;

    ////If user is signed in then redirect back home
    //if ($scope.authentication.user) {
    //  $location.path('/');
    //}

    // Change user password
    function resetUserPassword(isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    }
  }
})();
