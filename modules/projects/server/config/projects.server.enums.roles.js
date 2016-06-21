/**
 * Enum for Roles to be used in the Project model (looking_for filed)
 * @type {string[]}
 */

'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
	config = require(path.resolve('./config/config'));

/**
 * Projects module init function.
 */
module.exports = function (app, db) {
	return [
		'Developer',
		'Designer',
		'Reviewer',
		'Approval',
		'Analyst'
	];
};
