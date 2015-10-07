'use strict';

//Setting up route
angular.module('suggestions').config(['$stateProvider',
	function($stateProvider) {
		// Suggestions state routing
		$stateProvider.
		state('listSuggestions', {
			url: '/suggestions',
			templateUrl: 'modules/suggestions/views/list-suggestions.client.view.html'
		});
	}
]);
