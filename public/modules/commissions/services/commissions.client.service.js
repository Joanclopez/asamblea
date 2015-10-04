'use strict';

//Commissions service used to communicate Commissions REST endpoints
angular.module('commissions').factory('Commissions', ['$resource',
	function($resource) {
		return $resource('commissions/:commissionId', { commissionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);