'use strict';

//var config = require('../config');

var elasticsearch = require('elasticsearch');
//var elasticClient = new elasticsearch.Client(config.elasticSearchClient);
var elasticClient = new elasticsearch.Client({host: 'http://10.65.243.78:9200' , log: 'error'});

module.exports.ping = function () {
    elasticClient.ping({
        // ping usually has a 3000ms timeout
        requestTimeout: Infinity,

        // undocumented params are appended to the query string
        hello: "elasticsearch!"
    }, function (error) {
        if (error) {
            console.error('elasticsearch cluster is down!');
        } else {
            console.log("ping!");
        }
    });
};

module.exports.init = function() {
    function indexExists() {
        return elasticClient.indices.exists({
            index: "tom"
        });
    };

    function initIndex() {
        return elasticClient.indices.create({
            index: "tom"
        });
    };

    function initUserMapping() {
        return elasticClient.indices.putMapping({
            index: "tom",
            type: "user",
            body: {
                properties: {
                    firstName: {type: "string"},
                    lastName: {type: "string"},
                    displayName: {type: "string"},
                    email: {type: "string"},
                    username: {type: "string"},
                    skills: {type: "string", "index_name": "skill"},
                    description: {type: "string"},
                    occupation: {type: "string"},
                    address: {type: "object" ,
                        properties:{
                            city: {type: "string"},
                            country: {type: "string"}
                        }
                    }
                }
            }
    })};

    function initProjectMapping() {
        return elasticClient.indices.putMapping({
                index: "tom",
                type: "project",
                body: {
                    properties: {
                        description: {type: "string"},
                        title: {type: "string"},
                        tags: {type: "string", "index_name": "tag"},
                        badges: {type: "string", "index_name": "badge"},
                        creationDate: {type: "date"},
                        lastActivity: {type: "date"},
                        status: {type: "string"},
                        lookingFor: {type: "string"},
                        address: {type: "object" ,
                            properties:{
                                city: {type: "string"},
                                country: {type: "string"}
                            }
                        }
                    }
                }
            }
    )};

    function initChallengeMapping() {
        return elasticClient.indices.putMapping({
                index: "tom",
                type: "challenge",
                body: {
                    properties: {
                        description: {type: "string"},
                        title: {type: "string"},
                        creationDate: {type: "date"},
                        needKnowerParticipate: {type: "string"}
                    }
                }
            }
    )};

    if (! indexExists()) {
        initIndex();
        initUserMapping();
        initProjectMapping();
        initChallengeMapping();
        console.log("Completed index initialization.");
    } else {
        console.log("Index already exists.");
    }

};

module.exports.upsertUser = function(user) {
    return elasticClient.index({
            index: "tom",
            type: "user",
            id: user.id,
            body: {
                firstName: user.firstName,
                lastName:  user.lastName,
                displayName: user.displayName,
                email:  user.email,
                username: user.username,
                skills: user.skills,
                description: user.description,
                occupation: user.occupation,
                address: {city: user.address.city, country:  user.address.country}
            }
        });
};

module.exports.upsertProject = function(project) {
    return elasticClient.index({
        index: "tom",
        type: "project",
        id: project.id,
        body: {
            title: project.title,
            description: project.description,
            tags: project.tags,
            badges: project.badges,
            creationDate: project.creationDate,
            lastActivity: project.lastActivity,
            status: project.status,
            lookingFor: project.lookingFor
        }
    });
};

module.exports.upsertChallenge = function(challenge) {
    return elasticClient.index({
        index: "tom",
        type: "challenge",
        id: challenge.id,
        body: {
            title: challenge.title,
            description: challenge.description,
            creationDate: challenge.creationDate,
            needKnowerParticipate: challenge.needKnowerParticipate
        }
    });
};

module.exports.search = function(input,type,onlyId) {
    if (! onlyId) {
        onlyId = false;
    }
    function extractIdFromResult(result){
        var hitResults = result.hits.hits;
        return hitResults.map(function (hit, index) {
            return hit._id;
        })
    };

    function extractIdAndTypeFromResult(result){
        var hitResults = result.hits.hits;
        return hitResults.map(function (hit, index) {
            return [ hit._type ,hit._id] ;
        })
    };

    return elasticClient.search({
        index: "tom",
        type: type,
        body: {
            fields: ["_id"],
            query: {
                wildcard: {
                    _all: input
                }
            }
        }
    }).then(function(results){
        if (onlyId) {
            return extractIdFromResult(results);
        } else {
            return extractIdAndTypeFromResult(results);
        }

    })
};

module.exports.searchAll = function (input) {
    function extractIdAndTypeFromResult(result){
        var hitResults = result.hits.hits;
        return hitResults.map(function (hit, index) {
            return [ hit._type ,hit._id] ;
        })
    };

    return elasticClient.search({
        index: "tom",
        body: {
            fields: ["_id"],
            query: {
                wildcard: {
                    _all: input
                }
            }
        }
    }).then(function(results){
        return extractIdAndTypeFromResult(results);
    })
};





