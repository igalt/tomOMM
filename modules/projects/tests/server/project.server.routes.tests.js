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
      username: 'iseif',
      password: 'seif123'
    };

    // Create a new user
    user = new User({
      firstName: 'Seif',
      lastName: 'Ibrahim',
      displayName: 'Seif Ibrahim',
      email: 'seif.ibrahim@test.com',
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
            title: 'Test Project 10',
            main_image: 'https://raw.githubusercontent.com/igalt/tomOMM/master/image_0.png',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tincidunt purus non quam eleifend, quis scelerisque mauris lacinia. Nullam quis libero at sem luctus ultricies. Integer tincidunt in libero et tempor. Morbi ac arcu aliquet lorem fringilla porttitor. Aliquam ut fringilla ligula. Nulla dapibus porta leo. Suspendisse ut elit sed lorem egestas convallis.',
            project_owner: user,
            team: [user, user, user, user],
            looking_for: ['Developer', 'Designer'],
            badges: ['Test Badge'],
            tags: ['Test', 'DEVELOPER', 'test_project'],
            status: ['new_project'],
            followers: [user, user, user, user, user],
            reviews: [
                {
                    user: user,
                    review: "Sed quis mi non magna tincidunt cursus. Ut ac egestas urna. Fusce fringilla erat at magna ultrices, sit amet rhoncus dui tristique. Fusce lobortis tortor ut purus iaculis imperdiet. Aenean ornare ut libero a aliquam. Integer sodales purus porttitor placerat maximus. Proin consectetur ante id lectus rhoncus posuere."
                },
                {
                    user: user,
                    review: "Nullam id erat in erat facilisis euismod. Morbi eros orci, pulvinar in nisi nec, euismod consequat lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Ut ac massa id lorem placerat aliquam at id augue. Mauris ut justo non nisl dignissim lobortis. Nunc eget quam dolor. Nam volutpat viverra interdum. Curabitur tristique purus a interdum vehicula."
                },
                {
                    user: user,
                    review: "Proin iaculis non sapien eget hendrerit. Praesent finibus auctor vestibulum. Vivamus fringilla, ex quis ornare sollicitudin, tellus dolor maximus sapien, quis congue magna velit sagittis felis. Vivamus sagittis sagittis eros at interdum. Curabitur feugiat et orci id condimentum. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus rutrum rutrum mi, at fermentum quam cursus at. Donec elementum nisl in condimentum malesuada. Donec scelerisque eros in sapien molestie tristique. Nullam vehicula luctus lectus, eu posuere libero."
                },
                {
                    user: user,
                    review: "Nam rhoncus cursus velit vitae vehicula. Integer molestie tincidunt purus aliquam consectetur. Sed quis fermentum turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc suscipit sodales nunc nec luctus. Sed maximus auctor erat ac facilisis. Morbi id commodo eros, eu dapibus mi. Aenean rhoncus tristique nisi sagittis lacinia. Curabitur efficitur fermentum molestie. Fusce luctus, mi eu bibendum finibus, orci ex pretium dui, eu sollicitudin orci mi quis ligula. Sed sed elementum nibh, non malesuada justo. Nam vel magna mauris. In justo odio, suscipit luctus facilisis quis, lacinia nec justo. Donec tempor lacus arcu, nec blandit massa scelerisque nec. Nam maximus tempus ligula, placerat accumsan erat facilisis et. Vivamus placerat ante justo, eget mollis mi ullamcorper non."
                },
                {
                    user: user,
                    review: 'Proin vestibulum ipsum nec lorem lacinia, ut auctor ligula eleifend. Suspendisse lacinia quam eget augue suscipit bibendum sed vel sem. Nunc ornare vestibulum massa, vel mollis neque malesuada non. Integer blandit, risus eu accumsan auctor, sapien augue egestas metus, a consectetur ligula massa a orci. Nullam vel dui et velit posuere posuere quis sed arcu. Donec eget tortor lacus. Mauris ac tincidunt velit. ' +
' ' +
'Donec at molestie ipsum. Nunc mauris turpis, sagittis et est a, ultricies egestas nunc. Aenean in lectus fringilla tellus volutpat auctor. Aliquam tempus lectus non egestas lacinia. Vivamus tincidunt vulputate augue eu aliquet. Ut non suscipit nulla. Donec nec ligula tortor. Phasellus in arcu nisl. ' +
' ' +
'Pellentesque sodales vitae massa a viverra. Aenean tristique, mi non porttitor mattis, leo magna congue diam, at dapibus lacus velit at dui. Integer tempus, augue at suscipit accumsan, ante nulla blandit dolor, tempus placerat justo ex vitae dolor. Fusce sed mattis nisl, sit amet pellentesque ex. Donec tempus venenatis tellus non placerat. Nam nec lorem non odio ornare pulvinar eu non ipsum. Aliquam tristique diam id augue vehicula aliquet. Suspendisse posuere ante dolor, tincidunt fringilla elit pretium sit amet. Fusce nec turpis consequat, dictum purus et, faucibus nibh. Sed blandit tempus eros vitae viverra. Vivamus at tellus tortor. Nulla nec tellus vitae nisl auctor iaculis.'
                }
            ],
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
          "username": "iseif",
          "password": "seif123"
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

  // it('should not be able to save an Project if not logged in', function (done) {
  //   agent.post('/api/projects')
  //     .send(project)
  //     .expect(403)
  //     .end(function (projectSaveErr, projectSaveRes) {
  //       // Call the assertion callback
  //       done(projectSaveErr);
  //     });
  // });
  //
  // it('should not be able to save an Project if no title is provided', function (done) {
  //   // Invalidate name field
  //   project.title = '';
  //
  //   agent.post('/api/auth/signin')
  //     .send(credentials)
  //     .expect(200)
  //     .end(function (signinErr, signinRes) {
  //       // Handle signin error
  //       if (signinErr) {
  //         return done(signinErr);
  //       }
  //
  //       // Get the userId
  //       var userId = user.id;
  //
  //       // Save a new Project
  //       agent.post('/api/projects')
  //         .send(project)
  //         .expect(400)
  //         .end(function (projectSaveErr, projectSaveRes) {
  //           // Set message assertion
  //           (projectSaveRes.body.message).should.match('Please fill project Title');
  //
  //           // Handle Project save error
  //           done(projectSaveErr);
  //         });
  //     });
  // });
  //
  // it('should be able to update an Project if signed in', function (done) {
  //   agent.post('/api/auth/signin')
  //     .send(credentials)
  //     .expect(200)
  //     .end(function (signinErr, signinRes) {
  //       // Handle signin error
  //       if (signinErr) {
  //         return done(signinErr);
  //       }
  //
  //       // Get the userId
  //       var userId = user.id;
  //
  //       // Save a new Project
  //       agent.post('/api/projects')
  //         .send(project)
  //         .expect(200)
  //         .end(function (projectSaveErr, projectSaveRes) {
  //           // Handle Project save error
  //           if (projectSaveErr) {
  //             return done(projectSaveErr);
  //           }
  //
  //           // Update Project name
  //           project.title = 'New Project Title';
  //
  //           // Update an existing Project
  //           agent.put('/api/projects/' + projectSaveRes.body._id)
  //             .send(project)
  //             .expect(200)
  //             .end(function (projectUpdateErr, projectUpdateRes) {
  //               // Handle Project update error
  //               if (projectUpdateErr) {
  //                 return done(projectUpdateErr);
  //               }
  //
  //               // Set assertions
  //               (projectUpdateRes.body._id).should.equal(projectSaveRes.body._id);
  //               (projectUpdateRes.body.title).should.match('New Project Title');
  //
  //               // Call the assertion callback
  //               done();
  //             });
  //         });
  //     });
  // });
  //
  // it('should be able to get a list of Projects if not signed in', function (done) {
  //   // Create new Project model instance
  //   var projectObj = new Project(project);
  //
  //   // Save the project
  //   projectObj.save(function () {
  //     // Request Projects
  //     request(app).get('/api/projects')
  //       .end(function (req, res) {
  //         // Set assertion
  //         res.body.should.be.instanceof(Array).and.have.lengthOf(1);
  //
  //         // Call the assertion callback
  //         done();
  //       });
  //
  //   });
  // });
  //
  // it('should be able to get a single Project if not signed in', function (done) {
  //   // Create new Project model instance
  //   var projectObj = new Project(project);
  //
  //   // Save the Project
  //   projectObj.save(function () {
  //     request(app).get('/api/projects/' + projectObj._id)
  //       .end(function (req, res) {
  //         // Set assertion
  //         res.body.should.be.instanceof(Object).and.have.property('title', project.title);
  //
  //         // Call the assertion callback
  //         done();
  //       });
  //   });
  // });
  //
  //   it('should be able to get a Project info in quickView if not signed in', function (done) {
  //       // Create new Project model instance
  //       var projectObj = new Project(project);
  //
  //       // Save the Project
  //       projectObj.save(function () {
  //           request(app).get('/api/projects/quickView/' + projectObj._id)
  //               .end(function (req, res) {
  //                   // Set assertion
  //                   res.body.should.be.instanceof(Object).and.have.property('title', project.title);
  //                   res.body.should.be.instanceof(Object).and.not.have.property('related_challenges');
  //
  //                   // Call the assertion callback
  //                   done();
  //               });
  //       });
  //   });
  //
  // it('should return proper error for single Project with an invalid Id, if not signed in', function (done) {
  //   // test is not a valid mongoose Id
  //   request(app).get('/api/projects/test')
  //     .end(function (req, res) {
  //       // Set assertion
  //       res.body.should.be.instanceof(Object).and.have.property('message', 'Project is invalid');
  //
  //       // Call the assertion callback
  //       done();
  //     });
  // });
  //
  // it('should return proper error for single Project which doesnt exist, if not signed in', function (done) {
  //   // This is a valid mongoose Id but a non-existent Project
  //   request(app).get('/api/projects/559e9cd815f80b4c256a8f41')
  //     .end(function (req, res) {
  //       // Set assertion
  //       res.body.should.be.instanceof(Object).and.have.property('message', 'No Project with that identifier has been found');
  //
  //       // Call the assertion callback
  //       done();
  //     });
  // });
  //
  // it('should be able to delete an Project if signed in', function (done) {
  //   agent.post('/api/auth/signin')
  //     .send(credentials)
  //     .expect(200)
  //     .end(function (signinErr, signinRes) {
  //       // Handle signin error
  //       if (signinErr) {
  //         return done(signinErr);
  //       }
  //
  //       // Get the userId
  //       var userId = user.id;
  //
  //       // Save a new Project
  //       agent.post('/api/projects')
  //         .send(project)
  //         .expect(200)
  //         .end(function (projectSaveErr, projectSaveRes) {
  //           // Handle Project save error
  //           if (projectSaveErr) {
  //             return done(projectSaveErr);
  //           }
  //
  //           // Delete an existing Project
  //           agent.delete('/api/projects/' + projectSaveRes.body._id)
  //             .send(project)
  //             .expect(200)
  //             .end(function (projectDeleteErr, projectDeleteRes) {
  //               // Handle project error error
  //               if (projectDeleteErr) {
  //                 return done(projectDeleteErr);
  //               }
  //
  //               // Set assertions
  //               (projectDeleteRes.body._id).should.equal(projectSaveRes.body._id);
  //
  //               // Call the assertion callback
  //               done();
  //             });
  //         });
  //     });
  // });
  //
  // it('should not be able to delete an Project if not signed in', function (done) {
  //   // Set Project user
  //   project.user = user;
  //
  //   // Create new Project model instance
  //   var projectObj = new Project(project);
  //
  //   // Save the Project
  //   projectObj.save(function () {
  //     // Try deleting Project
  //     request(app).delete('/api/projects/' + projectObj._id)
  //       .expect(403)
  //       .end(function (projectDeleteErr, projectDeleteRes) {
  //         // Set message assertion
  //         (projectDeleteRes.body.message).should.match('User is not authorized');
  //
  //         // Handle Project error error
  //         done(projectDeleteErr);
  //       });
  //
  //   });
  // });

  // afterEach(function (done) {
  //   User.remove().exec(function () {
  //     Project.remove().exec(done);
  //   });
  // });
});
