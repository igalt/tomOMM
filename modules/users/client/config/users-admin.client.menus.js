'use strict';

// Configuring the Articles module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
    // Add the dropdown create item
    /*Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Blank Application',
      state: 'applications.create'
    });
    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Blank Challenge',
      state: 'challenges.create'
    });*/
  }
]);
