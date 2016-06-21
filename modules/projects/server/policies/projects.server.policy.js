'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Projects Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/projects',
      permissions: '*'
    }, {
      resources: '/api/projects/:projectId',
      permissions: '*'
    }, {
      resources: '/api/projects/quickView/:projectId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/projects',
      permissions: ['get', 'post']
    }, {
      resources: '/api/projects/:projectId',
      permissions: ['get', 'put']
    }, {
      resources: '/api/projects/quickView/:projectId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/projects',
      permissions: ['get']
    }, {
      resources: '/api/projects/:projectId',
      permissions: ['get']
    }, {
      resources: '/api/projects/quickView/:projectId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Projects Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Project is being processed and the current user created it then allow any manipulation
  if (req.project && req.user && req.project.user && req.project.user.id === req.user.id) {
    return next();
  }

  // Check for user rolesEnum
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
