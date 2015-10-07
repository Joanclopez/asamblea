'use strict';

//Suggestions service used to communicate Suggestions REST endpoints
angular.module('suggestions').factory('Suggestions', ['$resource',
	function($resource) {
		return $resource('suggestions/:suggestionId', { suggestionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
