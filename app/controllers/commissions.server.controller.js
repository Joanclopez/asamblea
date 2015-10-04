'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Commission = mongoose.model('Commission'),
	_ = require('lodash');

/**
 * Create a Commission
 */
exports.create = function(req, res) {
	var commission = new Commission(req.body);
	commission.user = req.user;

	commission.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(commission);
		}
	});
};

/**
 * Show the current Commission
 */
exports.read = function(req, res) {
	res.jsonp(req.commission);
};

/**
 * Update a Commission
 */
exports.update = function(req, res) {
	var commission = req.commission ;

	commission = _.extend(commission , req.body);

	commission.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(commission);
		}
	});
};

/**
 * Delete an Commission
 */
exports.delete = function(req, res) {
	var commission = req.commission ;

	commission.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(commission);
		}
	});
};

/**
 * List of Commissions
 */
exports.list = function(req, res) { 
	Commission.find().sort('-created').populate('user', 'displayName').exec(function(err, commissions) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(commissions);
		}
	});
};

/**
 * Commission middleware
 */
exports.commissionByID = function(req, res, next, id) { 
	Commission.findById(id).populate('user', 'displayName').exec(function(err, commission) {
		if (err) return next(err);
		if (! commission) return next(new Error('Failed to load Commission ' + id));
		req.commission = commission ;
		next();
	});
};

/**
 * Commission authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.commission.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
