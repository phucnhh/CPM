var fs = require("fs") ;
var path = require("path") ;
var os = require("os") ;

/**
 * Platforms utils function
 */
var Platforms = {
	
	/**
	 * Get the application data directory of the user
	 * 		For example, on windows XP : C:\Documents and Settings\user\Application Data
	 * 					 on Linux : /home/user
	 * 
	 */
	getUserAppDataDir : function(){
		if(process.platform === "win32"){
			return process.env.APPDATA ;
		}else if(process.platform === "linux"){
			return process.env.HOME ;
		}else {
			throw "Platform "+process.platform+" is not supported" ;
		}
	},
	
	/**
	 * Create the application data dir if not exists
	 * 
	 * The directory is created in the user application data directory (eg C:\Documents and Settings\user\Application Data on Windows XP)
	 * 
	 * @param appName {string} the name of the application directory to create
	 * @param callback {function(err, createdDir)} callback called after the creation is done
	 */
	createAppDataDirIfNotExists : function(appName, callback){
		if(process.platform === "linux"){
			appName = "."+appName ;
		}
		var dirPath = this.getUserAppDataDir()+path.sep+appName ;
		fs.exists(dirPath, function(exists){
			if(exists){
				callback(null, dirPath) ;
			}else{
				fs.mkdir(dirPath, function(err){
					callback(err, dirPath) ;
				}) ;
			}
		}) ;
	},
	
	getOsName : function(){
		return os.type() ;
	},
	
	getOsVersion : function(){
		return os.release() ;
	}
};


module.exports = Platforms ;
