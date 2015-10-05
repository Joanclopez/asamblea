'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Commissions','Suggestions','$http','$rootScope',
	function($scope, Authentication,Commissions,Suggestions,$http,$rootScope) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$rootScope.toolbar = [
								['h2', 'h3', 'p', 'bold', 'underline','html', 'redo','insertLink', 'insertVideo', 'undo', 'italics', 'ul', 'ol', 'insertImage', 'justifyLeft', 'justifyCenter', 'justifyRight', 'clear','wordcount', 'charcount']
						];


		// Find a list of Commissions
		$scope.find = function() {
			$scope.commissions = Commissions.query();
		};

		// Create new Suggestion
		$scope.createSuggestion = function(commission,table,suggestions) {
			if (!table) {
				$scope.error='Selecciona una mesa';
				return;
			}
			// Create new Suggestion object
			var suggestion = {
				commission:commission,
				table:table,
				suggestions:suggestions
			};
			$http.post('/suggestions', suggestion).success(function(){
				$scope.success=true;
				$scope.error=false;
				$scope.findOne(commission);
			}).error(function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

		};
		// Find existing Suggestion
		$scope.findOne = function(commission) {
			$scope.exists=false;
			$scope.success=false;
			$scope.error=false;
			console.log($scope.table);
			$scope.suggestion = Suggestions.get({
				commission:commission,
				table: $scope.table
			},function(suggestion){
				console.log(suggestion);
				$scope.exists=true;
			});
		};

		// Update existing Suggestion
		$scope.suggestionUpdate = function() {
			var suggestion = $scope.suggestion;
			$scope.success=false;
			$scope.error=false;
			suggestion.$update(function() {
				$scope.success=true;
				// $location.path('suggestions/' + suggestion._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);
