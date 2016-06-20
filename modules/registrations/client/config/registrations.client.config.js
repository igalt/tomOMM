(function () {
  'use strict';

  angular
    .module('registrations')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
/*    Menus.addMenuItem('topbar', {
      title: 'Registrations',
      state: 'registrations',
      type: 'dropdown',
      roles: ['admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'registrations', {
      title: 'List Registrations',
      state: 'registrations.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'registrations', {
      title: 'Create Registration',
      state: 'registrations.create',
      roles: ['admin']
    });*/
  }
})();
