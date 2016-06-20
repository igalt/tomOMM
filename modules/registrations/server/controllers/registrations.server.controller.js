'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Registration = mongoose.model('Registration'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Registration
 */
exports.create = function(req, res) {
  var registration = new Registration(req.body);
  registration.user = req.user;

  registration.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(registration);
    }
  });
};

/**
 * Show the current Registration
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var registration = req.registration ? req.registration.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  registration.isCurrentUserOwner = req.user && registration.user && registration.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(registration);
};

/**
 * Update a Registration
 */
exports.update = function(req, res) {
  var registration = req.registration ;

  registration = _.extend(registration , req.body);

  registration.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(registration);
    }
  });
};

/**
 * Delete an Registration
 */
exports.delete = function(req, res) {
  var registration = req.registration ;

  registration.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(registration);
    }
  });
};

/**
 * List of Registrations
 */
exports.list = function(req, res) { 
  Registration.find().sort('-created').populate('user', 'displayName').exec(function(err, registrations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(registrations);
    }
  });
};

/**
 * Registration middleware
 */
exports.registrationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Registration is invalid'
    });
  }

  Registration.findById(id).populate('user', 'displayName').exec(function (err, registration) {
    if (err) {
      return next(err);
    } else if (!registration) {
      return res.status(404).send({
        message: 'No Registration with that identifier has been found'
      });
    }
    req.registration = registration;
    next();
  });
};
