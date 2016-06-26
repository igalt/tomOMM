'use strict';

angular.module('users').controller('ProfileController', ['$scope', 'Authentication', 'userResolve',
  function ($scope, Authentication) {
    $scope.user = Authentication.user;
  }
]);
