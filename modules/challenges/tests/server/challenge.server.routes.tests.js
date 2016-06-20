'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Challenge = mongoose.model('Challenge'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, challenge;

/**
 * Challenge routes tests
 */
describe('Challenge CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Challenge
    user.save(function () {
      challenge = {
        name: 'Challenge name'
      };

      done();
    });
  });

  it('should be able to save a Challenge if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Challenge
        agent.post('/api/challenges')
          .send(challenge)
          .expect(200)
          .end(function (challengeSaveErr, challengeSaveRes) {
            // Handle Challenge save error
            if (challengeSaveErr) {
              return done(challengeSaveErr);
            }

            // Get a list of Challenges
            agent.get('/api/challenges')
              .end(function (challengesGetErr, challengesGetRes) {
                // Handle Challenge save error
                if (challengesGetErr) {
                  return done(challengesGetErr);
                }

                // Get Challenges list
                var challenges = challengesGetRes.body;

                // Set assertions
                (challenges[0].user._id).should.equal(userId);
                (challenges[0].name).should.match('Challenge name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Challenge if not logged in', function (done) {
    agent.post('/api/challenges')
      .send(challenge)
      .expect(403)
      .end(function (challengeSaveErr, challengeSaveRes) {
        // Call the assertion callback
        done(challengeSaveErr);
      });
  });

  it('should not be able to save an Challenge if no name is provided', function (done) {
    // Invalidate name field
    challenge.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Challenge
        agent.post('/api/challenges')
          .send(challenge)
          .expect(400)
          .end(function (challengeSaveErr, challengeSaveRes) {
            // Set message assertion
            (challengeSaveRes.body.message).should.match('Please fill Challenge name');

            // Handle Challenge save error
            done(challengeSaveErr);
          });
      });
  });

  it('should be able to update an Challenge if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Challenge
        agent.post('/api/challenges')
          .send(challenge)
          .expect(200)
          .end(function (challengeSaveErr, challengeSaveRes) {
            // Handle Challenge save error
            if (challengeSaveErr) {
              return done(challengeSaveErr);
            }

            // Update Challenge name
            challenge.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Challenge
            agent.put('/api/challenges/' + challengeSaveRes.body._id)
              .send(challenge)
              .expect(200)
              .end(function (challengeUpdateErr, challengeUpdateRes) {
                // Handle Challenge update error
                if (challengeUpdateErr) {
                  return done(challengeUpdateErr);
                }

                // Set assertions
                (challengeUpdateRes.body._id).should.equal(challengeSaveRes.body._id);
                (challengeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Challenges if not signed in', function (done) {
    // Create new Challenge model instance
    var challengeObj = new Challenge(challenge);

    // Save the challenge
    challengeObj.save(function () {
      // Request Challenges
      request(app).get('/api/challenges')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Challenge if not signed in', function (done) {
    // Create new Challenge model instance
    var challengeObj = new Challenge(challenge);

    // Save the Challenge
    challengeObj.save(function () {
      request(app).get('/api/challenges/' + challengeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', challenge.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Challenge with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/challenges/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Challenge is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Challenge which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Challenge
    request(app).get('/api/challenges/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Challenge with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Challenge if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Challenge
        agent.post('/api/challenges')
          .send(challenge)
          .expect(200)
          .end(function (challengeSaveErr, challengeSaveRes) {
            // Handle Challenge save error
            if (challengeSaveErr) {
              return done(challengeSaveErr);
            }

            // Delete an existing Challenge
            agent.delete('/api/challenges/' + challengeSaveRes.body._id)
              .send(challenge)
              .expect(200)
              .end(function (challengeDeleteErr, challengeDeleteRes) {
                // Handle challenge error error
                if (challengeDeleteErr) {
                  return done(challengeDeleteErr);
                }

                // Set assertions
                (challengeDeleteRes.body._id).should.equal(challengeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Challenge if not signed in', function (done) {
    // Set Challenge user
    challenge.user = user;

    // Create new Challenge model instance
    var challengeObj = new Challenge(challenge);

    // Save the Challenge
    challengeObj.save(function () {
      // Try deleting Challenge
      request(app).delete('/api/challenges/' + challengeObj._id)
        .expect(403)
        .end(function (challengeDeleteErr, challengeDeleteRes) {
          // Set message assertion
          (challengeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Challenge error error
          done(challengeDeleteErr);
        });

    });
  });

  it('should be able to get a single Challenge that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Challenge
          agent.post('/api/challenges')
            .send(challenge)
            .expect(200)
            .end(function (challengeSaveErr, challengeSaveRes) {
              // Handle Challenge save error
              if (challengeSaveErr) {
                return done(challengeSaveErr);
              }

              // Set assertions on new Challenge
              (challengeSaveRes.body.name).should.equal(challenge.name);
              should.exist(challengeSaveRes.body.user);
              should.equal(challengeSaveRes.body.user._id, orphanId);

              // force the Challenge to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Challenge
                    agent.get('/api/challenges/' + challengeSaveRes.body._id)
                      .expect(200)
                      .end(function (challengeInfoErr, challengeInfoRes) {
                        // Handle Challenge error
                        if (challengeInfoErr) {
                          return done(challengeInfoErr);
                        }

                        // Set assertions
                        (challengeInfoRes.body._id).should.equal(challengeSaveRes.body._id);
                        (challengeInfoRes.body.name).should.equal(challenge.name);
                        should.equal(challengeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Challenge.remove().exec(done);
    });
  });
});
