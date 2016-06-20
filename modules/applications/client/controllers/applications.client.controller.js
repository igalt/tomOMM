(function () {
  'use strict';

  // Applications controller
  angular
    .module('applications')
    .controller('ApplicationsController', ApplicationsController);

  ApplicationsController.$inject = ['$scope', '$state', 'Authentication', 'applicationResolve', '$stateParams',
                                    '$http', 'SendMailService', 'MakeathonsService', 'CommonService'];
  function ApplicationsController ($scope, $state, Authentication, application, $stateParams,
                                   $http, SendMailService, MakeathonsService, CommonService) {
    var vm = this;
    var sendMail = SendMailService.sendMail;
    var logger = CommonService.printToLogger;
    window.onerror = CommonService.windowLogger;
    var allSkillTags;
    String.prototype.toCamelCase = CommonService.camelize;

    vm.authentication = Authentication;
    vm.application = application;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.loadTags = filterTags;
    vm.toggleSelection = toggleSelection;
    vm.makeathon = getMakeathonById();
    vm.goBack = CommonService.goBack;
    //vm.makeathon = MakeathonsUtils.getMakeathon;
    //console.log('MakeathonsUtils.getMakeathon ',MakeathonsUtils.getMakeathon);


    function getMakeathonById() {
      var makeathonId = (vm.application.makeathonId) ? vm.application.makeathonId : $stateParams.makeathonId;
      if (!makeathonId) {
        return { name: 'Tom applications' }; // default makeathon for blank applications
      }else {
        return MakeathonsService.get({ makeathonId: makeathonId });
      }
    }

    // If new application
    if ($state.current.name === 'applications.create'){
      logger('info', 'Application created');
      applicationInit();
    }

    // If edit mode
    if ($state.current.name === 'applications.edit'){
      logger('info', 'Application edit');
      vm.applicationFormEditable = true;
      getAllTags();
    }

    function applicationInit(){
      getAllTags();
      vm.applicationFormEditable = true;
      vm.application.makeathonExperience = 'false';
      // Come As Options
      vm.comeAsOptions = ['Maker', 'Need Knower', 'Other'];
      // selected Options
      vm.application.comeAs = null;
      vm.application.acceptTerms = false;
      vm.application.older18 = false;
      vm.application.makeathonId = ($stateParams.makeathonId) ? $stateParams.makeathonId : null;

    }

    // toggle selection for a given value by name
    function toggleSelection(value) {
      value = value.toCamelCase();
      if (!vm.application.comeAs) vm.application.comeAs = [];
      var idx = vm.application.comeAs.indexOf(value);

      // is currently selected
      if (idx > -1) {
        vm.application.comeAs.splice(idx, 1);
        if (!vm.application.comeAs.length) {
          vm.application.comeAs = null;
        }
      }
      // is newly selected
      else {
        vm.application.comeAs.push(value);
      }
    }

    // Filter skill tags for every input char
    function getAllTags() {
      return $http.get('/api/skillTags', { cache: true })
          .then(function(response) {
            allSkillTags = response.data[0].skills;
          });
    }

    function filterTags($query) {
      return allSkillTags.filter(function (skill) {
        return skill.text.toLowerCase().indexOf($query.toLowerCase()) !== -1;
      });
    }


    // Remove existing Application
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        logger('info', 'Request to delete application ' + vm.application._id);
        vm.application.$remove($state.go('applications.list'));
      }
    }

    // Save Application
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.applicationForm');
        vm.error = 'There are some errors on the form, please review.';
        $('#formError').focus();
        return false;
      }
      delete vm.error;
      //console.log('SAVING: ', vm.application);

      // TODO: move create/update logic to service
      if (vm.application._id) {
        logger('info', 'Request to update application ' + vm.application._id);
        vm.application.$update(successCallback, errorCallback);
      } else {
        logger('info', 'Request to save application ');
        vm.application.$save(successCallback, errorCallback);
      }
    }

    function successCallback(res) {
      logger('info', 'Success respond to application ' + res._id);
      $state.go('applications.thanks', {
        applicationId: res._id
      });

      // Generate Email Content and send it
      sendMailToUser();
      sendMailToCoreTeam();
    }

    function errorCallback(res) {
      logger('error', 'Error respond to application ' + res.message);
      vm.error = res.message;
    }

    function sendMailToUser(){
      // Prepare the mail details
      // you can send a full email template through 'html' property or
      // an email content that generated by the server
      var mailContent = {
        mailTo: Authentication.user.email,
        subject: 'Thank you',
        name: Authentication.user.displayName,
        content: 'Thank you for your application to ' + vm.makeathon.name + ', ' +
            ' the event team will contact you soon.'
      };
      // Send the mail
      sendMail(mailContent);
    }

    function sendMailToCoreTeam(){
      // Send mail to the makeathon Core Team about the new application
      vm.makeathon.userRoles.forEach(function(userRole){
        // Don't email the user twice
        if (userRole.email === Authentication.user.email) return;
        if ((userRole.role === 'Core team')) {
          // Prepare the mail details
          // you can send a full email template through 'html' property or
          // an email content that generated by the server
          var mailContent = {
            mailTo: userRole.email,
            subject: 'A new application has been submitted to ' + vm.makeathon.name,
            content: (Authentication.user.displayName + ' submitted a new application to ' +
            vm.makeathon.name)
          };
          // Send the mail
          sendMail(mailContent);
        }
      });
    }

  }
})();
