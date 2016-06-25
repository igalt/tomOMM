'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  async = require('async'),
  nodemailer = require('nodemailer'),
  sparkPostTransport = require('nodemailer-smtp-transport'),
  elasticsearchaccessor = require('../../../../config/lib/elasticsearchaccessor'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

var logger = config.logger;
var smtpTransport = nodemailer.createTransport(sparkPostTransport(config.mailer.options));

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null,
    includeHeader: true
  });
};

exports.getSearchResults = function(req,res) {
  var results;
  elasticsearchaccessor.searchAll("first").then(function(value) {console.log(results); results = value; });
  return res.status(200).send({message: results});
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

/**
 * Send confirmation mail
 */
exports.sendEmail = function (req, res) {

  //console.log('sendEmail req.body: ',req.body);

  // Init Variables
  var mailData = req.body;
  var message = null;

  async.waterfall([

    function (done) {
      var email = mailData.mailTo;

      User.findOne({
        email: email
      }).exec(function (err, user) {
        if (err || !user) {
          user = { displayName: '' };
          user.displayName = mailData.mailTo.split('@')[0];
          done(err, user);
        }
        done(err, user);
      });

    },
    function (user, done) {
      res.render('modules/core/server/templates/send-email', {
        name: mailData.name? mailData.name : user.displayName,
        appName: config.app.title,
        mailContent: mailData.content
      }, function (err, emailHTML) {
        done(err, emailHTML);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, done) {
      var mailOptions = {
        to: mailData.mailTo,
        from: config.mailer.from,
        subject: mailData.subject,
        html: mailData.html ? mailData.html : emailHTML
      };

      smtpTransport.sendMail(mailOptions, function (err) {
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) {
      return res.status(400).send({
        message: 'Error sending email',
        code: err.code
      });
    } else return res.status(200).send({
      message: 'Email sent'
    });
  });
};

/**
 * Print msg to logger
 */
exports.printToLog = function (req, res) {
  if (!req.body) {
    return res.status(400).send({
      message: 'Error printing to logger'
    });
  }
  logger.log(req.body.level, req.body.msg);
  return res.status(200).send({
    message: 'Message printed to logger'
  });
};

/**
 * Change logger level
 */
exports.changeLoggerLevel = function (req, res) {
  if (!req.body) {
    return res.status(400).send({
      message: 'Error changing logger level'
    });
  }
  logger.transports.file.level = (req.body.flag)? 'info' : 'error';
  console.log('logger.transports.file.level now is: ',logger.transports.file.level);
  return res.status(200).send({
    message: 'Logger level changed to '+ logger.transports.file.level
  });
};
