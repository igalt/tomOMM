(function () {
    'use strict';

    //Search service
    var app = angular.module('core');

    app.service('SearchService', SearchService);

    var elasticSearchAccessor = require('../../../config/lib/elasticsearchaccessor');

    SearchService.$inject = ['$http',''];

    function SearchService($http) {
        function search(term,index) {
            var results = elasticSearchAccessor.search(term,index);
            console.log(results);
            // get relevant data for each ID
        };

        function searchAll(term) {
            var results = elasticSearchAccessor.searchAll(term);
            console.log(results);
        }

        return {
            search: search,
            searchAll: searchAll
        };
    }
})();
