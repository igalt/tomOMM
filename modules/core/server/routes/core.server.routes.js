'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Send mail
  app.route('/send-mail').post(core.sendEmail);

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Print msgs to logger
  app.route('/api/logger').post(core.printToLog);

  // Change logger level
  app.route('/api/logger-level').post(core.changeLoggerLevel);

  // get search results
  app.route('/api/searchresults/*').get(core.getSearchResults);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/*').get(core.renderIndex);
};
