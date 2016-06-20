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
  // Challenges Routes
  app.route('/api/challenges').all(challengesPolicy.isAllowed)
    .get(challenges.list)
    .post(upload.array('file'), challenges.create);

  app.route('/api/challenges/:challengeId').all(challengesPolicy.isAllowed)
    .get(challenges.read)
    .put(upload.array('file'), challenges.update)
    .delete(challenges.delete);

  // Finish by binding the Challenge middleware
  app.param('challengeId', challenges.challengeByID);

};
