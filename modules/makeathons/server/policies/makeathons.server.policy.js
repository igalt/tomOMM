'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Makeathons Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/makeathons',
      permissions: '*'
    }, {
      resources: '/api/makeathons/:makeathonId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/makeathons',
      permissions: ['get', 'post', 'put']
    }, {
      resources: '/api/makeathons/:makeathonId',
      permissions: ['get', 'post', 'put']
    }]
  }]);
};

/**
 * Check If Makeathons Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Makeathon is being processed and the current user created it then allow any manipulation
  if (req.makeathon && req.user && req.makeathon.user && req.makeathon.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      console.log('isAllowed ',isAllowed);
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
