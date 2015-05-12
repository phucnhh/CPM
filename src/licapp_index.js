var path = require("path");
var util = require('util') ;
var gui = require('nw.gui') ;
var LicenseApi = require("./api/license/license") ;
var i18n = require("i18next");
var async = require("async");

var APP_NAME = "CPM";
var LANG = "Vi" ;

var licenseApi;
var t;

//FIXME in production log to a file and display friendly message to the user to fill bug report
process.on("uncaughtException", function(e) { console.log(e); });

function _init(callback){

	async.parallel([
		_initI18n,
		_initApii
	], callback);
}

function _initI18n(callback){
	i18n.init({ lng: LANG }, function(tr) {
		t = tr ;
		callback() ;
	});
}

function _initApi(callback){
	licenseApi = new LicenseApi() ;
	callback() ;
}


function main(){
	_init(function(err){
		if(err){
			return alert("Unexpected error "+err) ;
		}

		gui.Window.get().show() ;

		mainGui(licenseApi, t) ;
	});



}
