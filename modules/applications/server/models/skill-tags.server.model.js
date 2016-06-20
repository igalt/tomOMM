'use strict';

/**
 *  Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 *  Skill Schema
 */

var SkillSchema = new Schema({
  id: {
    type: Schema.ObjectId,
    ref: 'skillSetId'
  }
});

mongoose.model('SkillTags', SkillSchema);
