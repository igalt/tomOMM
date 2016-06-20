(function () {
  'use strict';

  var app = angular.module('makeathons');

  app.component('makeathonsViewComponent', {
    bindings: {
      makeathon: '='
    },
    templateUrl: 'modules/makeathons/client/views/view-makeathons.client.view.html',
    controller: makeathonsViewComponent,
    controllerAs: 'vm'
  });

  makeathonsViewComponent.$inject = ['$state', 'Authentication', 'MakeathonsUtils', 'CommonService', '$window'];

  function makeathonsViewComponent ($state, Authentication, MakeathonsUtils, CommonService, $window) {

    var vm = this;

    var logger = CommonService.printToLogger;
    window.onerror = CommonService.windowLogger;

    vm.$windowLocation = $window.location.origin;
    vm.authentication = Authentication;
    vm.manageMode = manageMode();
    vm.success = vm.error = null;
    vm.form = null;
    vm.remove = null;
    vm.save = null;
    vm.dateSelect = null;
    vm.removeUser = null;
    vm.addNewUser = null;
    vm.uploader = null;
    vm.uploaderQueue = null;
    vm.editorConfig = null;
    vm.copyClipboardSuccess = copyClipboardSuccess;
    vm.copyClipboardError = copyClipboardError;


    function manageMode(){
      return ($state.current.name.split('.')[0] === 'manage');
    }

    // If view mode
    if ($state.current.name === 'manage.makeathonView' ||
        $state.current.name === 'makeathons.view'){
      vm.makeathonFormEditable = false;
      vm.userRoles = vm.makeathon.userRoles;
      MakeathonsUtils.datesDisplayFormat(vm.makeathon);
    }

    function copyClipboardSuccess(e) {
      console.info('Action:', e.action);
      console.info('Text:', e.text);
      console.info('Trigger:', e.trigger);

      e.clearSelection();
    }

    function copyClipboardError(e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    }

  }
})();
