(function () {
  'use strict';

  angular
    .module('challenges')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
/*    Menus.addMenuItem('topbar', {
      title: 'Challenges',
      state: 'challenges',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'challenges', {
      title: 'List Challenges',
      state: 'challenges.list',
      roles: ['admin']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'challenges', {
      title: 'Create Challenge',
      state: 'challenges.create',
    });*/
  }
})();
