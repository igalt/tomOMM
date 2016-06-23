'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Challenge Schema
 */

var ChallengeSchema = new Schema({
  id: {
    type: Schema.ObjectId,
    ref: 'ChallengeId'
  },
  makeathonId:{
    type: Schema.ObjectId,
    ref: 'makeathonId'
  },
  title:{
    type: String,
    ref: 'title'
  },
  image:{
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  ownerId: {
    type: Schema.ObjectId,
    ref: 'OwnerId'
  },
  needKnowerAttend: {
    type: Boolean,
    default: true
  },
  connectionToChallenge: {
    type: String,
    default: '',
    required: 'Please choose one of the option',
    trim: true
  },
  desc: {
    type: String,
    default: '',
    required: 'Please fill up the challenge',
    trim: true
  },
  files: [],
  //status: {
  //  in:{
  //    type: Boolean,
  //    default: true
  //  },
  //  out:{
  //    type: Boolean,
  //    default: false
  //  },
  //  TBD:{
  //    type: Boolean,
  //    default: false
  //  }
  //},
  relatedProjects: [],
  needKnowerParticipate: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Challenge', ChallengeSchema);
