(function () {
  'use strict';

  describe('Challenges List Controller Tests', function () {
    // Initialize global variables
    var ChallengesListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ChallengesService,
      mockChallenge;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ChallengesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ChallengesService = _ChallengesService_;

      // create mock article
      mockChallenge = new ChallengesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Challenge Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Challenges List controller.
      ChallengesListController = $controller('ChallengesListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockChallengeList;

      beforeEach(function () {
        mockChallengeList = [mockChallenge, mockChallenge];
      });

      it('should send a GET request and return all Challenges', inject(function (ChallengesService) {
        // Set POST response
        $httpBackend.expectGET('api/challenges').respond(mockChallengeList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.challenges.length).toEqual(2);
        expect($scope.vm.challenges[0]).toEqual(mockChallenge);
        expect($scope.vm.challenges[1]).toEqual(mockChallenge);

      }));
    });
  });
})();
