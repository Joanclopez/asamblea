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




    // Add a suggestion to the list
     $scope.addGeneralSuggestion = function (generalSuggestions,text) {
			// 	console.log('entro');
			if (!generalSuggestions) {
				generalSuggestions=[];
			}
       generalSuggestions.push({
           suggestion: text,
           number: 0
       });
     };

		 $scope.sum=function(suggestion){
			//  console.log(suggestion);
			 suggestion.number=suggestion.number+1;
			//  console.log(suggestion);
		 };
		 $scope.substraction=function(suggestion){
			//  console.log(suggestion);
			 suggestion.number=suggestion.number-1;
		 };

		 $scope.deleteSuggestion=function(suggestion, commission){
			//  console.log(commission.suggestions.indexOf(suggestion));
			 commission.suggestions.splice(commission.suggestions.indexOf(suggestion),1);
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

		// Update existing Commission
		$scope.commissionUpdate = function(commission) {

			Commissions.update({
				commissionId: commission._id
			},commission,function() {
				// $location.path('commissions/' + commission._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);
