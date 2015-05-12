var path = require("path") ;
var os = require("os") ;
var fs = require("fs-extra") ;
var crypt = require('crypto');
var CODES = require("../../common/Codes.js") ;
var archiver = require('archiver');
var unzip = require('unzip');
var moment = require('moment');


function LicenseApi(){
    var _self = this;

    /**
     * Check if the licence is correct.
     *
     * The license file is a ZIP file that contains 2 files :
     * <ul>
     *   <li>infos.json : it contains the information linked to the license (usually customer name, purchased options...)
     *   <li>license.txt : the signature of the infos file made to guarantee it has not been altered
     * </ul>
     *
     * This function check :
     * <ul>
     *   <li> that the file exists
     *   <li> that it is a ZIP containing the 2 needed files
     *   <li> that the license signature is correct
     *   <li> that the license is not expired (check that expire date in infos file is < today)
     * </ul>
     *
     * @param licencePath path to the license file
     * @param callback receive :
     * 		err : can be INFOS_DONT_EXISTS, LIC_DONT_EXISTS, LIC_INVALID, LIC_EXPIRED
     * 		data : informations of license
     */
    this.checkLicense = function(licencePath, callback){
        fs.exists(licencePath, function(exists){
            if(!exists){
                return callback(CODES.LIC_DONT_EXISTS) ;
            }

            fs.createReadStream(licencePath)
                .pipe(unzip.Extract({ path: os.tmpdir() })).on("close", function(err){
                    var infoFile = os.tmpdir()+path.sep+"infos.json" ;
                    var licFile = os.tmpdir()+path.sep+"license.txt" ;

                    fs.exists(infoFile, function(exists){
                        if(!exists){
                            return callback(CODES.INFOS_DONT_EXISTS) ;
                        }

                        fs.readFile(infoFile, {encoding : "utf8"}, function(err, strInfos){
                            if(err) { callback(err); return; }
                            _self.checkLicFile(strInfos, licFile, function(err){
                                if(err){
                                    return callback(err) ;
                                }

                                fs.unlink(infoFile);
                                fs.unlink(licFile);

                                var infos = JSON.parse(strInfos) ;
                                if(moment(infos.expire).isBefore(moment())) {
                                    return callback(CODES.LIC_EXPIRED, infos) ;
                                }
                                callback(null, infos) ;
                            }) ;
                        }) ;
                    });
                });


        }) ;
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
        fs.readFile(path.resolve( __dirname+"/../../keys/public.pem" ), function(err, publicKey){
            if(err) { callback(err); return; }
            var verifier = crypt.createVerify("RSA-SHA256");
            //console.log("CHECK "+_self._recreateString(name));
            //console.log("CHECK STR "+license);
            verifier.update(name, "utf8");
            var result = verifier.verify(publicKey, license, "hex") ;
            //console.log("VERIFY ?? "+result);
            callback(null, result) ;
        });
    } ;

    /**
     * Recreate a string from each of its char
     * We need that because string coming from file and from HTML form don't give the same signature although they have strictly the same char codes inside
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
     * Generate license file from info JSON object
     *
     *
     * @param savePath {string} the directory in which generate license file
     * @param infos {object} the license informations
     * @param callback callback receive :
     * 		err : if an error happens
     * 		lic : the license
     */
    this.genLicense = function(savePath, infos, callback){
        fs.readFile(path.resolve( __dirname+"/../../keys/private.pem" ), function(err, pem){
            if(err) { return callback(err);  }
            var key = pem.toString('ascii');

            var sign = crypt.createSign('RSA-SHA256');

            var strInfos = JSON.stringify(infos) ;

            sign.update(strInfos, "utf8");
            var lic = sign.sign(key, 'hex');

            //console.log("SIGN "+strInfos);
            //console.log("SIGN STR "+lic);

            var output = fs.createWriteStream(savePath+path.sep + '/license.lic');
            var archive = archiver('zip');

            output.on('close', function() {
                callback() ;
            });

            archive.on('error', function(err) {
                callback(err);
            });

            archive.pipe(output);

            archive
                .append(strInfos, { name: 'infos.json' })
                .append(lic, { name: 'license.txt' })
                .finalize();

        });

    } ;


}

module.exports = LicenseApi;
