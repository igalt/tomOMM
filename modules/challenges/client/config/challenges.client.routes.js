(function () {
  'use strict';

  var app = angular.module('challenges');
  app.config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('challenges', {
        abstract: true,
        url: '/challenges',
        template: '<ui-view  class="challenges-section"/>'
      })
        .state('challenges.create', {
          url: '/:makeathonId/create',
          component: 'challengesCreateComponent',
          resolve: {
            challenge: newChallenge,
            makeathon: getMakeathon
          },
          data: {
            roles: ['user', 'admin'],
            pageTitle : 'Challenges Create'
          }
        })
      .state('challenges.list', {
        url: '/:makeathonId/list',
        component: 'challengesListComponent',
        resolve: {
          challenges: getChallengesByMakeathonId,
          makeathon: getMakeathon
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Challenges List'
        }
      })
      .state('challenges.edit', {
        url: '/:makeathonId/:challengeId/edit',
        component: 'challengesEditComponent',
        resolve: {
          challenge: getChallenge,
          makeathon: getMakeathon
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Challenge {{ challengeResolve.name }}'
        }
      })
      .state('challenges.view', {
        url: '/:makeathonId/:challengeId/view',
        component: 'challengesEditComponent',
        resolve: {
          challenge: getChallenge,
          makeathon: getMakeathon
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Challenge {{ articleResolve.name }}'
        }
      })
      .state('challenges.thanks', {
        url: '/:makeathonId/:challengeId/thanks',
        component: 'challengesThanksComponent',
        resolve: {
          challenge: getChallenge,
          makeathon: getMakeathon
        },
        data:{
          roles: ['user', 'admin'],
          pageTitle: 'Thanks You'
        }
      });
  }

  getChallenge.$inject = ['$stateParams', 'ChallengesService'];

  function getChallenge($stateParams, ChallengesService) {
    return ChallengesService.get({
      challengeId: $stateParams.challengeId
    }).$promise;
  }

  newChallenge.$inject = ['ChallengesService'];

  function newChallenge(ChallengesService) {
    return new ChallengesService();
  }

  getMakeathon.$inject = ['$stateParams', 'MakeathonsService'];

  function getMakeathon($stateParams, MakeathonsService) {
    if (!$stateParams.makeathonId) {
      // default makeathon for blank applications that not belong to any
      return { name: 'TOM Challenges' };
    }
    return MakeathonsService.get({
      makeathonId: $stateParams.makeathonId
    }).$promise;
  }


  getChallengesByMakeathonId.$inject = ['$stateParams', 'ChallengesService'];

  function getChallengesByMakeathonId($stateParams, ChallengesService){

    var filter = '';
    if ($stateParams.makeathonId) {
      filter = { makeathonId: $stateParams.makeathonId };
    }
    return ChallengesService.query(filter);
  }
})();
