(function(){
  'use strict';

  var app = angular.module('users');
  app.component('userProfileComponent', {
    bindings: {},
    templateUrl: 'modules/users/client/views/profile/profile.client.view.html',
    controller: userProfileComponent
  });

  userProfileComponent.$inject = ['$scope', 'Authentication'];

  function userProfileComponent($scope, Authentication) {
    console.log("here");
    $scope.user = Authentication.user;

    console.log("user: "+$scope.user);
  }

})();
