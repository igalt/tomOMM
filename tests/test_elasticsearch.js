'use strict';

var elasticsearch = require('../config/lib/elasticsearchaccessor');

elasticsearch.ping();

elasticsearch.search("first","project").then(function(value) { console.log(value); });

elasticsearch.searchAll("first").then(function(value) { console.log(value); });



