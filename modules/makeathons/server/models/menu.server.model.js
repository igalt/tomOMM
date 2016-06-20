'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Makeathon Schema
 */

var MenuSchema = new Schema({
  id: {
    type: Schema.ObjectId,
    ref: 'checklistId'
  }
});

mongoose.model('Menu', MenuSchema);
