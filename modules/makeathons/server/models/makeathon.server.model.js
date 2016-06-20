'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Makeathon Schema
 */

var MakeathonSchema = new Schema({
  id: {
    type: Schema.ObjectId,
    ref: 'MakeathonId'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill event name',
    trim: true
  },
  status: {
    type: String,
    default: '',
    required: 'Please fill event status',
    trim: true
  },
  venue: {
    type: String,
    default: '',
    //required: 'Please fill event venue',
    trim: true
  },
  startDate: {
    type: Date,
    required: 'Please fill event start date',
    default: ''
  },
  endDate: {
    type: Date,
    required: 'Please fill event end date',
    default: ''
  },
  regDeadline: {
    type: Date,
    //required: 'Please fill registration Deadline',
    default: ''
  },
  preTomDate: {
    type: Date,
    //required: 'Please fill preTom Date',
    default: ''
  },
  webSite: {
    type: String,
    default: '',
    trim: true
  },
  challengeDesc: {
    type: String,
    default: '',
    //required: 'Please fill challenge description',
    trim: true
  },
  applicationDesc: {
    type: String,
    default: '',
    //required: 'Please fill application description',
    trim: true
  },
  checklists: {
    type: Object
  },
  userRoles: {
    type: Object
  },
  partners: {
    type: Array
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Makeathon', MakeathonSchema);
