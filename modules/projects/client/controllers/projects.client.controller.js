(function () {
  'use strict';

  // Projects controller
  angular
    .module('projects')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['$scope', '$state', 'Authentication', 'projectResolve', '$mdDialog'];

  function ProjectsController ($scope, $state, Authentication, project, $mdDialog) {
    var vm = this;

    vm.authentication = Authentication;
    vm.project = project;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.getVideoLink = getVideoLink;

    function getVideoLink(videoLink) {
      return videoLink;
    }

    // Remove existing Project
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.project.$remove($state.go('projects.list'));
      }
    }

    // Save Project
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.projectForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.project._id) {
        vm.project.$update(successCallback, errorCallback);
      } else {
        vm.project.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('projects.view', {
          projectId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    vm.showUserPreview = function($event, userData) {
      $mdDialog.show({
        controller: DialogController,
        template:
        '<md-dialog aria-label="List dialog">' +
        '  <md-dialog-content>'+
        '<md-content class="md-padding" layout-xs="column" layout="row">' +
        '<div flex-xs flex-gt-xs="400" layout="column">' +
          ' <md-card> ' +
          ' <img ng-src="{{ userData.profileImageURL }}" class="md-card-image" alt="image caption"> ' +
          ' <md-card-content>' +
          '   <h2>{{ userData.displayName }}</h2> ' +
          '   <p>' +
              ' <div style="column"> ' +
              ' 	<div style="row"> ' +
              ' 		<div>First Name:</div> ' +
              ' 		<div><b>{{ userData.firstName }}</b></div> ' +
              ' 	</div> ' +
              ' 	<div style="row"> ' +
              ' 		<div>Last Name:</div> ' +
              ' 		<div><b>{{ userData.lastName }}</b></div> ' +
              ' 	</div> ' +
              ' 	<div style="row"> ' +
              ' 		<div>Email:</div> ' +
              ' 		<div><b>{{ userData.email }}</b></div> ' +
              ' 	</div> ' +
              ' </div> ' +
          '   </p> ' +
          ' </md-card-content> ' +
          ' </md-card> ' +
        '</div>' +
        '</md-content>' +
        '  </md-dialog-content>' +
        '  <md-dialog-actions>' +
        '    <md-button ng-href="/users/{{ userData._id }}" ng-click="closeDialog()" class="md-primary">View Profile</md-button>' +
        '    <md-button ng-click="closeDialog()" class="md-primary">Close</md-button>' +
        '  </md-dialog-actions>' +
        '</md-dialog>',
        targetEvent: $event,
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        locals: {
          userData: userData
        }
      })
      .then(function(answer) {
        console.log('You said the information was "' + answer + '".');
      }, function() {
        console.log('You cancelled the dialog.');
      });

      function DialogController($scope, userData) {
        $scope.userData = userData;
        $scope.closeDialog = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
          $mdDialog.hide(answer);
        };
      }

    };


  }

})();
