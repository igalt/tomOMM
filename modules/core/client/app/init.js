(function () {
  'use strict';

  //Start by defining the main module and adding the module dependencies
  var app = angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

  // Setting HTML5 Location Mode
  app.config(['$locationProvider', '$httpProvider', '$uiViewScrollProvider',
    function ($locationProvider, $httpProvider, $uiViewScrollProvider) {
      $locationProvider.html5Mode(true).hashPrefix('!');

      $httpProvider.interceptors.push('authInterceptor');

      $uiViewScrollProvider.useAnchorScroll();
    }
  ]);

  app.run(function ($rootScope, $state, Authentication, $http) {
    $rootScope.loggerLevel = 'error';
    $rootScope.logAll = changeLoggerLevel;

    // Check authentication before changing state
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      storeFirstState(toState, toParams);
      if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
        var allowed = false;
        toState.data.roles.forEach(function (role) {
          if (Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1) {
            allowed = true;
            return true;
          }
        });

        if (!allowed) {
          event.preventDefault();
          if (Authentication.user && Authentication.user.roles.indexOf('guest') !== -1) {
            $state.go('settings.password');
          } else
          if (Authentication.user && typeof Authentication.user === 'object') {
            $state.go('forbidden');
          } else {
            $state.go('authentication.signin');
          }
        }
      }
    });

    // Record previous state
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      storePreviousState(fromState, fromParams);
    });

    // Store previous state
    function storePreviousState(state, params) {
      // only store this state if it shouldn't be ignored
      if (!state.data || !state.data.ignoreState) {
        $state.previous = {
          state: state,
          params: params,
          href: $state.href(state, params)
        };
      }
      //console.log('$state.previous ' , $state.previous);
    }

    // Store link state / store first state / exe once when the app load
    function storeFirstState(state, params) {
      if (!$state.first) {
        $state.first = {
          state: state,
          params: params,
          href: $state.href(state, params)
        };
      } else {
        // only store this state if it shouldn't be ignored
        if ((!state.data || !state.data.ignoreState) && !$state.first.state.name) {
          $state.first = {
            state: state,
            params: params,
            href: $state.href(state, params)
          };
        }
      }
      //console.log('$state.first ' , $state.first);
    }

    // Change Logger Level in case needed to log everything to file
    function changeLoggerLevel(flag){
      console.log('Changing Logger Level');
      $rootScope.loggerLevel = (flag)? 'info' : 'error';
      return $http.post('/api/logger-level', { flag: flag }).then(function(res){
        console.log(res.data.message);
        return res.data.message;
      });
    }

  });

  //Then define the init function for starting up the application
  angular.element(document).ready(function () {
    //Fixing facebook bug with redirect
    if (window.location.hash && window.location.hash === '#_=_') {
      if (window.history && history.pushState) {
        window.history.pushState('', document.title, window.location.pathname);
      } else {
        // Prevent scrolling by storing the page's current scroll offset
        var scroll = {
          top: document.body.scrollTop,
          left: document.body.scrollLeft
        };
        window.location.hash = '';
        // Restore the scroll offset, should be flicker free
        document.body.scrollTop = scroll.top;
        document.body.scrollLeft = scroll.left;
      }
    }

    //Then init the app
    angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
  });
})();
