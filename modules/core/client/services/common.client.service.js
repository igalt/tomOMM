(function () {
  'use strict';

  //Send Mail service
  var app = angular.module('core');

  app.service('CommonService', CommonService);

  CommonService.$inject = ['$rootScope', '$http'];

  function CommonService($rootScope, $http) {

    // TODO: Change to $resource. Ex: manage-makeathons.client.routes.js -> getSideMenu
    // Print massages to file logger
    function printToLogger(level, msg) {
      if ($rootScope.loggerLevel === level){
        $http.post('/api/logger', { level: level, msg : msg });
      }
    }
    // Get's window errors
    function windowLogger(msg, url, line)
    {
      var msgContent = 'Error in ' + url + ' on line ' + line + ': ' + msg;
      $http.post('/api/logger', { level:'error', msg : msgContent });
    }

    // Javascript method extension to String prototype
    function camelize() {
      return this.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
        if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toLowerCase() : match.toUpperCase();
      });
    }
    // Goback button function
    function goBack() {
      window.history.back();
    }

    return {
      printToLogger: printToLogger,
      windowLogger: windowLogger,
      camelize: camelize,
      goBack: goBack
    };
  }
})();
