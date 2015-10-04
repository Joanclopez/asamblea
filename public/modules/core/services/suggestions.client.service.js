'use strict';

//Suggestions service used to communicate Suggestions REST endpoints
angular.module('core').factory('Suggestions', ['$resource',
	function($resource) {
		return $resource('suggestions/:commission/:table', { commission: '@commission', table:'@table'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
