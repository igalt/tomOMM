'use strict';

/**
 * Module dependencies
 */
var challengesPolicy = require('../policies/challenges.server.policy'),
  challenges = require('../controllers/challenges.server.controller'),
  path = require('path'),
  projectDataRetrieval = require('../services/project-data-retrieval.server.service'),
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

    function getUserData(req,res,responseObj,callback,secondCallback) {
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
            return callback(req,res,responseObj,secondCallback);
          });
        }
      });

    };

    function getProjectsData(req,res,responseObj,callback) {
      if (req.challenge.relatedProjects) {
         console.log("here");
        req.challenge.relatedProjects.forEach(function (currentValue) {
            console.log(currentValue);
            var projectData = projectDataRetrieval.getProjectQuickView(currentValue);
            projectsDataArray.push(projectData);
            console.log(projectsDataArray);
          });
          responseObj.relatedProjects = projectsDataArray;
      }
      return callback(res, responseObj);
    };

    function sendResponse(res,responseObj) {
      res.json(responseObj);
    };

    function getInitialData (req,res,callback,secondCallback,thirdCallback) {
      var responseObj = {"title": req.challenge.title,
        "image": req.challenge.profileImageURL,
        "description": req.challenge.desc,
        "creation_date": req.challenge.createdAt};
      return callback(req,res,responseObj,secondCallback,thirdCallback);
    };

    return getInitialData(req,res,getUserData,getProjectsData,sendResponse);
  });

  // Finish by binding the Challenge middleware
  app.param('challengeId', challenges.challengeByID);

};
