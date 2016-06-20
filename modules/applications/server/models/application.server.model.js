'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Application Schema
 */

var ApplicationSchema = new Schema({
  id: {
    type: Schema.ObjectId,
    ref: 'ApplicationId'
  },
  makeathonId:{
    type: Schema.ObjectId,
    ref: 'makeathonId'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  comeAs: [],
  bio:{
    type: String,
    default: '',
    required: 'Please fill your bio',
    trim: true
  },
  skillSet:{},
  makeathonExperience: {
    type: String,
    default: 'no'
  },
  assistiveTechnology:{
    type: String,
    default: ''
  },
  teamName: {
    type: String,
    default: ''
  },
  bonus:{
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Application', ApplicationSchema);
