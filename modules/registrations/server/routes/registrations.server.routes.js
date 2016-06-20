'use strict';

/**
 * Module dependencies
 */
var registrationsPolicy = require('../policies/registrations.server.policy'),
  registrations = require('../controllers/registrations.server.controller');

module.exports = function(app) {
  // Registrations Routes
  app.route('/api/registrations').all(registrationsPolicy.isAllowed)
    .get(registrations.list)
    .post(registrations.create);

  app.route('/api/registrations/:registrationId').all(registrationsPolicy.isAllowed)
    .get(registrations.read)
    .put(registrations.update)
    .delete(registrations.delete);

  // Finish by binding the Registration middleware
  app.param('registrationId', registrations.registrationByID);
};
