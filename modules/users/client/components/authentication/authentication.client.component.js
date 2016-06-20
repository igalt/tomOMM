(function(){
  'use strict';

  var app = angular.module('users');
  app.component('authenticationComponent', {
    bindings: {},
    templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html',
    controller: authenticationComponent
  });

  authenticationComponent.$inject = ['$scope', '$state', '$window'];

  function authenticationComponent($scope, $state, $window) {

    $scope.callOauthProvider = callOauthProvider;

    // OAuth provider request
    function callOauthProvider(url) {
      if ($state.first && $state.first.href) {
        url += '?redirect_to=' + encodeURIComponent($state.first.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }
  }
})();
