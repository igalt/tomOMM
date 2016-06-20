(function () {
  'use strict';

  // Registrations controller
  angular
    .module('registrations')
    .controller('RegistrationsController', RegistrationsController);

  RegistrationsController.$inject = ['$scope', '$state', 'Authentication', 'registrationResolve'];

  function RegistrationsController ($scope, $state, Authentication, registration) {
    var vm = this;

    vm.authentication = Authentication;
    vm.registration = registration;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Registration
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.registration.$remove($state.go('registrations.list'));
      }
    }

    // Save Registration
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.registrationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.registration._id) {
        vm.registration.$update(successCallback, errorCallback);
      } else {
        vm.registration.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('registrations.view', {
          registrationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
