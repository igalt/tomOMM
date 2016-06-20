(function () {
  'use strict';

  //Send Mail service
  var app = angular.module('core');

  app.service('SendMailService', SendMailService);

  SendMailService.$inject = ['$http'];

  function SendMailService($http) {
    var logger = printToLogger;

    function printToLogger(level, msg)
    {
      $http.post('/api/logger', { level: level, msg : msg });
    }
    function successMail(response) {
      //console.log('send-mail success ',response);
      logger('info', 'Success respond to send-mail ');
    }
    function errorMail(response) {
      //console.log('send-mail error ',response);
      logger('error', 'Error respond to send-mail ' + response);
    }
    return {
      sendMail: function sendMail(mailContent){
        $http.post('/send-mail', mailContent).then(successMail, errorMail);
      }
    };
  }
})();
