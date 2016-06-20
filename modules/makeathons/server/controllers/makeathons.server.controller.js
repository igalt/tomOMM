'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Makeathon = mongoose.model('Makeathon'),
  Checklist = mongoose.model('Checklist'),
  Menu = mongoose.model('Menu'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  config = require(path.resolve('./config/config')),
  fs = require('fs'),
  mv = require('mv'),
  _ = require('lodash'),
  request = require('request');

var logger = config.logger;

/**
 * Create a Makeathon With files Upload
 */
exports.create = function(req, res) {
  console.log('new Makeathon() ',new Makeathon());
  //console.log('req.body ',req.body);
  //console.log('req.files ',req.files);

  var makeathon = new Makeathon(req.body);
  var files = req.files;
  makeathon.user = req.user;
  if (typeof makeathon.userRoles === 'string') {
    makeathon.userRoles = JSON.parse(makeathon.userRoles);
  }
  if (typeof makeathon.checklists === 'string') {
    makeathon.checklists = JSON.parse(makeathon.checklists);
  }

  makeathon.save(function(err) {
    if (err) {
      logger.error('Failed to save makeathon to database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (files){
      var sourceDirectory = config.uploads.makeathonPartnersUpload.source;
      var destDirectory = config.uploads.makeathonPartnersUpload.dest + makeathon._id + '/';

      //Create new makeathon folder by id. The path should already be exists
      if (!fs.existsSync(destDirectory)){
        fs.mkdirSync(destDirectory);
      }

      files.forEach(function (file) {
        mv(sourceDirectory + file.filename , destDirectory + file.originalname, function(err) {
          logger.error('Failed to transfer makeathon file', err);
          // done. it first created all the necessary directories, and then
          // tried fs.rename, then falls back to using ncp to copy the dir
          // to dest and then rimraf to remove the source dir
        });
      });
      logger.info('Makeathon saved to database', makeathon._id);
      res.jsonp(makeathon);
    } else {
      logger.info('Makeathon saved to database', makeathon._id);
      res.jsonp(makeathon);
    }
  });
};

/**
 * Show the current Makeathon
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var makeathon = req.makeathon ? req.makeathon.toJSON() : {};

  //console.log('makeathon READ ', makeathon);

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  makeathon.isCurrentUserOwner = req.user && makeathon.user && makeathon.user._id.toString() === req.user._id.toString() ? true : false;

  var filesDirectory = config.uploads.makeathonPartnersUpload.dest + makeathon._id + '/';

  if (fs.existsSync(filesDirectory)){
    fs.readdir(filesDirectory, function (err, files) {
      if (err) {
        logger.error('Failed to read makeathon files ', err);
        throw err;
      }
      makeathon.partners = files.map(function (file) {
        var partnerUrl = path.join(filesDirectory, file);
        partnerUrl = partnerUrl.replace('public' , '');
        //console.log('partnerUrl ',partnerUrl);
        return partnerUrl;
      });
      //console.log('makeathon.partners ',makeathon.partners);
      res.jsonp(makeathon);
    });
  } else {
    res.jsonp(makeathon);
  }

};

/**
 * Update a Makeathon
 */
exports.update = function(req, res) {
  var makeathon = req.makeathon ;
  var files = req.files;

  makeathon = _.extend(makeathon , req.body);
  // Update user because file Uploader pass user object as a string
  makeathon.user = req.user;
  if (typeof makeathon.userRoles === 'string') {
    makeathon.userRoles = JSON.parse(makeathon.userRoles);
  }
  if (typeof makeathon.checklists === 'string') {
    makeathon.checklists = JSON.parse(makeathon.checklists);
  }

  makeathon.save(function(err) {
    if (err) {
      logger.error('Failed to update makeathon to database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (files){
      var sourceDirectory = config.uploads.makeathonPartnersUpload.source;
      var destDirectory = config.uploads.makeathonPartnersUpload.dest + makeathon._id + '/';

      //Create new makeathon folder by id. The path should already be exists
      if (!fs.existsSync(destDirectory)){
        console.log('Create new makeathon by id: ', makeathon._id);
        fs.mkdirSync(destDirectory);
      }

      files.forEach(function (file) {
        mv(sourceDirectory + file.filename , destDirectory + file.originalname, function(err) {
          // done. it first created all the necessary directories, and then
          // tried fs.rename, then falls back to using ncp to copy the dir
          // to dest and then rimraf to remove the source dir
        });
      });
      logger.info('Makeathon updated in database', makeathon._id);
      res.jsonp(makeathon);
    } else {
      logger.info('Makeathon updated in database', makeathon._id);
      res.jsonp(makeathon);
    }
  });
};

/**
 * Delete an Makeathon
 */
exports.delete = function(req, res) {
  var makeathon = req.makeathon ;

  makeathon.remove(function(err) {
    if (err) {
      logger.error('Failed to delete makeathon from database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      logger.info('Makeathon deleted from database', makeathon._id);
      res.jsonp(makeathon);
    }
  });
};

/**
 * List of Makeathons
 */
exports.list = function(req, res) {
  var now = new Date();
  Makeathon.find({ startDate: { $gt: now } })  // Futures makeathons only
    .sort({ startDate: 1 })  // Sort by makeathon start date
    .populate('user', 'displayName')
    .exec(function(err, makeathons) {
      if (err) {
        logger.error('Failed to load makeathons list from database', err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(makeathons);
      }
    });
};


/**
 * Makeathon middleware
 */
exports.makeathonByID = function(req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.error('Makeathon is invalid', id);
    return res.status(400).send({
      message: 'Makeathon is invalid'
    });
  }

  Makeathon.findById(id).populate('user', 'displayName').exec(function (err, makeathon) {
    if (err) {
      logger.error('Makeathon didn\n found', err);
      return next(err);
    } else if (!makeathon) {
      logger.error('No Makeathon with that identifier has been found', id);
      return res.status(404).send({
        message: 'No Makeathon with that identifier has been found'
      });
    }
    req.makeathon = makeathon;
    next();
  });
};

/**
 *  Makeathons checklists
 */
exports.checklist = function(req, res) {
  Checklist.find(req.body).exec(function(err, checklists) {
    if (err) {
      logger.error('Failed to load checklist from database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(checklists);
    }
  });
};

/**
 *  Makeathons Wiki
 */
exports.wiki = function(req, res) {
  var filePath = config.wikiFilePath;
  var fileName = req.body.fileName;
  //console.log('full path ',filePath+fileName);
  download(filePath+fileName, function(page) {
    res.jsonp(page);
  });
};

/**
 *  Makeathons Menus
 */
exports.menu = function(req, res) {
  Menu.find().exec(function(err, menu) {
    if (err) {
      logger.error('Failed to load menu from database', err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(menu);
    }
  });
};

// download the generated url
function download(url, callback) {

// Set the headers
  var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
  };

// Configure the request
  var options = {
    url: url,
    method: 'GET',
    headers: headers
  };

// Start the request
  request(options, function (error, response) {
    if (error) {
      logger.error('Failed to load wiki page', error);
      callback({
        message: errorHandler.getErrorMessage(error)
      });
    } else {
      callback(response.body);
    }
  });
}
