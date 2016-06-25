(function(){
  'use strict';

  var app = angular.module('users');
  app.component('editProfileComponent', {
    bindings:{
      //completeProfile: '='
    },
    templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html',
    controller: editProfileComponent,
    controllerAs: 'vm'
  });

  editProfileComponent.$inject = ['$scope', '$state', '$http', 'Users', 'Authentication', 'toaster'];

  function editProfileComponent($scope, $state, $http, Users, Authentication, toaster) {

    $scope.user = Authentication.user;
    //$scope.completeProfile = isProfileComplete();
    $scope.isStateEditProfile = false;
    var allSkillTags;

    this.loadTags = getAllTags(filterTags);

    //if ($scope.completeProfile){
    //  $('#editUserProfile').hide();
    //}

    //console.log('$scope.user ',$scope.user);
    //console.log('$scope.completeProfile ',$scope.completeProfile);

    if ($state.current.name === 'settings.profile'){
      $scope.isStateEditProfile = true;
    }

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');
        return false;
      }
      console.log('Saving User Profile');
      var user = new Users($scope.user);

      user.$update(successCallback, errorCallback);

      function successCallback(response) {
        //toaster.pop('success', 'Profile Saved Successfully', null);
        toaster.pop({
          type: 'success',
          title: 'Profile Saved Successfully',
          body: null,
          timeout: 3000,
          showCloseButton: true
        });
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }
      function errorCallback(response) {
        toaster.pop({
          type: 'error',
          title: response.data.message,
          body: null,
          timeout: 3000,
          showCloseButton: true
        });
        //toaster.pop('error', null, response.data.message);
        //$scope.error = response.data.message;
      }
    };

    function isProfileComplete (){
      for(var prop in $scope.user) {
        if($scope.user.hasOwnProperty(prop)) {
          if(!$scope.user[prop] && prop !== '__v') {
            return false;
          }
        }
      }
      return true;
    }

    function getAllTags(callback) {
      $http.get('/api/skillTags', { cache: true })
          .then(function(response) {
            allSkillTags = response.data[0].skills;
          });
      callback();
    }

    function filterTags($query) {
      return allSkillTags.filter(function (skill) {
        return skill.text.toLowerCase().indexOf($query.toLowerCase()) !== -1;
      });
    }
  }
})();
