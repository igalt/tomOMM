'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Registration = mongoose.model('Registration'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, registration;

/**
 * Registration routes tests
 */
describe('Registration CRUD tests', function () {

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

    // Save a user to the test db and create new Registration
    user.save(function () {
      registration = {
        name: 'Registration name'
      };

      done();
    });
  });

  it('should be able to save a Registration if logged in', function (done) {
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

        // Save a new Registration
        agent.post('/api/registrations')
          .send(registration)
          .expect(200)
          .end(function (registrationSaveErr, registrationSaveRes) {
            // Handle Registration save error
            if (registrationSaveErr) {
              return done(registrationSaveErr);
            }

            // Get a list of Registrations
            agent.get('/api/registrations')
              .end(function (registrationsGetErr, registrationsGetRes) {
                // Handle Registration save error
                if (registrationsGetErr) {
                  return done(registrationsGetErr);
                }

                // Get Registrations list
                var registrations = registrationsGetRes.body;

                // Set assertions
                (registrations[0].user._id).should.equal(userId);
                (registrations[0].name).should.match('Registration name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Registration if not logged in', function (done) {
    agent.post('/api/registrations')
      .send(registration)
      .expect(403)
      .end(function (registrationSaveErr, registrationSaveRes) {
        // Call the assertion callback
        done(registrationSaveErr);
      });
  });

  it('should not be able to save an Registration if no name is provided', function (done) {
    // Invalidate name field
    registration.name = '';

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

        // Save a new Registration
        agent.post('/api/registrations')
          .send(registration)
          .expect(400)
          .end(function (registrationSaveErr, registrationSaveRes) {
            // Set message assertion
            (registrationSaveRes.body.message).should.match('Please fill Registration name');

            // Handle Registration save error
            done(registrationSaveErr);
          });
      });
  });

  it('should be able to update an Registration if signed in', function (done) {
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

        // Save a new Registration
        agent.post('/api/registrations')
          .send(registration)
          .expect(200)
          .end(function (registrationSaveErr, registrationSaveRes) {
            // Handle Registration save error
            if (registrationSaveErr) {
              return done(registrationSaveErr);
            }

            // Update Registration name
            registration.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Registration
            agent.put('/api/registrations/' + registrationSaveRes.body._id)
              .send(registration)
              .expect(200)
              .end(function (registrationUpdateErr, registrationUpdateRes) {
                // Handle Registration update error
                if (registrationUpdateErr) {
                  return done(registrationUpdateErr);
                }

                // Set assertions
                (registrationUpdateRes.body._id).should.equal(registrationSaveRes.body._id);
                (registrationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Registrations if not signed in', function (done) {
    // Create new Registration model instance
    var registrationObj = new Registration(registration);

    // Save the registration
    registrationObj.save(function () {
      // Request Registrations
      request(app).get('/api/registrations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Registration if not signed in', function (done) {
    // Create new Registration model instance
    var registrationObj = new Registration(registration);

    // Save the Registration
    registrationObj.save(function () {
      request(app).get('/api/registrations/' + registrationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', registration.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Registration with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/registrations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Registration is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Registration which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Registration
    request(app).get('/api/registrations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Registration with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Registration if signed in', function (done) {
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

        // Save a new Registration
        agent.post('/api/registrations')
          .send(registration)
          .expect(200)
          .end(function (registrationSaveErr, registrationSaveRes) {
            // Handle Registration save error
            if (registrationSaveErr) {
              return done(registrationSaveErr);
            }

            // Delete an existing Registration
            agent.delete('/api/registrations/' + registrationSaveRes.body._id)
              .send(registration)
              .expect(200)
              .end(function (registrationDeleteErr, registrationDeleteRes) {
                // Handle registration error error
                if (registrationDeleteErr) {
                  return done(registrationDeleteErr);
                }

                // Set assertions
                (registrationDeleteRes.body._id).should.equal(registrationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Registration if not signed in', function (done) {
    // Set Registration user
    registration.user = user;

    // Create new Registration model instance
    var registrationObj = new Registration(registration);

    // Save the Registration
    registrationObj.save(function () {
      // Try deleting Registration
      request(app).delete('/api/registrations/' + registrationObj._id)
        .expect(403)
        .end(function (registrationDeleteErr, registrationDeleteRes) {
          // Set message assertion
          (registrationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Registration error error
          done(registrationDeleteErr);
        });

    });
  });

  it('should be able to get a single Registration that has an orphaned user reference', function (done) {
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

          // Save a new Registration
          agent.post('/api/registrations')
            .send(registration)
            .expect(200)
            .end(function (registrationSaveErr, registrationSaveRes) {
              // Handle Registration save error
              if (registrationSaveErr) {
                return done(registrationSaveErr);
              }

              // Set assertions on new Registration
              (registrationSaveRes.body.name).should.equal(registration.name);
              should.exist(registrationSaveRes.body.user);
              should.equal(registrationSaveRes.body.user._id, orphanId);

              // force the Registration to have an orphaned user reference
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

                    // Get the Registration
                    agent.get('/api/registrations/' + registrationSaveRes.body._id)
                      .expect(200)
                      .end(function (registrationInfoErr, registrationInfoRes) {
                        // Handle Registration error
                        if (registrationInfoErr) {
                          return done(registrationInfoErr);
                        }

                        // Set assertions
                        (registrationInfoRes.body._id).should.equal(registrationSaveRes.body._id);
                        (registrationInfoRes.body.name).should.equal(registration.name);
                        should.equal(registrationInfoRes.body.user, undefined);

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
      Registration.remove().exec(done);
    });
  });
});
