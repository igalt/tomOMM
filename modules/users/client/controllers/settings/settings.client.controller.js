'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication','SkillTagService',
  function ($scope, Authentication,SkillTagService) {
    var ctrl = this;
    ctrl.onInitialized(SkillTagService.initSkillTags());
    $scope.user = Authentication.user;

  }
]);
