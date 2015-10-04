'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Suggestion = mongoose.model('Suggestion'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, suggestion;

/**
 * Suggestion routes tests
 */
describe('Suggestion CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
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

		// Save a user to the test db and create new Suggestion
		user.save(function() {
			suggestion = {
				name: 'Suggestion Name'
			};

			done();
		});
	});

	it('should be able to save Suggestion instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Suggestion
				agent.post('/suggestions')
					.send(suggestion)
					.expect(200)
					.end(function(suggestionSaveErr, suggestionSaveRes) {
						// Handle Suggestion save error
						if (suggestionSaveErr) done(suggestionSaveErr);

						// Get a list of Suggestions
						agent.get('/suggestions')
							.end(function(suggestionsGetErr, suggestionsGetRes) {
								// Handle Suggestion save error
								if (suggestionsGetErr) done(suggestionsGetErr);

								// Get Suggestions list
								var suggestions = suggestionsGetRes.body;

								// Set assertions
								(suggestions[0].user._id).should.equal(userId);
								(suggestions[0].name).should.match('Suggestion Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Suggestion instance if not logged in', function(done) {
		agent.post('/suggestions')
			.send(suggestion)
			.expect(401)
			.end(function(suggestionSaveErr, suggestionSaveRes) {
				// Call the assertion callback
				done(suggestionSaveErr);
			});
	});

	it('should not be able to save Suggestion instance if no name is provided', function(done) {
		// Invalidate name field
		suggestion.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Suggestion
				agent.post('/suggestions')
					.send(suggestion)
					.expect(400)
					.end(function(suggestionSaveErr, suggestionSaveRes) {
						// Set message assertion
						(suggestionSaveRes.body.message).should.match('Please fill Suggestion name');
						
						// Handle Suggestion save error
						done(suggestionSaveErr);
					});
			});
	});

	it('should be able to update Suggestion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Suggestion
				agent.post('/suggestions')
					.send(suggestion)
					.expect(200)
					.end(function(suggestionSaveErr, suggestionSaveRes) {
						// Handle Suggestion save error
						if (suggestionSaveErr) done(suggestionSaveErr);

						// Update Suggestion name
						suggestion.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Suggestion
						agent.put('/suggestions/' + suggestionSaveRes.body._id)
							.send(suggestion)
							.expect(200)
							.end(function(suggestionUpdateErr, suggestionUpdateRes) {
								// Handle Suggestion update error
								if (suggestionUpdateErr) done(suggestionUpdateErr);

								// Set assertions
								(suggestionUpdateRes.body._id).should.equal(suggestionSaveRes.body._id);
								(suggestionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Suggestions if not signed in', function(done) {
		// Create new Suggestion model instance
		var suggestionObj = new Suggestion(suggestion);

		// Save the Suggestion
		suggestionObj.save(function() {
			// Request Suggestions
			request(app).get('/suggestions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Suggestion if not signed in', function(done) {
		// Create new Suggestion model instance
		var suggestionObj = new Suggestion(suggestion);

		// Save the Suggestion
		suggestionObj.save(function() {
			request(app).get('/suggestions/' + suggestionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', suggestion.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Suggestion instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Suggestion
				agent.post('/suggestions')
					.send(suggestion)
					.expect(200)
					.end(function(suggestionSaveErr, suggestionSaveRes) {
						// Handle Suggestion save error
						if (suggestionSaveErr) done(suggestionSaveErr);

						// Delete existing Suggestion
						agent.delete('/suggestions/' + suggestionSaveRes.body._id)
							.send(suggestion)
							.expect(200)
							.end(function(suggestionDeleteErr, suggestionDeleteRes) {
								// Handle Suggestion error error
								if (suggestionDeleteErr) done(suggestionDeleteErr);

								// Set assertions
								(suggestionDeleteRes.body._id).should.equal(suggestionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Suggestion instance if not signed in', function(done) {
		// Set Suggestion user 
		suggestion.user = user;

		// Create new Suggestion model instance
		var suggestionObj = new Suggestion(suggestion);

		// Save the Suggestion
		suggestionObj.save(function() {
			// Try deleting Suggestion
			request(app).delete('/suggestions/' + suggestionObj._id)
			.expect(401)
			.end(function(suggestionDeleteErr, suggestionDeleteRes) {
				// Set message assertion
				(suggestionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Suggestion error error
				done(suggestionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Suggestion.remove().exec();
		done();
	});
});