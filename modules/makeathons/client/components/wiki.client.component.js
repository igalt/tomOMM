(function() {
  'use strict';

  var app = angular.module('makeathons');

  app.component('wikiComponent', {
    bindings: {
      makeathon: '=',
      wiki: '='
    },
    templateUrl: 'modules/makeathons/client/views/wiki.client.view.html',
    controller: wikiComponent,
    controllerAs: 'vm'
  });

  wikiComponent.$inject = [];

  function wikiComponent () {

    var vm = this;

    var parser = new DOMParser();
    if (vm.wiki){
      var elmWiki = document.querySelector('.wiki');
      elmWiki.innerHTML = '';
      var doc = parser.parseFromString(vm.wiki, 'text/html');
      var wikiPage = doc.querySelector('.markdown-section');
      elmWiki.appendChild(wikiPage);
    }

  }
})();
