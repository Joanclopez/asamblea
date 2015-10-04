'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Suggestion Schema
 */
var SuggestionSchema = new Schema({
	suggestions: {
		type: String,
		default: '',
		required: 'Please fill Suggestion name',
		trim: true
	},
	table: {
		type: Number,
		default: '',
		required: 'Please fill Suggestion name',
		trim: true
	},
	commission: {
		type: Schema.ObjectId,
		ref: 'Commission'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Suggestion', SuggestionSchema);
