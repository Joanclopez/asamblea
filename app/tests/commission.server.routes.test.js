'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Commission = mongoose.model('Commission'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, commission;

/**
 * Commission routes tests
 */
describe('Commission CRUD tests', function() {
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

		// Save a user to the test db and create new Commission
		user.save(function() {
			commission = {
				name: 'Commission Name'
			};

			done();
		});
	});

	it('should be able to save Commission instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Commission
				agent.post('/commissions')
					.send(commission)
					.expect(200)
					.end(function(commissionSaveErr, commissionSaveRes) {
						// Handle Commission save error
						if (commissionSaveErr) done(commissionSaveErr);

						// Get a list of Commissions
						agent.get('/commissions')
							.end(function(commissionsGetErr, commissionsGetRes) {
								// Handle Commission save error
								if (commissionsGetErr) done(commissionsGetErr);

								// Get Commissions list
								var commissions = commissionsGetRes.body;

								// Set assertions
								(commissions[0].user._id).should.equal(userId);
								(commissions[0].name).should.match('Commission Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Commission instance if not logged in', function(done) {
		agent.post('/commissions')
			.send(commission)
			.expect(401)
			.end(function(commissionSaveErr, commissionSaveRes) {
				// Call the assertion callback
				done(commissionSaveErr);
			});
	});

	it('should not be able to save Commission instance if no name is provided', function(done) {
		// Invalidate name field
		commission.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Commission
				agent.post('/commissions')
					.send(commission)
					.expect(400)
					.end(function(commissionSaveErr, commissionSaveRes) {
						// Set message assertion
						(commissionSaveRes.body.message).should.match('Please fill Commission name');
						
						// Handle Commission save error
						done(commissionSaveErr);
					});
			});
	});

	it('should be able to update Commission instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Commission
				agent.post('/commissions')
					.send(commission)
					.expect(200)
					.end(function(commissionSaveErr, commissionSaveRes) {
						// Handle Commission save error
						if (commissionSaveErr) done(commissionSaveErr);

						// Update Commission name
						commission.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Commission
						agent.put('/commissions/' + commissionSaveRes.body._id)
							.send(commission)
							.expect(200)
							.end(function(commissionUpdateErr, commissionUpdateRes) {
								// Handle Commission update error
								if (commissionUpdateErr) done(commissionUpdateErr);

								// Set assertions
								(commissionUpdateRes.body._id).should.equal(commissionSaveRes.body._id);
								(commissionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Commissions if not signed in', function(done) {
		// Create new Commission model instance
		var commissionObj = new Commission(commission);

		// Save the Commission
		commissionObj.save(function() {
			// Request Commissions
			request(app).get('/commissions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Commission if not signed in', function(done) {
		// Create new Commission model instance
		var commissionObj = new Commission(commission);

		// Save the Commission
		commissionObj.save(function() {
			request(app).get('/commissions/' + commissionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', commission.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Commission instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Commission
				agent.post('/commissions')
					.send(commission)
					.expect(200)
					.end(function(commissionSaveErr, commissionSaveRes) {
						// Handle Commission save error
						if (commissionSaveErr) done(commissionSaveErr);

						// Delete existing Commission
						agent.delete('/commissions/' + commissionSaveRes.body._id)
							.send(commission)
							.expect(200)
							.end(function(commissionDeleteErr, commissionDeleteRes) {
								// Handle Commission error error
								if (commissionDeleteErr) done(commissionDeleteErr);

								// Set assertions
								(commissionDeleteRes.body._id).should.equal(commissionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Commission instance if not signed in', function(done) {
		// Set Commission user 
		commission.user = user;

		// Create new Commission model instance
		var commissionObj = new Commission(commission);

		// Save the Commission
		commissionObj.save(function() {
			// Try deleting Commission
			request(app).delete('/commissions/' + commissionObj._id)
			.expect(401)
			.end(function(commissionDeleteErr, commissionDeleteRes) {
				// Set message assertion
				(commissionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Commission error error
				done(commissionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Commission.remove().exec();
		done();
	});
});