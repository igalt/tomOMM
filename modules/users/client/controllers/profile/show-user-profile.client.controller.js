'use strict';

angular.module('users').controller('showUserProfileComponent', ['$scope', '$timeout', '$window', 'userResolve','Authentication', 'FileUploader',
  function ($scope, $timeout, $window, userId, Authentication, FileUploader) {
    $scope.user = userId || Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;


  }
]);
