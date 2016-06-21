'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Project = mongoose.model('Project');

/**
 * Globals
 */
var user, project;

/**
 * Unit tests
 */
describe('Project Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Israel',
      lastName: 'Israeli',
      displayName: 'Israel Israeli',
      email: 'test@test.com',
      username: 'israeli',
      password: 'p@ssw0rd'
    });

    user.save(function() {
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

  describe('Save method tests', function() {
    it('should be able to save without problems when everything is okay', function(done) {
      this.timeout(0);
      return project.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without title', function(done) {
      project.title = '';

      return project.save(function(err) {
        should.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save with a non supported role', function(done) {
      project.looking_for = ['BAD_ROLE'];

      return project.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Project.remove().exec(function(){
      User.remove().exec(function(){
        done();
      });
    });
  });
});
