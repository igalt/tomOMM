(function () {
  'use strict';

  var app = angular.module('makeathons');

  app.component('makeathonsCreateComponent', {
    bindings: {
      makeathon: '=',
      menuitems: '='
    },
    templateUrl: 'modules/makeathons/client/views/create-makeathons.client.view.html',
    controller: makeathonsCreateComponent,
    controllerAs: 'vm'
  });

  makeathonsCreateComponent.$inject = ['$scope', '$state', '$filter', 'Authentication',
                                  'MakeathonsUtils', 'FileUploader', 'SendMailService', 'CommonService', '$window'];

  function makeathonsCreateComponent ($scope, $state, $filter, Authentication,
                                 MakeathonsUtils, FileUploader, SendMailService, CommonService, $window) {
    var vm = this;

    var sendMail = SendMailService.sendMail;
    var logger = CommonService.printToLogger;
    window.onerror = CommonService.windowLogger;

    vm.$windowLocation = $window.location.origin;
    vm.authentication = Authentication;
    vm.isAllow = MakeathonsUtils.isAllow(vm.makeathon);
    vm.success = vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.dateSelect = dateSelect();
    vm.removeUser = removeUser;
    vm.addNewUser = addNewUser;
    vm.copyClipboardSuccess = copyClipboardSuccess;
    vm.copyClipboardError = copyClipboardError;
    vm.uploader = uploaderConfig();
    vm.uploaderQueue = vm.uploader.queue;
    vm.editorConfig = editorConfig();


    // Check if new makeathon
    if ($state.current.name === 'makeathons.create'){
      logger('info', 'Makeathon created');
      makeathonInit();
    }

    function makeathonInit(){
      addChecklistsModel();
      vm.makeathonFormEditable = true;
      vm.makeathon.name = 'TOM:XXX';
      vm.makeathon.status = 'pending';
      vm.userRoles = [{ email: vm.authentication.user.email , role: 'Core team' }];
      vm.preTomPopMsg = 'Please select a event Date';
      vm.uploader.url = 'api/makeathons';
      vm.uploader.method = 'POST';
    }

    // Configuration for file uploader
    function uploaderConfig(){
      return new FileUploader({
        formData: [],
        onBeforeUploadItem: onBeforeUploadItem,
        onSuccessItem: onSuccessItem,
        onErrorItem: onErrorItem
      });
    }

    // Configuration for rich text editor
    function editorConfig(){
      return {
        sanitize: false,
        toolbar: [
          { name: 'basicStyling', items: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', '-', 'leftAlign', 'centerAlign', 'rightAlign', 'blockJustify', '-'] },
          { name: 'paragraph', items: ['orderedList', 'unorderedList', 'outdent', 'indent', '-'] },
          { name: 'doers', items: ['removeFormatting', 'undo', 'redo', '-'] },
          { name: 'colors', items: ['fontColor', 'backgroundColor', '-'] },
          { name: 'links', items: ['image', 'hr', 'symbols', 'link', 'unlink', '-'] },
          { name: 'tools', items: ['print', '-'] },
          { name: 'styling', items: ['font', 'size', 'format'] }
        ]
      };
    }

    // Input date selector  TODO: Move to component or service
    function dateSelect() {
      $('.datepicker').datepicker({
        showOn: 'both',
        buttonText: 'Show Date',
        buttonImageOnly: false,
        dateFormat: 'mm/dd/yy',
        onSelect: updateModel
      });

      // Add buttons and style to the date inputs
      var $datepickerBtn = $('.input-datepicker button');
      $datepickerBtn.html('<i class="glyphicon glyphicon-calendar"></i>');
      $datepickerBtn.addClass('btn btn-default');

      function updateModel (dateText, $element) {
        var showValidationMessage = false;
        dateText = new Date(dateText);
        var $elm = $element.input;
        dateText = dateText.toString().slice(0, 15);
        var strModel = $elm.attr('ng-model');
        strModel = strModel.split('.');
        strModel = strModel.pop();
        var err = dateValid(strModel, dateText);
        var $elmErr = $elm.parent().siblings().find('p');
        var ngEl = angular.element($elm.parent().parent());
        if (err){
          showValidationMessage = true;
          console.log('err ',err);
          $elmErr.text(err);
          ngEl.toggleClass('has-error', showValidationMessage);
          // Replace input value
          $elm.val(dateText);
        } else {
          //Input model update
          vm.makeathon[strModel] = dateText;
          $scope.$apply();
        }
      }
    }

    function dateValid(strModel, date){
      var now = new Date();
      var err = null;
      var selectedDate = new Date(date);

      // Reset model value
      vm.makeathon[strModel] = '';

      //// Date pass validation
      //if (selectedDate < now){
      //  err = 'Can\'t set makeathon date to a passed date';
      //}
      //if (strModel === 'startDate' && selectedDate > now) {
      if (strModel === 'startDate') {
        vm.makeathon.endDate = calcDate(date, 3);
        vm.makeathon.preTomDate = calcDate(date, -30);
        vm.makeathon.regDeadline = calcDate(date, -51);
        vm.preTomPopMsg = 'Suggested preTom date: ' + vm.makeathon.preTomDate;
        vm.regDeadlinePopMsg = 'Suggested registration Deadline date: ' + vm.makeathon.regDeadline;
      }
      if (strModel === 'endDate'){
        if (selectedDate < new Date (vm.makeathon.startDate)){
          err = 'Makeathon end date can\'t be before makeathon start date';
        }
      }
      if (strModel === 'preTomDate'){
        if (!vm.makeathon.startDate) {
          err = 'Please select a event start date';

        } else if (selectedDate > new Date(vm.makeathon.startDate)){
          err = 'Pre-Tom date can\'t be after event start date';

        }
      }
      if (strModel === 'regDeadline') {
        if (!vm.makeathon.preTomDate) {
          err = 'Please select a PreTom Date';
        } else if (selectedDate > new Date(vm.makeathon.startDate) ||
                selectedDate > new Date(vm.makeathon.preTomDate)){
          err = 'Invalid date. Registration date can\'t be after event date or preTom date';
        }
      }
      return err;
    }

    function calcDate(date, days){
      var resDate = new Date(date);
      resDate = resDate.setDate(resDate.getDate() + days);
      return $filter('date')(new Date(resDate), 'EEE MMM dd yyyy');
    }

    // Remove existing Makeathon
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        logger('info', 'Request to delete makeathon ' + vm.makeathon._id);
        vm.makeathon.$remove($state.go('makeathons.list'));
      }
    }

    // Add checklists models & completed flags to makeathon
    function addChecklistsModel(){
      vm.makeathon.checklists = {};

      [].forEach.call(vm.menuitems[0].sideMenu, function(item){
        var stage = item.label.toLowerCase();
        stage = stage.replace(/ /g,'');
        vm.makeathon.checklists[stage] = {
          completed: false,
          model: { labels: [] }
        };
      });
    }

    function prepareToSave(){
      vm.success = vm.error = null;
      vm.makeathon.userRoles = JSON.stringify(vm.userRoles);
      vm.makeathon.checklists = JSON.stringify(vm.makeathon.checklists);
      console.log('Creating ', vm.makeathon);
    }

    // Save Makeathon
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.makeathonForm');
        return false;
      }

      prepareToSave();

      if (vm.uploader.queue.length){
        // Save/update files with form data
        console.log('Saving with Upload ', vm.uploader);
        logger('info', 'Request to save/update makeathon with files');
        vm.uploader.uploadAll();
      } else if (vm.makeathon._id) {
        logger('info', 'Request to update makeathon ' + vm.makeathon._id);
        vm.makeathon.$update(successCallback, errorCallback);
      } else {
        logger('info', 'Request to save makeathon ');
        vm.makeathon.$save(successCallback, errorCallback);
      }
    }

    function addNewUser() {
      //var userNum = vm.makeathon.userRoles.length + 1;
      vm.userRoles.push({ 'email':'', 'role': 'Core team' });
    }

    function removeUser(index) {
      vm.userRoles.splice(index,1);
    }

    function successCallback(res) {
      logger('info', 'Success respond to makeathon ' + res._id);
      $state.go('makeathons.thanks', {
        makeathonId: res._id
      });
      vm.makeathon = res;

      // Generate Email Content and send it
      //sendMailToUser();
      sendMailToTeam();
    }

    function errorCallback(res) {
      logger('error', 'Error respond to makeathon ' + res.message);
      vm.error = res.message;
    }

    // UPLOADER FILTERS

    // Upload only images
    vm.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

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
      fileItem_0.formData.push(vm.makeathon);
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
        content: 'Thank you for creating the Makeathon:  ' + vm.makeathon.name
      };
      // Send the mail
      sendMail(mailContent);
    }

    function sendMailToTeam(){
      var mailContent = {};
      // Send mail to the makeathon Core Team about the new application
      vm.makeathon.userRoles.forEach(function(userRole){
        // Don't email the user twice
        if (userRole.email === Authentication.user.email) return;
          // Prepare the mail details
          // you can send a full email template through 'html' property or
          // an email content that generated by the server
        mailContent = {
          mailTo: userRole.email,
          subject: vm.makeathon.name.toUpperCase() + ' Invitation' ,
          content: 'You are invited by ' + Authentication.user.displayName +
            ' as a ' + userRole.role + ' to ' + vm.makeathon.name.toUpperCase() +
            '  mms.tomglobal.org/makeathons/' + vm.makeathon._id

        };
        // Send the mail
        sendMail(mailContent);
      });
    }

    // Load html template into a variable
    function loadMailTemplate(){
      $.get('modules/core/client/templates/send-email.client.view.html', function(template) {
        console.log(template);
      }, 'html');  // or 'text', 'xml', 'more'
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
