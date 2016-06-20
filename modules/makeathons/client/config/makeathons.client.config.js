(function () {
  'use strict';

  angular
    .module('makeathons')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Makeathons',
      state: 'makeathons',
      type: 'dropdown',
      roles: ['user', 'admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'makeathons', {
      title: 'Upcoming Makeathons',
      state: 'makeathons.list',
      roles: ['admin', 'user']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'makeathons', {
      title: 'Create a Makeathon',
      state: 'makeathons.create',
      roles: ['admin']
    });
  }
})();
