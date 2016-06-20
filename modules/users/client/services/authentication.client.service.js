'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user,
      isAdmin: function() {
        if (!$window.user) return false;
        var admin = $window.user.roles.find(function(role){
          return role === 'admin';
        });
        return admin? true:false;
      }
    };

    return auth;

  }
]);
