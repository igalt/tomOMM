'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Challenge = mongoose.model('Challenge'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  fs = require('fs'),
  mv = require('mv'),
  _ = require('lodash');

var logger = config.logger;

/**
 * Create a Challenge With files Upload
 */
exports.create = function(req, res) {

  //console.log('req.body Challenge: ', req.body);
  //console.log('req.files Challenge: ', req.files);

  var challenge = new Challenge(req.body);
  var files = req.files;
  challenge.user = req.user;

  challenge.save(function(err) {
    if (err) {
      logger.error('Failed to save challenge to database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (files){
      var sourceDirectory = config.uploads.challengeUpload.source;
      var destDirectory = config.uploads.challengeUpload.dest + challenge._id + '/';

      //Create new challenge folder by id. The path should already be exists
      if (!fs.existsSync(destDirectory)){
        console.log('Create new challenge by id: ', challenge._id);
        fs.mkdirSync(destDirectory);
      }

      files.forEach(function (file) {
        mv(sourceDirectory + file.filename , destDirectory + file.originalname, function(err) {
          logger.error('Failed to transfer challenge file', err);
          // done. it first created all the necessary directories, and then
          // tried fs.rename, then falls back to using ncp to copy the dir
          // to dest and then rimraf to remove the source dir
        });
      });
      logger.info('Challenge saved to database', challenge._id);
      res.jsonp(challenge);
    }else {
      logger.info('Challenge saved to database', challenge._id);
      res.jsonp(challenge);
    }
  });
};

/**
 * Show the current Challenge
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var challenge = req.challenge ? req.challenge.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  challenge.isCurrentUserOwner = req.user && challenge.user && challenge.user._id.toString() === req.user._id.toString() ? true : false;

  var filesDirectory = config.uploads.challengeUpload.dest + challenge._id + '/';

  if (fs.existsSync(filesDirectory)){
    fs.readdir(filesDirectory, function (err, files) {
      if (err) {
        logger.error('Failed to read challenge files ', err);
        throw err;
      }
      challenge.files = files.map(function (file) {
        var fileItem = { name:file, url:null };
        fileItem.url = path.join(filesDirectory, file);
        fileItem.url = fileItem.url.replace('public' , '');
        //console.log('fileItem ',fileItem);
        return fileItem;
      });
      //console.log('res challenge ',challenge);
      res.jsonp(challenge);
    });
  } else {
    //console.log('res challenge ',challenge);
    res.jsonp(challenge);
  }
};

/**
 * Update a Challenge
 */
exports.update = function(req, res) {
  var challenge = req.challenge;
  var files = req.files;

  challenge = _.extend(challenge , req.body);

  challenge.save(function(err) {
    if (err) {
      logger.error('Failed to update challenge to database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (files){
      var sourceDirectory = config.uploads.challengeUpload.source;
      var destDirectory = config.uploads.challengeUpload.dest + challenge._id + '/';

      //Create new challenge folder by id. The path should already be exists
      if (!fs.existsSync(destDirectory)){
        console.log('Create new challenge by id: ', challenge._id);
        fs.mkdirSync(destDirectory);
      }

      files.forEach(function (file) {
        mv(sourceDirectory + file.filename , destDirectory + file.originalname, function(err) {
          logger.error('Failed to transfer challenge file', err);
          // done. it first created all the necessary directories, and then
          // tried fs.rename, then falls back to using ncp to copy the dir
          // to dest and then rimraf to remove the source dir
        });
      });
      logger.info('Challenge updated in database', challenge._id);
      res.jsonp(challenge);
    } else {
      logger.info('Challenge updated in database', challenge._id);
      res.jsonp(challenge);
    }
  });
};

/**
 * Delete an Challenge
 */
exports.delete = function(req, res) {
  var challenge = req.challenge ;

  challenge.remove(function(err) {
    if (err) {
      logger.error('Failed to delete challenge from database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      logger.info('Challenge deleted from database', challenge._id);
      res.jsonp(challenge);
    }
  });
};

/**
 * List of Challenges
 */
exports.list = function(req, res) {
  var filter = '';
  if (req.query.makeathonId){
    filter = { 'makeathonId': req.query.makeathonId };
  }

  Challenge.find(filter).sort('-created').populate('user', 'displayName').exec(function(err, challenges) {
    if (err) {
      logger.error('Failed to load challenges list from database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(challenges);
    }
  });
};

/**
 * Challenge middleware
 */
exports.challengeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.error('Challenge is invalid', id);
    return res.status(400).send({
      message: 'Challenge is invalid'
    });
  }

  Challenge.findById(id).populate('user', 'displayName').exec(function (err, challenge) {
    if (err) {
      logger.error('Challenge didn\n found', err);
      return next(err);
    } else if (!challenge) {
      logger.error('No Challenge with that identifier has been found', id);
      return res.status(404).send({
        message: 'No Challenge with that identifier has been found'
      });
    }
    req.challenge = challenge;
    next();
  });
};
