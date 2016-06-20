(function(){
  'use strict';

  var app = angular.module('users');
  app.component('signinComponent', {
    bindings: {},
    templateUrl: 'modules/users/client/views/authentication/signin.client.view.html',
    controller: signinComponent
  });

  signinComponent.$inject = ['$scope', '$state', '$http', '$location', '$window',
      'Authentication', 'PasswordValidator', 'SendMailService', 'CommonService'];

  function signinComponent($scope, $state, $http, $location, $window,
                                    Authentication, PasswordValidator, SendMailService, CommonService) {

    var sendMail = SendMailService.sendMail;
    var logger = CommonService.printToLogger;
    $scope.authentication = Authentication;
    $scope.signin = signin;

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    //IGAL: using the $root because we are trying to affect the parent view (authentication.client.view.html)
    $scope.$root.pageName = 'Sign in';
    if ($location.path().indexOf('signup') > -1){
      $scope.$root.pageName = 'Sign up';
     /* if ($state.first.state.name.indexOf('applications') || $state.first.state.name.indexOf('applications'))
      {
        $scope.explainText = true;
      }*/
    }

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }


    function signin(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }
      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        $window.user = response;

        // Do not redirect to the signin page
        if ($state.first.state.name !== 'signin?err') {
          $state.go($state.first.state.name, $state.first.params);
        } else {
          // And redirect to the previous state or home page
          $state.go($state.previous.state.name || 'home', $state.previous.params);
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    }

  }
})();
