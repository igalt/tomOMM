'use strict';

/**
 * Module dependencies
 */
var challengesPolicy = require('../policies/challenges.server.policy'),
  challenges = require('../controllers/challenges.server.controller'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  multer = require('multer');

var upload = multer({ dest: config.uploads.challengeUpload.source });

module.exports = function(app) {
  var http = require('http');
  var userData = {};
  var projectsDataArray = [];



  // Challenges Routes
  app.route('/api/challenges').all(challengesPolicy.isAllowed)
    .get(challenges.list)
    .post(upload.array('file'), challenges.create);

  app.route('/api/challenges/:challengeId').all(challengesPolicy.isAllowed)
    .get(challenges.read)
    .put(upload.array('file'), challenges.update)
    .delete(challenges.delete);

  app.route('/api/challenges/quickview/:challengeId').get(function (req,res) {
    console.log(req);
    var responseObj = {"title": req.challenge.title,
                       "image": req.challenge.profileImageURL,
                       "description": req.challenge.desc};
    res.json(responseObj);
  });

  app.route('/api/challenges/searchview/:challengeId').get(function (req,res,getUserData) {
    function responseIsHtml(response) {
      if (typeof response != 'object' && response.indexOf('?<') > -1) {
        return true;
      } else {
        return false;
      }
    };

    function getUserData(req,res,responseObj,callback) {
      http.get({
        host: 'localhost',
        port: 3000,
        path: "/api/users/quickview/" + req.challenge.user._id
      }, function (response) {
        if (! responseIsHtml(response)) {
          var responseData = '';
          response.on('data', function (chunk) {
            responseData += chunk;
          });
          response.on('end', function () {
            responseObj.created_by = JSON.parse(responseData);
            callback(req,res,responseObj);
          });
        }
      });

    };

    function getProjectsData(req,res,responseObj) {
      if (req.challenge.relatedProjects) {
        req.challenge.relatedProjects.forEach(function (currentValue) {
          http.get({
            host: 'localhost',
            port: 3000,
            path: "/api/projects/" + currentValue
          }, function (response) {
            var responseData = '';
            response.on('data', function (chunk) {
              responseData += chunk;
            });
            response.on('end', function () {
              if (! responseIsHtml(response)) {
                var parsed = JSON.parse(responseData);
                projectsDataArray.push({
                  "title": parsed.title,
                  "url": parsed.url,
                  "creation_date": parsed.creation_date
                });
                console.log("88");
              }
            });
            console.log("91");
          });
        });
        console.log("94");
        responseObj.relatedProjects = projectsDataArray;
        console.log(responseObj);
      }
      res.json(responseObj);
    };

    function getInitialData (req,res,callback,secondCallback) {
      var responseObj = {"title": req.challenge.title,
        "image": req.challenge.profileImageURL,
        "description": req.challenge.desc,
        "creation_date": req.challenge.createdAt};
      callback(req,res,responseObj,secondCallback);
    };

    getInitialData(req,res,getUserData,getProjectsData);
  });

  // Finish by binding the Challenge middleware
  app.param('challengeId', challenges.challengeByID);

};
