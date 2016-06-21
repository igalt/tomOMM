'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Project = mongoose.model('Project'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Project
 */
exports.create = function(req, res) {
  var project = new Project(req.body);
  project.project_owner = req.user;
  if (! req.user || project.team.length == 0) {
    project.team.push(req.user);
  }

  project.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(project);
    }
  });
};

/**
 * Show the current Project
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var project = req.project ? req.project.toJSON() : {};

  project.isCurrentProjectOwner =
      req.user && project.project_owner && project.project_owner._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(project);
};

exports.quickView = function(req, res) {

  // convert mongoose document to JSON
  var project = req.project ? req.project.toJSON() : {};

  project.isCurrentProjectOwner =
      req.user && project.project_owner && project.project_owner._id.toString() === req.user._id.toString() ? true : false;

  delete project.related_challenges;
  delete project.linked_projects;
  delete project.status;
  delete project.media;
  delete project.last_activity ;
  delete project.spawned_from;
  delete project.reviews;
  delete project.followers;

  res.jsonp(project);
};

/**
 * Update a Project
 */
exports.update = function(req, res) {
  var project = req.project ;

  project = _.extend(project , req.body);

  project.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(project);
    }
  });
};

/**
 * Delete an Project
 */
exports.delete = function(req, res) {
  var project = req.project ;

  project.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(project);
    }
  });
};

/**
 * List of all Projects
 */
exports.list = function(req, res) {
  var userSelectFields = 'firstName lastName displayName email';
  Project.find()
      .sort('-creation_date')
      .populate('project_owner', userSelectFields)
      .populate('team', userSelectFields)
      .populate('related_challenges')
      .populate('linked_projects')
      .populate('reviews', userSelectFields)
      .populate('followers', userSelectFields)
      .exec(function(err, projects) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(projects);
        }
      });
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Project is invalid'
    });
  }

  var userSelectFields = 'firstName lastName displayName email';

  Project.findById(id)
      .populate('project_owner', userSelectFields)
      .populate('team', userSelectFields)
      .populate('related_challenges')
      .populate('linked_projects')
      .populate('reviews', userSelectFields)
      .populate('followers', userSelectFields)
      .exec(function (err, project) {
        if (err) {
          return next(err);
        } else if (!project) {
          return res.status(404).send({
            message: 'No Project with that identifier has been found'
          });
        }
        req.project = project;
        next();
      });
};

/**
 * Project middleware
 */
exports.quickViewByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Project is invalid'
    });
  }

  var userSelectFields = 'firstName lastName displayName email';

  Project.findById(id)
      .populate('project_owner', userSelectFields)
      .populate('team', userSelectFields)
      .select('title main_image description team project_owner looking_for badges creation_date')
      .exec(function (err, project) {
        if (err) {
          return next(err);
        } else if (!project) {
          return res.status(404).send({
            message: 'No Project with that identifier has been found'
          });
        }
        req.project = project;
        next();
      });
};
