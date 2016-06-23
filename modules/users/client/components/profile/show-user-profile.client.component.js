(function(){
  'use strict';

  var app = angular.module('users');
  app.component('showUserProfileComponent', {
    bindings: {},
    templateUrl: 'modules/users/client/views/profile/show-profile.client.view.html',
    controller: showUserProfileComponent
  });

  showUserProfileComponent.$inject = ['$scope', '$timeout', '$http', '$window', 'Authentication', 'FileUploader'];

  function showUserProfileComponent($scope, $timeout, $http, $window, Authentication, FileUploader) {

    console.log("in show user profile");

    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    var project = $http.get('/api/projects/576a448490a324c43c703db4', { cache: true });

    //console.log("project: "+project.data[0].title);

  }

})();
