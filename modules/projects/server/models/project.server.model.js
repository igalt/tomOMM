'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  validate = require('mongoose-validator'),
  rolesEnum = require('../config/projects.server.enums.roles')();

/**
 * Validators
 */
var urlValidator = [
  validate({
    validator: 'isURL',
    passIfEmpty: true,
    message: 'A wrong url was passed'
  })
];

var roleValidator = validate({
  validator: function(val) {
    return rolesEnum.indexOf(val) > -1;
  },
  message: 'Unsupported role was provided.'
});

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill project Title',
    trim: true
  },
  icon: {
    type: String,
    default: '',
    validate: urlValidator,
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill project Description',
    trim: true
  },
  team: [{
    type : Schema.ObjectId,
    ref: 'User'
  }],
  project_owner: {
    type : Schema.ObjectId,
    ref: 'User',
    required: 'Please provide the project owner.'
  },
  looking_for: [{
      type: String,
      enum: rolesEnum,
      validate: roleValidator
  }],
  related_challenges: [{
    type : Schema.ObjectId,
    ref: 'Challenge'
  }],
  linked_projects: [{
    type : Schema.ObjectId,
    ref: 'Project'
  }],
  badges: [{
    type: String,
    trim: true
  }],
  tags: [{
      type: String,
      lowercase: true,
      trim: true
  }],
  creation_date: {
    type: Date,
    default: Date.now
  },
  last_activity: {
    type: Date,
    default: Date.now
  },
  reviews: [{
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    review: {
      type: String,
      required: true,
      trim: true
    }
  }],
  status: [{
    type: String,
    uppercase: true,
    trim: true
  }],
  followers: [{
    type : Schema.ObjectId,
    ref: 'User'
  }],
  spawned_from: [{
    spawned_from_type: {
      type: String,
      required: true,
      trim: true
    },
    spawned_from_id: {
      type: String,
      required: true,
      trim: true
    }
  }],
  media: {
    files: [{
      title: {
        type: String,
        trim: true
      },
      file_type: {
        type: String,
        lowercase: true,
        trim: true
      },
      url: {
        type: String,
        validate: urlValidator,
        trim: true,
        required: 'The media url is required.'
      }
    }],
    images: [{
      type: String,
      validate: urlValidator,
      required: true,
      trim: true
    }],
    videos: [{
      type: String,
      validate: urlValidator,
      required: 'The video url is required.',
      trim: true
    }],
    links: [{
      title: {
        type: String,
        trim: true
      },
      link_type: {
        type: String,
        lowercase: true,
        trim: true
      },
      url: {
        type: String,
        validate: urlValidator,
        required: 'The link url is required.',
        trim: true
      }
    }]
  }
});

mongoose.model('Project', ProjectSchema);
