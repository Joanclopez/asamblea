'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var suggestions = require('../../app/controllers/suggestions.server.controller');
	var commissions = require('../../app/controllers/commissions.server.controller');


	// Suggestions Routes
	app.route('/suggestions')
		.get(suggestions.list)
		.post(users.requiresLogin, suggestions.create);

	app.route('/suggestions/:commissionId/:table')
		.get(suggestions.suggestionByCommissionTable,suggestions.read)
		.put(users.requiresLogin,suggestions.suggestionByCommissionTable, suggestions.update)
		.delete(users.requiresLogin, suggestions.hasAuthorization, suggestions.delete);

	// Finish by binding the Suggestion middleware
	app.param('commissionId', commissions.commissionByID);
	app.param('table', suggestions.table);

};
