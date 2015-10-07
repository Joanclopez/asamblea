'use strict';

// Suggestions controller
angular.module('suggestions').controller('SuggestionsController', ['$scope','$rootScope', '$stateParams', '$location', 'Authentication', 'Suggestions','Commissions',
	function($scope, $rootScope,$stateParams, $location, Authentication, Suggestions,Commissions) {
		$scope.authentication = Authentication;
		$rootScope.toolbar = [
								['h2', 'h3', 'p', 'bold', 'underline','html', 'redo','insertLink', 'insertVideo', 'undo', 'italics', 'ul', 'ol', 'insertImage', 'justifyLeft', 'justifyCenter', 'justifyRight', 'clear','wordcount', 'charcount']
						];


		// Find a list of Commissions
		$scope.findCommissions = function() {
			$scope.commissions = Commissions.query(function(response){
				$scope.findSuggestions();
			});
		};
		// Create new Suggestion
		$scope.create = function() {
			// Create new Suggestion object
			var suggestion = new Suggestions ({
				name: this.name,
				action: this.action
			});

			// Redirect after save
			suggestion.$save(function(response) {
				$location.path('suggestions/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Suggestion
		$scope.remove = function(suggestion) {
			if ( suggestion ) {
				suggestion.$remove();

				for (var i in $scope.suggestions) {
					if ($scope.suggestions [i] === suggestion) {
						$scope.suggestions.splice(i, 1);
					}
				}
			} else {
				$scope.suggestion.$remove(function() {
					$location.path('suggestions');
				});
			}
		};

		// Update existing Suggestion
		$scope.update = function() {
			var suggestion = $scope.suggestion;

			suggestion.$update(function() {
				$location.path('suggestions/' + suggestion._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Suggestions
		$scope.findSuggestions = function() {
			$scope.suggestions = Suggestions.query();
		};

		// Find existing Suggestion
		$scope.findOne = function() {
			$scope.suggestion = Suggestions.get({
				suggestionId: $stateParams.suggestionId
			});
		};
	}
]);
