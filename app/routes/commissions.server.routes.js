'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var commissions = require('../../app/controllers/commissions.server.controller');

	// Commissions Routes
	app.route('/commissions')
		.get(commissions.list)
		.post(users.requiresLogin, commissions.create);

	app.route('/commissions/:commissionId')
		.get(commissions.read)
		.put(users.requiresLogin, commissions.hasAuthorization, commissions.update)
		.delete(users.requiresLogin, commissions.hasAuthorization, commissions.delete);

	// Finish by binding the Commission middleware
	app.param('commissionId', commissions.commissionByID);
};
