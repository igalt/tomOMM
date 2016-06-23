'use strict';

module.exports = function (app) {

    var http = require('http');
    // User Routes
    var users = require('../controllers/users.server.controller');

    // Setting up the users profile api
    app.route('/api/users/me').get(users.me);
    app.route('/api/users').put(users.update);
    app.route('/api/users/accounts').delete(users.removeOAuthProvider);
    app.route('/api/users/password').post(users.changePassword);
    app.route('/api/users/picture').post(users.changeProfilePicture);

    app.route('/api/users/quickview/:userId').get(function (req,res) {
        var responseObj = {"name": req.model.displayName,
            "image": req.model.profileImageURL,
            "description": req.model.description};
        res.json(responseObj);

    });

    app.route('/api/users/searchview/:userId').get(function (req,res) {
        var projectsDataArray = [];
        var challengesDataArray = [];

        function getArrayData(origArray,dataArray, api) {
            origArray.forEach(function (currentValue) {
                http.get({
                    host: 'localhost',
                    port: 3000,
                    path: api + currentValue
                }, function (response) {
                    var responseData = '';
                    response.on('data', function (chunk) {
                        responseData += chunk;
                    });
                    response.on('end', function () {
                        var parsed = JSON.parse(responseData);
                        dataArray.push({
                            "title": parsed.title,
                            "url": parsed.url,
                            "creation_date": parsed.creation_date
                        });
                        console.log(dataArray);
                    });

                });
            });

        };

        function getProjectsData (req,res,responseObj,callback) {
            getArrayData(req.model.projects,projectsDataArray,'/api/projects/');
            console.log("projects: "+projectsDataArray);
            responseObj.projects = projectsDataArray;
            callback(req,res,responseObj);
        };

        function getChallengesData (req,res,responseObj) {
            getArrayData(req.model.challenges,challengesDataArray,'/api/challenges/');
            console.log("challenges: "+challengesDataArray);
            responseObj.challenges = challengesDataArray;
            res.json(responseObj);
        };

        function getInitialData(req,res,callback,secondCallback) {
            var responseObj = {"name": req.model.displayName,
                "description": req.model.description,
                "email": req.model.email,
                "address": req.model.address.city+", "+req.model.address.country,
                "phone": req.model.phone,
                "skills": req.model.skills,
                "image": req.model.profileImageURL,
                "creation_date": req.model.created};
            callback(req,res,responseObj,secondCallback);
        };

        getInitialData(req,res,getProjectsData,getChallengesData);
    });

    // Finish by binding the user middleware
    app.param('userId', users.userByID);
};
