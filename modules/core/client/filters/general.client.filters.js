'use strict';
angular.module('core')
.filter('capitalize', function() {
  return function(input) {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  };})

.filter('unsafe', ['$sce', function ($sce) {  
  return function (val) {
    return $sce.trustAsHtml(val);
  };
}]);

