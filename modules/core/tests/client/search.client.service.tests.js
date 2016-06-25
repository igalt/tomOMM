'use strict';

var should = require('should'),
    request = require('supertest'),
    path = require('path');

describe('SearchService tests', function() {
    var $injector, searchService;

    beforeEach(function() {
        $injector = angular.injector(['core']);
        searchService = $injector.get('SearchService');
    });

    describe('search returns results', function () {
        it('should return results from the search method', function () {

            expect(searchService.search("wheel")).toBe("1");
        });
    });
});


