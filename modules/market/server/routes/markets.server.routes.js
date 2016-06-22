'use strict';

/**
 * Module dependencies
 */
var marketPolicy = require('../policies/market.server.policy'),
  market = require('../controllers/market.server.controller');

module.exports = function(app) {
  // market Routes
  app.route('/api/market').all(marketPolicy.isAllowed)
    .get(market.list)
    .post(market.create);

  app.route('/api/market/:marketId').all(marketPolicy.isAllowed)
    .get(market.read)
    .put(market.update)
    .delete(market.delete);

  // Finish by binding the Market middleware
  app.param('marketId', market.marketByID);
};
