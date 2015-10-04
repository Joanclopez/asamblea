'use strict';

// Configuring the Articles module
angular.module('commissions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Comisiones', 'commissions', 'dropdown', '/commissions(/create)?');
		Menus.addSubMenuItem('topbar', 'commissions', 'Listar Comisiones', 'commissions');
		Menus.addSubMenuItem('topbar', 'commissions', 'Nueva Comision', 'commissions/create');
	}
]);
