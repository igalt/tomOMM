'use strict';

angular.module('market').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('market', {
      title: 'My Challenges',
      state: 'myChallenges',
      type: 'item',
      roles: ['admin', 'user']
    });

    Menus.addMenuItem('market', {
      title: 'My Projects',
      state: 'myProjects',
      type: 'item',
      roles: ['admin', 'user']
    });

    Menus.addMenuItem('market', {
      title: 'Browse Projects',
      state: 'browseProjects',
      type: 'dropdown',
      roles: ['admin', 'user', 'guest']
    });

    Menus.addSubMenuItem('market', 'browseProjects', {
      title: 'By Field',
      state: 'market.projectsByFields',
      roles: ['admin', 'user', 'guest']
    });

    Menus.addSubMenuItem('market', 'browseProjects', {
      title: 'By Skill',
      state: 'market.projectsBySkills',
      roles: ['admin', 'user', 'guest']
    });

    Menus.addMenuItem('market', {
      title: 'About TOM',
      state: 'tomSite',
      type: 'item',
      roles: ['admin', 'user', 'guest']
    });

  }
]);
