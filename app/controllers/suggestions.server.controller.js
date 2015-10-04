'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Suggestion = mongoose.model('Suggestion'),
	Commission = mongoose.model('Commission'),
	_ = require('lodash');

/**
 * Create a Suggestion
 */
exports.create = function(req, res) {
	console.log(req.body);
	var suggestion = new Suggestion(req.body);
	suggestion.user = req.user;

	suggestion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(suggestion);
		}
	});
};

/**
 * Show the current Suggestion
 */
exports.read = function(req, res) {
		res.jsonp(req.suggestion);
};

/**
 * Show the current Suggestion
 */
exports.suggestionByCommissionTable = function(req, res,next) {
	Suggestion.findOne({$and:[
			{'commission':req.commission._id},
			{'table':req.table}
		]}).populate('user', 'displayName').exec(function(err, suggestion) {
		if (err) return next(err);
		if (! suggestion) return next(new Error('Failed to load Suggestion '));
		req.suggestion = suggestion ;
		next();
	});
};

/**
 * Update a Suggestion
 */
exports.update = function(req, res) {
	var suggestion = req.suggestion ;
console.log(req.suggestion);
	suggestion = _.extend(suggestion , req.body);

	suggestion.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(suggestion);
		}
	});
};

/**
 * Delete an Suggestion
 */
exports.delete = function(req, res) {
	var suggestion = req.suggestion ;

	suggestion.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(suggestion);
		}
	});
};

/**
 * List of Suggestions
 */
exports.list = function(req, res) {
	Suggestion.find().sort('-created').populate('user', 'displayName').exec(function(err, suggestions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(suggestions);
		}
	});
};

/**
 * Suggestion middleware
 */
exports.suggestionByID = function(req, res, next, id) {
	Suggestion.findById(id).populate('user', 'displayName').exec(function(err, suggestion) {
		if (err) return next(err);
		if (! suggestion) return next(new Error('Failed to load Suggestion ' + id));
		req.suggestion = suggestion ;
		next();
	});
};

/**
 * table middleware
 */
exports.table = function(req, res, next, table) {
		req.table = table ;
		next();

};

/**
 * Suggestion authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.suggestion.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
