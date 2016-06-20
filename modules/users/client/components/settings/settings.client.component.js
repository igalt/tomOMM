(function(){
  'use strict';

  var app = angular.module('users');
  app.component('settingsComponent', {
    bindings: {},
    templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
    controller: settingsComponent
  });

  settingsComponent.$inject = ['$scope', 'Authentication'];

  function settingsComponent($scope, Authentication) {
    $scope.user = Authentication.user;
  }

})();
