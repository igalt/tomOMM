'use strict';


var http = require('http');

// getProjectQuickView

module.exports.getProjectQuickView = function (projectId) {
    var functionResponse;

    function responseIsHtml(response) {
        return (typeof response != 'object' && response.indexOf('?<') > -1);
    }

    http.get({
        host: 'localhost',
        port: 3000,
        path: "/api/projects/" + projectId
    }, function(response) {
        var responseData = '';
        response.on('data', function(chunk) {
            console.log("writing data");
            responseData += chunk;
        });
        response.on('end', function() {
            if (! responseIsHtml(response)) {
                var parsed = JSON.parse(responseData);
                functionResponse = {
                    "title": parsed.title,
                    "url": parsed.url,
                    "creation_date": parsed.creation_date
                };
            } else {
                functionResponse = {};
            }
        });
        response.on('error',function(e){
            console.log("Error: " + e.message);
        });

        return functionResponse;
    });
};







