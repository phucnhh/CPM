var Db = require("./database/db.js") ;
var platforms = require("./utils/platforms.js") ;
var path = require("path") ;
var fs = require("fs-extra") ;
var crypt = require('crypto');
var async = require('async');
var CODES = require("../common/Codes.js") ;
var csv = require("csv");
var mime = require("mime");
var XLS = require('xlsjs');
var XLSX = require('xlsx');
var iconv = require('iconv-lite');
var jschardet = require("jschardet");
var _ = require("underscore");
var moment = require("moment");


function Api(dataDir, dbCustomersFile, dbSearches){
	var _self = this;
	this.dataDir = dataDir
	this.db = new Db(dataDir+path.sep+dbCustomersFile);
    this.dbSearches = new Db(dataDir+path.sep+dbSearches);



	this.backupDb = function(outFile, callback){
		fs.copy(dataDir+path.sep+dbCustomersFile, outFile, function(err){
			if (err) return callback(err);
			callback() ;
		});
	} ;

	this.restoreDb = function(importFile, callback){
		fs.copy(dataDir+path.sep+dbCustomersFile, dataDir+path.sep+dbCustomersFile+"."+new Date().getTime(), function(err){
			if (err) return callback(err);
			fs.copy(importFile, dataDir+path.sep+dbCustomersFile, function(err){
				if (err) return callback(err);
				_self.db = new Db(dataDir+path.sep+dbCustomersFile) ;
				callback() ;
			}) ;
		});
	} ;


	this.copyDb = function(callback){
		fs.copy(dataDir+path.sep+dbCustomersFile, dataDir+path.sep+dbCustomersFile+"."+new Date().getTime(), callback) ;
	} ;

	
	this.findCustomers = function(query, callback){
		this.db.find(query, callback) ;
	};

    this.addSearch = function(search, callback){
        this.dbSearches.insert(search, callback) ;
    };

    this.findSearches = function(query, callback){
        this.dbSearches.find(query, callback) ;
    };

    this.getSearch = function(id, callback){
        this.dbSearches.get(id, callback) ;
    };

    this.deleteSearch = function(id, callback){
        this.dbSearches.remove(id, callback) ;
    };

    this.updateSearch = function(search, callback){
        this.dbSearches.update(search, callback) ;
    };

	this.saveSettings = function(logo, text, options, callback){
		fs.writeFile( dataDir+path.sep+"options", JSON.stringify(options), {encoding: "utf8"}, function(err){
			if (err) return callback(err);
			fs.writeFile( dataDir+path.sep+"text", text, {encoding: "utf8"}, function(err){
				if (err) return callback(err);
				if(logo){
					fs.copy(logo, dataDir+path.sep+"logo", function(err){
						if (err) return callback(err);
						callback() ;
					}) ;
				}else{
					callback() ;
				}
			}) ;
		});

	} ;

	this.readImageFile = function(file, callback){
		fs.readFile(file, function(err, dataLogo){
			if (err) return callback(err);

			callback(null, dataLogo.toString("base64")) ;
		}) ;
	} ;

	this.readSettings = function(callback){
		var logoBase64 = null;
		var text = null;
		var options = { diagPrice : "5 € TTC" };

		var calls = [] ;
		calls.push(function(cb){
			fs.exists(dataDir+path.sep+"logo", function(exists){
				if(exists){
					fs.readFile(dataDir+path.sep+"logo", function(err, dataLogo){
						if (err) return cb(err);

						logoBase64 = dataLogo.toString("base64") ;
						cb() ;
					}) ;
				}else{
					cb() ;
				}
			}) ;
		}) ;

		calls.push(function(cb){
			fs.exists(dataDir+path.sep+"text", function(exists){
				if(exists){
					fs.readFile( dataDir+path.sep+"text", {encoding: "utf8"}, function(err, textContent){
						if (err) return cb(err);

						text = textContent ;
						cb() ;
					}) ;
				}else{
					cb() ;
				}
			}) ;
		}) ;

		calls.push(function(cb){
			fs.exists(dataDir+path.sep+"options", function(exists){
				if(exists){
					fs.readFile( dataDir+path.sep+"options", {encoding: "utf8"}, function(err, textContent){
						if (err) return cb(err);

						options = JSON.parse(textContent) ;
						cb() ;
					}) ;
				}else{
					cb() ;
				}
			}) ;
		}) ;


		async.parallel(calls, function(err){
			if (err) return callback(err);
			callback(null, logoBase64, text, options) ;
		}) ;


	} ;

	/**
	 * Check if the licence is correct
	 * 
	 * @param callback receive : 
	 * 		err : can be INFOS_DONT_EXISTS, LIC_DONT_EXISTS, LIC_INVALID
	 * 		data : informations of user
	 */
	this.checkLicense = function(callback){
		var infoFile = this.dataDir+path.sep+"infos.brl" ;
		var licFile = this.dataDir+path.sep+"licence.brl" ;
		fs.exists(infoFile, function(exists){
			if(exists){
				fs.readFile(infoFile, {encoding : "utf8"}, function(err, strInfos){
					if(err) { callback(err); return; }
					var infos = JSON.parse(strInfos) ;
					var licenceName = infos.name;
					_self.checkLicFile(licenceName, licFile, callback) ;
				}) ;
			}else{
				callback(CODES.INFOS_DONT_EXISTS) ;
			}
		});
	};
	
	
	/**
	 * Check if a licence file is correct
	 * 
	 * @param licenceName the licence name to check
	 * @param licFile the file containing the licence
	 * @param callback receive : 
	 * 		err : can be LIC_DONT_EXISTS, LIC_INVALID
	 * 		data : informations of user
	 */
	this.checkLicFile = function(licenceName, licFile, callback){
		fs.exists(licFile, function(exists){
			if(exists){
				fs.readFile(licFile, {encoding: "utf8"}, function(err, license){
					if(err) { callback(err); return; }
					_self._verifySign(licenceName, license, function(err, isOk){
						if(err) { callback(err); return; }
						if(!isOk){
							callback(CODES.LIC_INVALID, {name : licenceName}) ;
						}else{
							callback(null, {name : licenceName}) ;
						}
					}) ;
				});
			}else{
				callback(CODES.LIC_DONT_EXISTS, {name : licenceName}) ;
			}
		}) ;
	};
	
	this._verifySign = function(name, license, callback){
		fs.readFile(path.resolve( __dirname+"/../keys/public.pem" ), function(err, publicKey){
			if(err) { callback(err); return; }
			var verifier = crypt.createVerify("RSA-SHA256");  
			verifier.update(_self._recreateString(name));  
			callback(null, verifier.verify(publicKey, license, "hex")) ;
		});
	}
	
	/**
	 * Recreate a string from each of its char
	 * We need that because string comming from file and from HTML form don't give the same signature although they have strictly the same char codes inside
	 * 
	 * @param str {string} the original string
	 * @return the recreated string
	 */
	this._recreateString = function(str){
		var convertedString = "";
		for (var i = 0; i < str.length; ++i){
			convertedString += String.fromCharCode(str.charCodeAt(i));
		}
		return convertedString ;
	}
	
	/**
	 * Generate license
	 * 
	 * @param infos {object} the license informations
	 * @param callback callback receive : 
	 * 		err : if an error happens
	 * 		lic : the license
	 */
	this.genLicense = function(infos, callback){
		fs.readFile(path.resolve( __dirname+"/../keys/private.pem" ), function(err, pem){
			if(err) { callback(err); return; }
			var key = pem.toString('ascii');

			var sign = crypt.createSign('RSA-SHA256');
			

			sign.update(_self._recreateString(infos.name), "utf8");
			var lic = sign.sign(key, 'hex');
			
			fs.writeFile(infos.savePath, lic, callback);
		});
		
	}
	
	/**
	 * Save licence informations
	 * 
	 * @param callback receive : 
	 * 		err : if an error happens
	 */
	this.saveLicense = function(infos, filePath, callback){
		var infoFile = this.dataDir+path.sep+"infos.brl" ;
		var licFile = this.dataDir+path.sep+"licence.brl" ;
		
		fs.writeFile(infoFile, JSON.stringify({name : infos.name}), {encoding : "utf8"}, function(err){
			if(err) { return callback(err); }
			fs.copy(filePath, licFile, function(err){
				if(err) { return callback(err); }
				callback(null);
			});
		});
	};
	
	this.getOsName = platforms.getOsName ;
	
	this.getOsVersion = platforms.getOsVersion ;



	this.readImportFile = function(importFile, callback) {
		var mimeType = mime.lookup(importFile);
		if(mimeType === "application/vnd.ms-excel"){
			_self.readXlsFile(importFile, callback) ;
		}else if(mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
			_self.readXlsxFile(importFile, callback) ;
		}else if(mimeType === "text/csv"){
			_self.readCsvFile(importFile, callback) ;
		}else{
			callback("Unknown type : "+mimeType) ;
		}
	};

	this.readXlsxFile = function(importFile, callback){
		var workbook = XLSX.readFile(importFile) ;
		var sheetNames = workbook.SheetNames;
		var sheet = workbook.Sheets[sheetNames[0]] ;
		callback(null, XLSX.utils.sheet_to_json(sheet, {header:1})) ;
	} ;

	this.readXlsFile = function(importFile, callback){
		var workbook = XLS.readFile(importFile) ;
		var sheetNames = workbook.SheetNames;
		var sheet = workbook.Sheets[sheetNames[0]] ;
		callback(null, XLS.utils.sheet_to_json(sheet, {header:1})) ;
	} ;

	this.readCsvFile = function(importFile, callback){
		fs.readFile(importFile, function(err, bufferCSV){
			if(err){
				return callback(err) ;
			}

			//guess encoding
			var encoding = jschardet.detect(bufferCSV).encoding ;

			//decode
			var strCSV =iconv.decode(bufferCSV, encoding);

			//guess the delimiter
			var possibleDelimiters = [",", ";", "\t"] ;
			var delimiterOcc = 0;
			var delimiter = "" ;
			possibleDelimiters.forEach(function(d){
				var occurrences = (strCSV.match(new RegExp(d, "g")) || []).length ;
				if(occurrences>delimiterOcc){
					delimiter = d;
					delimiterOcc = occurrences ;
				}
			}) ;


			//parse
			csv.parse(strCSV, {delimiter: delimiter}, function(err, lines){
				if(err){
					return callback(err) ;
				}
				callback(null, lines) ;
			}) ;
		});
	} ;

	/**
	 * add patient into db
	 * @param {object}   patient  
	 * @param {function} callback
	 */
	this.addPatient = function(patient, callback){
		patient._nameLastName = patient.name + " " + patient.lastName;
		this.db.insert(patient, callback) ;
	};

	/**
	 * update patient into db
	 * @param {object}   patient  
	 * @param {function} callback
	 */
	this.updatePatient = function(patient, callback){
        patient._nameLastName = patient.name + " " + patient.lastName;
		this.db.update(patient, callback) ;
	};

	/**
	 * delete patient into db
	 * @param {string}   id of patient  
	 * @param {function} callback
	 */
	this.deletePatient = function(id, callback){
        this.db.remove(id, callback) ;
    };

    /**
     * get patient by id
     * @param {string} id is id of patient
     * @param {function} callback
     */
    this.getPatient = function(id, callback){
        this.db.get(id, callback) ;
    };

    /**
     * add diadnosis of patient
     * @param {object} diagnosis
     * @param {string} id is id of patient
     * @param {function} callback
     */
    this.addDiagnosis = function(diagnosis, patient,  callback){
        if(patient){
            var diagnosisList = patient.diagnosis;
            if(!diagnosisList){
                diagnosisList = [];
            }

            /**
             * convert a number has 1 digit into number has 2 digits
             *
             * @param number
             * @returns {*}
             */
            var convertNumber = function(number){
                if(0 <= number && number<10){
                    number = "0" + number;
                }
                return number;
            };
            //create id for diagnosis
            var now = moment();
            var year = now.get("year");
            var month = now.get("month");
            var date = now.get("date");
            var hour = now.get("hour");
            var minute = now.get("minute");
            var second = now.get("second");

            var id = year.toString() + convertNumber(month) + convertNumber(date) + convertNumber(hour) + convertNumber(minute) + convertNumber(second);

            diagnosis._id = id;
            diagnosisList.push(diagnosis);

            patient.diagnosis = diagnosisList;
            //update patient with new diagnosis
            _self.updatePatient(patient, function(err){
                if(err){
                    callback(err);
                }
                callback(null, patient, diagnosis);
            });
        }else{
            callback("Missing patient");
        }

    };

    /**
     * update diagnosis of patient
     * @param {object} diagnosis
     * @param {object} patient
     * @param {function} callback
     */
    this.updateDiagnosis = function(diagnosis, patient, callback){
        if(diagnosis){
            var diagnosisId = diagnosis._id;
            if(diagnosisId){
                var diagnosisList = patient.diagnosis;
                //remove old diagnosis has id matched
                var diagnosisListTmp = _.reject(diagnosisList, function(diagnosisTmp){
                    return (diagnosisTmp._id == diagnosisId);
                });
                if(!diagnosisListTmp){
                    diagnosisListTmp = [];
                }
                //add diagnosis with new value
                diagnosisListTmp.push(diagnosis);
                patient.diagnosis = diagnosisListTmp;
                //update patient
                _self.updatePatient(patient, function(err){
                    if(err){
                        callback(err);
                    }
                    callback(null, patient, diagnosis);
                });
            }else{
                callback("Missing id of diagnosis");
            }
        }
    };

    /**
     * find patient
     * @param  {[type]}   query    [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    this.findPatients = function(query, callback){
		this.db.find(query, callback) ;
	};
}


module.exports = Api;
