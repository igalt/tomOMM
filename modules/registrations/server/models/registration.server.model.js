'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Registration Schema
 */
var RegistrationSchema = new Schema({
  id: {
    type: Schema.ObjectId,
    ref: 'ChallId'
  },
  phone: {
    type: Number,
    default: '',
    trim: true
  },
  dietaryRestrictions: {
    type: String,
    default: '',
    trim: true
  },
  specialRequests: {
    type: String,
    default: '',
    trim: true
  },
  emergency : {
    type: String,
    default: '',
    trim: true
  },
  personalBio: {
    type: String,
    default: '',
    required: 'Please fill up your personal bio',
    trim: true
  },
  picture:{},
  attendingKickoff: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Registration', RegistrationSchema);
