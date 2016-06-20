'use strict';

/**
 * Module dependencies
 */
var makeathonsPolicy = require('../policies/makeathons.server.policy'),
  makeathons = require('../controllers/makeathons.server.controller'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  multer = require('multer');

var upload = multer({ dest: config.uploads.makeathonPartnersUpload.source });

module.exports = function(app) {
  // Makeathons Routes
  app.route('/api/makeathons').all(makeathonsPolicy.isAllowed)
    .get(makeathons.list)
    .post(upload.array('file'), makeathons.create);

  app.route('/api/makeathons/:makeathonId').all(makeathonsPolicy.isAllowed)
    .get(makeathons.read)
    .put(upload.array('file'), makeathons.update)
    .delete(makeathons.delete);

  app.route('/api/checklists').post(makeathons.checklist);
  app.route('/api/wiki').post(makeathons.wiki);
  app.route('/api/sideMenu').get(makeathons.menu);

  // Finish by binding the Makeathon middleware
  app.param('makeathonId', makeathons.makeathonByID);
};
