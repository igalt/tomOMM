(function () {
  'use strict';

  var app = angular.module('makeathons');
  app.config(routeConfig);

  //uiViewScrollTop.$inject = ['$uiViewScrollProvider'];

  //function uiViewScrollTop($uiViewScrollProvider) {
  //  $uiViewScrollProvider.useAnchorScroll();
  //}

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
        .state('manage', {
          abstract: true,
          url: '/manage/:makeathonId',
          component: 'sidenavComponent',
          resolve: {
            makeathon: getMakeathon,
            menuitems: getSideMenu
          },
          data:{
            roles: ['user', 'admin'],
            pageTitle: 'Makeathon {{ makeathonResolve.name }}'
          }
        })
        .state('manage.makeathonView', {
          url: '/',
          component: 'makeathonsViewComponent',
          resolve: {
            makeathon: getMakeathon
          },
          data:{
            roles: ['user', 'admin'],
            pageTitle: 'Makeathon {{ makeathon.name }}'
          }
        })
        .state('manage.makeathonEdit', {
          url: '/edit',
          component: 'makeathonsEditComponent',
          resolve: {
            makeathon: getMakeathon
          },
          data: {
            roles: ['user', 'admin'],
            pageTitle: 'Edit Makeathon {{ makeathon.name }}'
          }
        })
        .state('manage.makeathonThanks', {
          url: '/thanks',
          templateUrl: 'modules/makeathons/client/views/thanks-makeathon.client.view.html',
          controller: 'MakeathonsController',
          controllerAs: 'vm',
          resolve: {
            makeathon: getMakeathon
          },
          data:{
            roles: ['user', 'admin'],
            pageTitle: 'Thanks You'
          }
        })
        .state('manage.checklist', {
          url: '/checklist/:checklistName',
          component: 'checklistComponent',
          resolve: {
            makeathon: getMakeathon,
            checklist: getChecklist
          },
          data:{
            roles: ['user', 'admin'],
            pageTitle: 'Checklist'
          }
        })
        .state('manage.wiki', {
          url: '/wiki/:wikiPage',
          component: 'wikiComponent',
          resolve: {
            makeathon: getMakeathon,
            wiki: getWiki
          },
          data:{
            roles: ['user', 'admin'],
            pageTitle: 'Wiki'
          }
        })
        .state('manage.book', {
          url: '/download-book',
          templateUrl: 'modules/makeathons/client/views/download-book.client.view.html',
          data:{
            roles: ['user', 'admin'],
            pageTitle: 'Download Book'
          }
        })
        .state('manage.contact', {
          url: '/contact',
          templateUrl: 'modules/makeathons/client/views/contact.client.view.html',
          resolve: {
          },
          data:{
            roles: ['user', 'admin'],
            pageTitle: 'Contact'
          }
        });
  }

  getMakeathon.$inject = ['$stateParams', 'MakeathonsService'];

  function getMakeathon($stateParams, MakeathonsService) {
    return MakeathonsService.get({
      makeathonId: $stateParams.makeathonId
    }).$promise;
  }

  getSideMenu.$inject = ['$http', '$resource'];

  function getSideMenu($http, $resource) {
    var Menu = $resource('/api/sideMenu', { menuId:'@id' });
    return Menu.query().$promise;
  }

  getChecklist.$inject = ['$http', '$stateParams', '$resource'];

  function getChecklist($http, $stateParams, $resource) {
    // TODO: check way doesn't work with $resource and replace it
    //var Checklist = $resource('/api/checklists', {checklist:'state'});
    //return Checklist.get({
    //  checklist: $stateParams.checklist
    //}).$promise;

    return $http.post('/api/checklists', { state: $stateParams.checklistName }).then(function(checklist){
      return checklist.data[0];
    });
  }

  getWiki.$inject = ['$http', '$stateParams'];

  function getWiki($http, $stateParams) {
    if ($stateParams.wikiPage === 'quick-introduction') return null;

    //// TODO: Check way its not working from a local path
    //console.log('book/_book/'+$stateParams.wikiPage);
    //return $.get('book/_book/'+$stateParams.wikiPage, function(template) {
    //  console.log('template ',template);
    //  return template;
    //}, 'html');  // or 'text', 'xml', 'more'

    // Get wiki pages from Gitbook - https://www.gitbook.com/book/bookoftom/the-little-book-of-tom/details
    return $http.post('/api/wiki', { fileName: $stateParams.wikiPage }).then(function(page){
      return page.data;
    });
  }

})();
