'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Commission Schema
 */
var CommissionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Commission name',
		trim: true
	},
	action: {
		type: String,
		default: '',
		required: 'Please fill Commission action',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	suggestions:{
		type:Object,
		default:[]
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Commission', CommissionSchema);
