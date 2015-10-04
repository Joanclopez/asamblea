'use strict';

// Commissions controller
angular.module('commissions').controller('CommissionsController', ['$scope','$rootScope', '$stateParams', '$location', 'Authentication', 'Commissions',
	function($scope, $rootScope,$stateParams, $location, Authentication, Commissions) {
		$scope.authentication = Authentication;
		$rootScope.toolbar = [
								['h2', 'h3', 'p', 'bold', 'underline','html', 'redo','insertLink', 'insertVideo', 'undo', 'italics', 'ul', 'ol', 'insertImage', 'justifyLeft', 'justifyCenter', 'justifyRight', 'clear','wordcount', 'charcount']
						];

		// Create new Commission
		$scope.create = function() {
			// Create new Commission object
			var commission = new Commissions ({
				name: this.name,
				action: this.action
			});

			// Redirect after save
			commission.$save(function(response) {
				$location.path('commissions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Commission
		$scope.remove = function(commission) {
			if ( commission ) {
				commission.$remove();

				for (var i in $scope.commissions) {
					if ($scope.commissions [i] === commission) {
						$scope.commissions.splice(i, 1);
					}
				}
			} else {
				$scope.commission.$remove(function() {
					$location.path('commissions');
				});
			}
		};

		// Update existing Commission
		$scope.update = function() {
			var commission = $scope.commission;

			commission.$update(function() {
				$location.path('commissions/' + commission._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Commissions
		$scope.find = function() {
			$scope.commissions = Commissions.query();
		};

		// Find existing Commission
		$scope.findOne = function() {
			$scope.commission = Commissions.get({
				commissionId: $stateParams.commissionId
			});
		};
	}
]);
