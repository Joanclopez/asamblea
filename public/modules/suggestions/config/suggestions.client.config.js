'use strict';

// Configuring the Articles module
angular.module('suggestions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Sugerencias', 'suggestions', '/suggestions',false,['admin']);
	}
]);
