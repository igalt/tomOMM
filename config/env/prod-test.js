'use strict';

module.exports = {
  //secure: {
  //  ssl: false,
  //  privateKey: './config/sslcerts/key.pem',
  //  certificate: './config/sslcerts/cert.pem'
  //},
  port: process.env.PORT || 3002,
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/tomMMS-test',
    options: {
      user: 'testUser',
      pass: '2v20TMN5z99!'
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  log: {
    // logging with Morgan - https://github.com/expressjs/morgan
    // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
    format: process.env.LOG_FORMAT || 'combined',
    options: {
      // Stream defaults to process.stdout
      // Uncomment/comment to toggle the logging to a log on the file system
      stream: {
        directoryPath: process.env.LOG_DIR_PATH || process.cwd(),
        fileName: process.env.LOG_FILE || 'access.log',
        rotatingLogs: { // for more info on rotating logs - https://github.com/holidayextras/file-stream-rotator#usage
          active: process.env.LOG_ROTATING_ACTIVE === 'true' ? true : false, // activate to use rotating logs 
          fileName: process.env.LOG_ROTATING_FILE || 'access-%DATE%.log', // if rotating logs are active, this fileName setting will be used
          frequency: process.env.LOG_ROTATING_FREQUENCY || 'daily',
          verbose: process.env.LOG_ROTATING_VERBOSE === 'true' ? true : false
        }
      }
    }
  },
  facebook: {
    clientID: process.env.FACEBOOK_ID || '1823130261247531',
    clientSecret: process.env.FACEBOOK_SECRET || '4ca3aba75e3306d9a5b77b875f9e9356',
    callbackURL: 'http://tst.mms.tomglobal.org/api/auth/facebook/callback'
  },
  twitter: {
    clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
    clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
    callbackURL: 'http://tst.mms.tomglobal.org/api/auth/twitter/callback'
  },
  google: {
    clientID: process.env.GOOGLE_ID || '144691593250-uvub7kcfcirhoo4iq8l36bt2lh1joe1m.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'Ojlr0MCQx8WhABhX_muwH-yS',
    callbackURL: 'http://tst.mms.tomglobal.org/api/auth/google/callback'
  },
  linkedin: {
    clientID: process.env.LINKEDIN_ID || '77p35ubymmd2pa',
    clientSecret: process.env.LINKEDIN_SECRET || 'Eydnlifw0iZpj92M',
    callbackURL: 'http://tst.mms.tomglobal.org/api/auth/linkedin/callback'
  },
  github: {
    clientID: process.env.GITHUB_ID || 'APP_ID',
    clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
    callbackURL: 'http://tst.mms.tomglobal.org/api/auth/github/callback'
  },
  paypal: {
    clientID: process.env.PAYPAL_ID || 'CLIENT_ID',
    clientSecret: process.env.PAYPAL_SECRET || 'CLIENT_SECRET',
    callbackURL: 'http://tst.mms.tomglobal.org/api/auth/paypal/callback',
    sandbox: false
  },
  mailer: {
    from: process.env.MAILER_FROM || 'TomMMS@tomglobal.org',
    options: {
      host: process.env.MAILER_SERVICE_PROVIDER || 'smtp.sparkpostmail.com',
      port: process.env.MAILER_SERVICE_PORT || 2525,
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'SMTP_Injection',
        pass: process.env.MAILER_PASSWORD || '79466eddaf22aa340d99be9e1b7e04630478f742'
      }
    }
  },
  seedDB: {
    seed: process.env.MONGO_SEED === 'true' ? true : false,
    options: {
      logResults: process.env.MONGO_SEED_LOG_RESULTS === 'false' ? false : true,
      seedUser: {
        username: process.env.MONGO_SEED_USER_USERNAME || 'user',
        provider: 'local',
        email: process.env.MONGO_SEED_USER_EMAIL || 'user@localhost.com',
        firstName: 'User',
        lastName: 'Local',
        displayName: 'User Local',
        roles: ['user']
      },
      seedAdmin: {
        username: process.env.MONGO_SEED_ADMIN_USERNAME || 'admin',
        provider: 'local',
        email: process.env.MONGO_SEED_ADMIN_EMAIL || 'admin@localhost.com',
        firstName: 'Admin',
        lastName: 'Local',
        displayName: 'Admin Local',
        roles: ['user', 'admin']
      }
    }
  }
};
