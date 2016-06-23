'use strict';

module.exports = function (app) {
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
    console.log(res);

  });

  app.route('/api/users/searchview/:userId').get(function (req,res) {

    var responseObj = {"name": req.model.displayName,
                       "description": req.model.description,
                       "email": req.model.email,
                       "address": req.model.address.city+", "+req.model.address.country,
                       "phone": req.model.phone,
                       "projects": [],
                       "challenges": [],
                       "skills": req.model.skills,
                       "image": req.model.profileImageURL,
                       "creation_date": req.model.created};
    res.json(responseObj);
    console.log(req.model);
  });


  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
