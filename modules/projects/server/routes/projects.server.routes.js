'use strict';

/**
 * Module dependencies
 */
var projectsPolicy = require('../policies/projects.server.policy'),
  projects = require('../controllers/projects.server.controller');

module.exports = function(app) {
  // Projects Routes
  app.route('/api/projects').all(projectsPolicy.isAllowed)
    .get(projects.list)
    .post(projects.create);

  app.route('/api/projects/:projectId').all(projectsPolicy.isAllowed)
    .get(projects.read)
    .put(projects.update)
    .delete(projects.delete);

  app.route('/api/projects/quickView/:projectId').all(projectsPolicy.isAllowed)
      .get(projects.quickView);

  // Finish by binding the Project middleware
  app.param('projectId', projects.projectByID);
};
