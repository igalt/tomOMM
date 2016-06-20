'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  mongoose = require('mongoose'),
  Application = mongoose.model('Application'),
  SkillTags = mongoose.model('SkillTags'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var logger = config.logger;

/**
 * Create a Application
 */
exports.create = function(req, res) {
  var application = new Application(req.body);
  application.user = req.user;

  application.save(function(err) {
    if (err) {
      logger.error('Failed to save application to database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      logger.info('Application saved to database', application._id);
      res.jsonp(application);
    }
  });
};

/**
 * Show the current Application
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var application = req.application ? req.application.toJSON() : {};
  application.isCurrentUserOwner = req.user && application.user && application.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(application);
};

/**
 * Update a Application
 */
exports.update = function(req, res) {
  var application = req.application ;

  application = _.extend(application , req.body);

  application.save(function(err) {
    if (err) {
      logger.error('Failed to update application to database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      logger.info('Application updated in database', application._id);
      res.jsonp(application);
    }
  });
};

/**
 * Delete an Application
 */
exports.delete = function(req, res) {
  var application = req.application ;

  application.remove(function(err) {
    if (err) {
      logger.error('Failed to delete application from database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      logger.info('Application deleted from database', application._id);
      res.jsonp(application);
    }
  });
};

/**
 * List of Applications
 */
exports.list = function(req, res) {

  var filter = '';
  if (req.query.makeathonId){
    filter = { 'makeathonId': req.query.makeathonId };
  }
  Application.find(filter).sort('-created').populate('user', 'displayName').exec(function(err, applications) {
    if (err) {
      logger.error('Failed to load applications list from database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
/*  playing around with mongo-xlsx, REMOVE
     console.log('apps: ', applications);
      var mdl= mongoXlsx.buildDynamicModel(applications);
      console.log('2');
      mongoXlsx.mongoData2Xlsx(applications, mdl, function(err, data) {
        console.log('err', err);
        console.log('File saved at:', applications.fullPath);
      });*/
      res.jsonp(applications);
    }
  });
};

/**
 * Application middleware
 */
exports.applicationByID = function(req, res, next, id) {  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.error('Application is invalid', id);
    return res.status(400).send({
      message: 'Application is invalid'
    });
  }

  Application.findById(id).populate('user', 'displayName').exec(function (err, application) {
    if (err) {
      logger.error('Application was not found', err);
      return next(err);
    } else if (!application) {
      logger.error('No Application with that identifier has been found', id);
      return res.status(404).send({
        message: 'No Application with that identifier has been found'
      });
    }
    req.application = application;
    next();
  });
};

/**
 *  Application SkillTags
 */
exports.skillTags = function(req, res) {
  SkillTags.find().exec(function(err, skillTags) {
    if (err) {
      logger.error('Failed to load skillTags from database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(skillTags);
    }
  });
};


