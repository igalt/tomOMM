'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Makeathon = mongoose.model('Makeathon'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, makeathon;

/**
 * Makeathon routes tests
 */
describe('Makeathon CRUD tests', function () {

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

    // Save a user to the test db and create new Makeathon
    user.save(function () {
      makeathon = {
        name: 'Makeathon name'
      };

      done();
    });
  });

  it('should be able to save a Makeathon if logged in', function (done) {
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

        // Save a new Makeathon
        agent.post('/api/makeathons')
          .send(makeathon)
          .expect(200)
          .end(function (makeathonSaveErr, makeathonSaveRes) {
            // Handle Makeathon save error
            if (makeathonSaveErr) {
              return done(makeathonSaveErr);
            }

            // Get a list of Makeathons
            agent.get('/api/makeathons')
              .end(function (makeathonsGetErr, makeathonsGetRes) {
                // Handle Makeathon save error
                if (makeathonsGetErr) {
                  return done(makeathonsGetErr);
                }

                // Get Makeathons list
                var makeathons = makeathonsGetRes.body;

                // Set assertions
                (makeathons[0].user._id).should.equal(userId);
                (makeathons[0].name).should.match('Makeathon name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Makeathon if not logged in', function (done) {
    agent.post('/api/makeathons')
      .send(makeathon)
      .expect(403)
      .end(function (makeathonSaveErr, makeathonSaveRes) {
        // Call the assertion callback
        done(makeathonSaveErr);
      });
  });

  it('should not be able to save an Makeathon if no name is provided', function (done) {
    // Invalidate name field
    makeathon.name = '';

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

        // Save a new Makeathon
        agent.post('/api/makeathons')
          .send(makeathon)
          .expect(400)
          .end(function (makeathonSaveErr, makeathonSaveRes) {
            // Set message assertion
            (makeathonSaveRes.body.message).should.match('Please fill Makeathon name');

            // Handle Makeathon save error
            done(makeathonSaveErr);
          });
      });
  });

  it('should be able to update an Makeathon if signed in', function (done) {
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

        // Save a new Makeathon
        agent.post('/api/makeathons')
          .send(makeathon)
          .expect(200)
          .end(function (makeathonSaveErr, makeathonSaveRes) {
            // Handle Makeathon save error
            if (makeathonSaveErr) {
              return done(makeathonSaveErr);
            }

            // Update Makeathon name
            makeathon.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Makeathon
            agent.put('/api/makeathons/' + makeathonSaveRes.body._id)
              .send(makeathon)
              .expect(200)
              .end(function (makeathonUpdateErr, makeathonUpdateRes) {
                // Handle Makeathon update error
                if (makeathonUpdateErr) {
                  return done(makeathonUpdateErr);
                }

                // Set assertions
                (makeathonUpdateRes.body._id).should.equal(makeathonSaveRes.body._id);
                (makeathonUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Makeathons if not signed in', function (done) {
    // Create new Makeathon model instance
    var makeathonObj = new Makeathon(makeathon);

    // Save the makeathon
    makeathonObj.save(function () {
      // Request Makeathons
      request(app).get('/api/makeathons')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Makeathon if not signed in', function (done) {
    // Create new Makeathon model instance
    var makeathonObj = new Makeathon(makeathon);

    // Save the Makeathon
    makeathonObj.save(function () {
      request(app).get('/api/makeathons/' + makeathonObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', makeathon.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Makeathon with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/makeathons/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Makeathon is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Makeathon which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Makeathon
    request(app).get('/api/makeathons/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Makeathon with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Makeathon if signed in', function (done) {
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

        // Save a new Makeathon
        agent.post('/api/makeathons')
          .send(makeathon)
          .expect(200)
          .end(function (makeathonSaveErr, makeathonSaveRes) {
            // Handle Makeathon save error
            if (makeathonSaveErr) {
              return done(makeathonSaveErr);
            }

            // Delete an existing Makeathon
            agent.delete('/api/makeathons/' + makeathonSaveRes.body._id)
              .send(makeathon)
              .expect(200)
              .end(function (makeathonDeleteErr, makeathonDeleteRes) {
                // Handle makeathon error error
                if (makeathonDeleteErr) {
                  return done(makeathonDeleteErr);
                }

                // Set assertions
                (makeathonDeleteRes.body._id).should.equal(makeathonSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Makeathon if not signed in', function (done) {
    // Set Makeathon user
    makeathon.user = user;

    // Create new Makeathon model instance
    var makeathonObj = new Makeathon(makeathon);

    // Save the Makeathon
    makeathonObj.save(function () {
      // Try deleting Makeathon
      request(app).delete('/api/makeathons/' + makeathonObj._id)
        .expect(403)
        .end(function (makeathonDeleteErr, makeathonDeleteRes) {
          // Set message assertion
          (makeathonDeleteRes.body.message).should.match('User is not authorized');

          // Handle Makeathon error error
          done(makeathonDeleteErr);
        });

    });
  });

  it('should be able to get a single Makeathon that has an orphaned user reference', function (done) {
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

          // Save a new Makeathon
          agent.post('/api/makeathons')
            .send(makeathon)
            .expect(200)
            .end(function (makeathonSaveErr, makeathonSaveRes) {
              // Handle Makeathon save error
              if (makeathonSaveErr) {
                return done(makeathonSaveErr);
              }

              // Set assertions on new Makeathon
              (makeathonSaveRes.body.name).should.equal(makeathon.name);
              should.exist(makeathonSaveRes.body.user);
              should.equal(makeathonSaveRes.body.user._id, orphanId);

              // force the Makeathon to have an orphaned user reference
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

                    // Get the Makeathon
                    agent.get('/api/makeathons/' + makeathonSaveRes.body._id)
                      .expect(200)
                      .end(function (makeathonInfoErr, makeathonInfoRes) {
                        // Handle Makeathon error
                        if (makeathonInfoErr) {
                          return done(makeathonInfoErr);
                        }

                        // Set assertions
                        (makeathonInfoRes.body._id).should.equal(makeathonSaveRes.body._id);
                        (makeathonInfoRes.body.name).should.equal(makeathon.name);
                        should.equal(makeathonInfoRes.body.user, undefined);

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
      Makeathon.remove().exec(done);
    });
  });
});
