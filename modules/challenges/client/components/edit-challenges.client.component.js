(function () {
  'use strict';

  var app = angular.module('challenges');

  app.component('challengesEditComponent', {
    bindings: {
      challenge: '=',
      makeathon: '='
    },
    templateUrl: 'modules/challenges/client/views/form-challenge.client.view.html',
    controller: challengesEditComponent,
    controllerAs: 'vm'
  });

  challengesEditComponent.$inject = ['$scope', '$state', 'Authentication',
                                  'FileUploader', 'SendMailService', 'CommonService'];

  function challengesEditComponent ($scope, $state, Authentication,
                                 FileUploader, SendMailService, CommonService) {
    var vm = this;

    var sendMail = SendMailService.sendMail;
    var logger = CommonService.printToLogger;
    window.onerror = CommonService.windowLogger;

    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.uploader = new FileUploader({
      formData: [],
      onBeforeUploadItem: onBeforeUploadItem,
      onSuccessItem: onSuccessItem,
      onErrorItem: onErrorItem
    });
    vm.uploaderQueue = vm.uploader.queue;
    vm.goBack = CommonService.goBack;

    challengeEditInit();

    // Edit mode
    function challengeEditInit(){
      if ($state.current.name === 'challenges.edit'){
        logger('info', 'Challenge edit');
        vm.challengeFormEditable = true;
        vm.uploader.url = 'api/challenges/' + vm.challenge._id;
        vm.uploader.method = 'PUT';
      } else {
        // View mode
        vm.challengeFormEditable = false;
      }
    }

    // Remove existing Challenge
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        logger('info', 'Request to delete challenge ' + vm.challenge._id);
        vm.challenge.$remove($state.go('challenges.list'));
      }
    }

    //Save Challenge
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.challengeForm');
        return false;
      }

      console.log('Saving challenge: ', vm.challenge);

      // TODO: move create/update logic to service
      if (vm.uploader.queue.length){
        // Save/update files with form data
        console.log('Saving with Upload ', vm.uploader);
        logger('info', 'Request to save/update challenge with files');
        vm.uploader.uploadAll();
      } else if (vm.challenge._id) {
        logger('info', 'Request to update challenge ' + vm.challenge._id);
        vm.challenge.$update(successCallback, errorCallback);
      } else {
        logger('info', 'Request to save challenge ');
        vm.challenge.$save(successCallback, errorCallback);
      }
    }

    function successCallback(res) {
      logger('info', 'Success respond to challenge ' + res._id);
      $state.go('challenges.thanks', {
        makeathonId: res.makeathonId,
        challengeId: res._id
      });

      // Generate Email Content and send it
      sendMailToUser();
      sendMailToCoreTeam();
    }

    function errorCallback(res) {
      logger('error', 'Error respond to challenge ' + res.message);
      vm.error = res.message;
    }

    // UPLOADER FILTERS

    //vm.uploader.filters.push({
    //  name: 'imageFilter',
    //  fn: function (item, options) {
    //    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
    //    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    //  }
    //});


    // UPLOADER CALLBACKS

    // Shrink all files and formData to one request before upload
    function onBeforeUploadItem(fileItem) {
      vm.uploaderQueue = [];
      vm.uploader.queue.forEach(function(fileItem){
        vm.uploaderQueue.push({ file:fileItem.file });
      });
      var fileItem_0 = vm.uploader.queue[0];
      var tFileItem;
      var pop_times = vm.uploader.queue.length;
      for (var i = 1; i < pop_times; i++){
        tFileItem = vm.uploader.queue.pop();
        fileItem_0.formData.push({ file: tFileItem._file });
      }
      fileItem_0.formData.push(vm.challenge);
    }

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(fileItem, response, status, headers) {
      successCallback(response);
    }

    // Called after the user has failed to uploaded a new picture
    function onErrorItem(fileItem, response, status, headers) {
      errorCallback(response);
    }

    function sendMailToUser(){
      // Prepare the mail details
      // you can send a full email template through 'html' property or
      // an email content that generated by the server
      var mailContent = {
        mailTo: Authentication.user.email,
        subject: 'Thank you',
        name: Authentication.user.displayName,
        content: 'Thank you for offering a challenge to ' + vm.makeathon.name +', ' +
        '  the event team will contact you soon. '

      };
      // Send the mail
      sendMail(mailContent);
    }


    function sendMailToCoreTeam(){
      // Send mail to the makeathon Core Team about the new application
      vm.makeathon.userRoles.forEach(function(userRole){
        // Don't email the user twice
        if (userRole.email === Authentication.user.email) return;
        if (userRole.role === 'Core team') {
          // Prepare the mail details
          // you can send a full email template through 'html' property or
          // an email content that generated by the server
          var mailContent = {
            mailTo: userRole.email,
            subject: 'New challenge has been submitted to ' + vm.makeathon.name,
            content: (Authentication.user.displayName + ' submitted a new challenge to ' +
            vm.makeathon.name)
          };
          // Send the mail
          sendMail(mailContent);
        }
      });
    }
  }
})();
