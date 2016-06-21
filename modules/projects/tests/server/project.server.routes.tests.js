'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Project = mongoose.model('Project'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, project;

/**
 * Project routes tests
 */
describe('Project CRUD tests', function () {

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
      firstName: 'Israel',
      lastName: 'Israeli',
      displayName: 'Israel Israeli',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local',
        roles: ['admin']
    });

    // Save a user to the test db and create new Project
    user.save(function (err) {
        if (err) {
            console.log(err);
            return;
        }

        project = new Project({
            title: 'Test Project',
            main_image: 'https://raw.githubusercontent.com/igalt/tomOMM/master/image_0.png',
            description: 'This is a test project',
            project_owner: user,
            team: [user],
            looking_for: ['Developer'],
            badges: ['Test Badge'],
            tags: ['Test', 'DEVELOPER', 'test_project'],
            status: ['new_project'],
            followers: [user],
            spawned_from: [ {spawned_from_type: 'spawned_from_type_test', spawned_from_id: 'spawned_from_type_id'} ],
            media: {
                files: [
                    {title: 'file1', file_type: 'doc', url: 'http://localhost/file1.doc'},
                    {title: 'file2', file_type: 'pdf', url: 'http://localhost/file2.pdf'}
                ],
                images: ['http://localhost/image1.jpg', 'http://localhost/image2.jpg', 'http://localhost/image3.jpg'],
                videos: ['http://youtune.com/video1', 'http://youtune.com/video2'],
                links: [
                    {title: 'My facebook page', link_type: 'facebook', url: 'http://www.facebook.com'},
                    {title: 'My Linkedin profile', link_type: 'linkedin', url: 'http://www.linkedin.com'}
                ]
            }
        });

      done();
    });
  });

  it('should be able to save a Project if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send({
          "username": "username",
          "password": "M3@n.jsI$Aw3$0m3"
      })
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Project
        agent.post('/api/projects')
          .send(project)
          .expect(200)
          .end(function (projectSaveErr, projectSaveRes) {
            // Handle Project save error
            if (projectSaveErr) {
              return done(projectSaveErr);
            }

            // Get a list of Projects
            agent.get('/api/projects')
              .end(function (projectsGetErr, projectsGetRes) {
                // Handle Project save error
                if (projectsGetErr) {
                  return done(projectsGetErr);
                }

                // Get Projects list
                var projects = projectsGetRes.body;

                // Set assertions
                (projects[0].project_owner._id).should.equal(userId);
                (projects[0].title).should.match('Test Project');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Project if not logged in', function (done) {
    agent.post('/api/projects')
      .send(project)
      .expect(403)
      .end(function (projectSaveErr, projectSaveRes) {
        // Call the assertion callback
        done(projectSaveErr);
      });
  });

  it('should not be able to save an Project if no title is provided', function (done) {
    // Invalidate name field
    project.title = '';

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

        // Save a new Project
        agent.post('/api/projects')
          .send(project)
          .expect(400)
          .end(function (projectSaveErr, projectSaveRes) {
            // Set message assertion
            (projectSaveRes.body.message).should.match('Please fill project Title');

            // Handle Project save error
            done(projectSaveErr);
          });
      });
  });

  it('should be able to update an Project if signed in', function (done) {
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

        // Save a new Project
        agent.post('/api/projects')
          .send(project)
          .expect(200)
          .end(function (projectSaveErr, projectSaveRes) {
            // Handle Project save error
            if (projectSaveErr) {
              return done(projectSaveErr);
            }

            // Update Project name
            project.title = 'New Project Title';

            // Update an existing Project
            agent.put('/api/projects/' + projectSaveRes.body._id)
              .send(project)
              .expect(200)
              .end(function (projectUpdateErr, projectUpdateRes) {
                // Handle Project update error
                if (projectUpdateErr) {
                  return done(projectUpdateErr);
                }

                // Set assertions
                (projectUpdateRes.body._id).should.equal(projectSaveRes.body._id);
                (projectUpdateRes.body.title).should.match('New Project Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Projects if not signed in', function (done) {
    // Create new Project model instance
    var projectObj = new Project(project);

    // Save the project
    projectObj.save(function () {
      // Request Projects
      request(app).get('/api/projects')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Project if not signed in', function (done) {
    // Create new Project model instance
    var projectObj = new Project(project);

    // Save the Project
    projectObj.save(function () {
      request(app).get('/api/projects/' + projectObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', project.title);

          // Call the assertion callback
          done();
        });
    });
  });

    it('should be able to get a Project info in quickView if not signed in', function (done) {
        // Create new Project model instance
        var projectObj = new Project(project);

        // Save the Project
        projectObj.save(function () {
            request(app).get('/api/projects/quickView/' + projectObj._id)
                .end(function (req, res) {
                    // Set assertion
                    res.body.should.be.instanceof(Object).and.have.property('title', project.title);
                    res.body.should.be.instanceof(Object).and.not.have.property('related_challenges');

                    // Call the assertion callback
                    done();
                });
        });
    });

  it('should return proper error for single Project with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/projects/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Project is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Project which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Project
    request(app).get('/api/projects/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Project with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Project if signed in', function (done) {
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

        // Save a new Project
        agent.post('/api/projects')
          .send(project)
          .expect(200)
          .end(function (projectSaveErr, projectSaveRes) {
            // Handle Project save error
            if (projectSaveErr) {
              return done(projectSaveErr);
            }

            // Delete an existing Project
            agent.delete('/api/projects/' + projectSaveRes.body._id)
              .send(project)
              .expect(200)
              .end(function (projectDeleteErr, projectDeleteRes) {
                // Handle project error error
                if (projectDeleteErr) {
                  return done(projectDeleteErr);
                }

                // Set assertions
                (projectDeleteRes.body._id).should.equal(projectSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Project if not signed in', function (done) {
    // Set Project user
    project.user = user;

    // Create new Project model instance
    var projectObj = new Project(project);

    // Save the Project
    projectObj.save(function () {
      // Try deleting Project
      request(app).delete('/api/projects/' + projectObj._id)
        .expect(403)
        .end(function (projectDeleteErr, projectDeleteRes) {
          // Set message assertion
          (projectDeleteRes.body.message).should.match('User is not authorized');

          // Handle Project error error
          done(projectDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Project.remove().exec(done);
    });
  });
});
