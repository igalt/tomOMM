(function(){
  'use strict';

  var app = angular.module('users');
  app.component('socialAccountsComponent', {
    bindings: {},
    templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html',
    controller: socialAccountsComponent
  });

  socialAccountsComponent.$inject = ['$scope', '$http', 'Authentication'];

  function socialAccountsComponent ($scope, $http, Authentication) {
    $scope.user = Authentication.user;
    $scope.hasConnectedAdditionalSocialAccounts = hasConnectedAdditionalSocialAccounts;
    $scope.isConnectedSocialAccount = isConnectedSocialAccount;
    $scope.removeUserSocialAccount = removeUserSocialAccount;

    // Check if there are additional accounts
    function hasConnectedAdditionalSocialAccounts(provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    }

    // Check if provider is already in use with current user
    function isConnectedSocialAccount(provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    }

    // Remove a user social account
    function removeUserSocialAccount(provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    }
  }
})();
