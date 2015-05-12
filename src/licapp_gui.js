window.jQuery = window.$ = require("jquery");
var i18n = require("../bower_components/i18next/i18next.js");

var LANG = "Vi" ;

var LicenseController = require("./controllers/license.js") ;

function mainGui(licenseApi){

	i18n.init({ lng: LANG }, function(tr) { 
		var t = tr ;
		
		var licenseController = new LicenseController(licenseApi, t) ;
		licenseController.init(function(){
			licenseController.openGenScreen() ;
		}) ;

		
	});
}

module.exports = mainGui;
