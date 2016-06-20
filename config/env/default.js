'use strict';

/**
 * Module dependencies.
 */
var winston = require('winston');


module.exports = {
  app: {
    title: 'TOM GLOBAL | 72 Hours to make a better world',
    description: 'TOM GLOBAL | 72 Hours to make a better world',
    keywords: 'TOM GLOBAL | 72 Hours to make a better world',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'dg36r9M#!5t!',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  logo: 'modules/core/client/img/brand/logo.png',
  favicon: 'modules/core/client/img/brand/favicon.ico',
  uploads: {
    profileUpload: {
      dest: 'public/uploads/users/profile/', // Profile upload destination path
      limits: {
        fileSize: 1*1024*1024 // Max file size in bytes (1 MB)
      }
    },
    challengeUpload: {
      source: 'public/uploads/temp/',  // The path/folders needs to be exists on the server
      dest: 'public/uploads/challenge/',
      limits: {
        fileSize: 3*1024*1024 // Max file size in bytes (3 MB)
      }
    },
    makeathonPartnersUpload: {
      source: 'public/uploads/temp/',
      dest: 'public/uploads/makeathonPartners/',  // The path/folders needs to be exists on the server
      limits: {
        fileSize: 3*1024*1024 // Max file size in bytes (3 MB)
      }
    }
  },
  logger: new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({
        filename: 'logger.log',
        level: 'error'
      })
    ]
  }),
  wikiFilePath: 'https://bookoftom.gitbooks.io/the-little-book-of-tom/content/'
  //wikiFilePath: 'book/_book/'
};
