'use strict';

(function() {
	// Commissions Controller Spec
	describe('Commissions Controller Tests', function() {
		// Initialize global variables
		var CommissionsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Commissions controller.
			CommissionsController = $controller('CommissionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Commission object fetched from XHR', inject(function(Commissions) {
			// Create sample Commission using the Commissions service
			var sampleCommission = new Commissions({
				name: 'New Commission'
			});

			// Create a sample Commissions array that includes the new Commission
			var sampleCommissions = [sampleCommission];

			// Set GET response
			$httpBackend.expectGET('commissions').respond(sampleCommissions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.commissions).toEqualData(sampleCommissions);
		}));

		it('$scope.findOne() should create an array with one Commission object fetched from XHR using a commissionId URL parameter', inject(function(Commissions) {
			// Define a sample Commission object
			var sampleCommission = new Commissions({
				name: 'New Commission'
			});

			// Set the URL parameter
			$stateParams.commissionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/commissions\/([0-9a-fA-F]{24})$/).respond(sampleCommission);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.commission).toEqualData(sampleCommission);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Commissions) {
			// Create a sample Commission object
			var sampleCommissionPostData = new Commissions({
				name: 'New Commission'
			});

			// Create a sample Commission response
			var sampleCommissionResponse = new Commissions({
				_id: '525cf20451979dea2c000001',
				name: 'New Commission'
			});

			// Fixture mock form input values
			scope.name = 'New Commission';

			// Set POST response
			$httpBackend.expectPOST('commissions', sampleCommissionPostData).respond(sampleCommissionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Commission was created
			expect($location.path()).toBe('/commissions/' + sampleCommissionResponse._id);
		}));

		it('$scope.update() should update a valid Commission', inject(function(Commissions) {
			// Define a sample Commission put data
			var sampleCommissionPutData = new Commissions({
				_id: '525cf20451979dea2c000001',
				name: 'New Commission'
			});

			// Mock Commission in scope
			scope.commission = sampleCommissionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/commissions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/commissions/' + sampleCommissionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid commissionId and remove the Commission from the scope', inject(function(Commissions) {
			// Create new Commission object
			var sampleCommission = new Commissions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Commissions array and include the Commission
			scope.commissions = [sampleCommission];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/commissions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCommission);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.commissions.length).toBe(0);
		}));
	});
}());