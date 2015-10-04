'use strict';

//Setting up route
angular.module('commissions').config(['$stateProvider',
	function($stateProvider) {
		// Commissions state routing
		$stateProvider.
		state('listCommissions', {
			url: '/commissions',
			templateUrl: 'modules/commissions/views/list-commissions.client.view.html'
		}).
		state('createCommission', {
			url: '/commissions/create',
			templateUrl: 'modules/commissions/views/create-commission.client.view.html'
		}).
		state('viewCommission', {
			url: '/commissions/:commissionId',
			templateUrl: 'modules/commissions/views/view-commission.client.view.html'
		}).
		state('editCommission', {
			url: '/commissions/:commissionId/edit',
			templateUrl: 'modules/commissions/views/edit-commission.client.view.html'
		});
	}
]);