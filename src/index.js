var platforms = require("./api/utils/platforms.js") ;
var Pdf = require("./api/pdf/pdf.js") ;
var Xls = require("./api/xls/xls.js") ;
var Csv = require("./api/xls/csv.js") ;
var Email = require("./api/mail/mail.js") ;
var path = require("path");
var util = require('util') ;
var gui = require('nw.gui') ;
var Api = require("./api/api.js") ;
var LicenseApi = require("./api/license/license.js") ;
var i18n = require("i18next");
var async = require("async");
var fs = require("fs-extra");
var os = require("os");
var net = require('net');
var EV = null;

var APP_NAME = "CPM";
var LANG = "Vi" ;

var api;
var licenseApi;
var t;

//FIXME in production log to a file and display friendly message to the user to fill bug report
process.on("uncaughtException", function(e) { console.log(e); });

function _init(callback){

	async.parallel([
		_initI18n,
		_initApi
	], callback);
}

function _initI18n(callback){
	i18n.init({ lng: LANG }, function(tr) {
		t = tr ;
		callback(null) ;
	});
}

function _initApi(callback){
	platforms.createAppDataDirIfNotExists(APP_NAME, function(err, dirAppData){
		if(err){
			callback(err);
			return;
		}
		api = new Api(dirAppData, APP_NAME+".db", APP_NAME+"_searches.db") ;
        licenseApi = new LicenseApi() ;
		callback(null) ;
	}) ;
}


function main(){

	 gui.Window.get().maximize() ;
	 gui.Window.get().show() ;


	_init(function(err){
		if(err){
			alert("Unexpected error "+err) ;
			return;
		}

        //cut/copy right click
        var menuCopy  =   new  gui.Menu() ;
        var cut  =   new  gui.MenuItem({
            label : t('menu.cut'),
            click :   function () { document.execCommand("cut");}});
        var copy  =   new  gui.MenuItem({
            label : t('menu.copy'),
            click :   function () { document.execCommand("copy");}});
        var paste  =   new  gui.MenuItem({
            label : t('menu.paste'),
            click :   function () { document.execCommand("paste")}});

        menuCopy.append(cut);
        menuCopy.append(copy);
        menuCopy.append(paste);

        $(document).on("contextmenu",  function (e) {
            e.preventDefault();
            menuCopy.popup(e.originalEvent.x, e.originalEvent.y);
        });



		var menu = new gui.Menu({ type: 'menubar' });
		var itemFile = new gui.MenuItem({ label: t('menu.file') }) ;

		var menuFile = new gui.Menu();

		/*menuFile.append(new gui.MenuItem({
			label: t("menu.newDiag"),
			click: function() {
                EV.EMIT("newDiag") ;
			}
		})) ;*/
		menuFile.append(new gui.MenuItem({
			label: t("menu.newPatient"),
			click: function() {
                EV.EMIT("newPatient") ;
			}
		})) ;
		menuFile.append(new gui.MenuItem({
			label: t("menu.quit"),
			click: function() {
				gui.App.quit();
			}
		})) ;

		itemFile.submenu = menuFile;
		menu.append(itemFile);
        
		var itemTools = new gui.MenuItem({ label: t('menu.tools') }) ;

		var menuTools = new gui.Menu();

		/*menuTools.append(new gui.MenuItem({
			label: t("menu.exports"),
			click: function() {
                EV.EMIT("openListing") ;
			}
		})) ;
		menuTools.append(new gui.MenuItem({
			label: t("menu.backup"),
			click: function() {
                EV.EMIT("openBackup") ;
			}
		})) ;*/
		menuTools.append(new gui.MenuItem({
			label: t("menu.settings"),
			click: function() {
                EV.EMIT("openSettings") ;
			}
		})) ;

        /*menuTools.append(new gui.MenuItem({
            label: t("menu.import"),
            click: function() {
                EV.EMIT("openImport") ;
            }
        })) ;*/

		itemTools.submenu = menuTools;

		menu.append(itemTools);



        /*
		var itemHelp = new gui.MenuItem({ label: t('menu.help') }) ;

		var menuHelp = new gui.Menu();

		menuHelp.append(new gui.MenuItem({
			label: t("menu.manual"),
			click: function() {
                gui.Shell.openItem(path.dirname(process.execPath)+"/BAYROLSolution.chm");
            }
		})) ;
		menuHelp.append(new gui.MenuItem({
			label: t("menu.about"),
			click: function() {
                EV.EMIT("showAbout") ;
			}
		})) ;

		itemHelp.submenu = menuHelp;
		menu.append(itemHelp);*/

		gui.Window.get().menu = menu;

        //clean temp dir at startup
        var tmpdir = os.tmpdir() + path.sep + "BAYROLSolution";
        if(fs.existsSync(tmpdir)){
            fs.remove(tmpdir, function(){
                fs.mkdir(tmpdir) ;
            }) ;
        }else{
            fs.mkdir(tmpdir) ;
        }







        //open named pipe for SpinLab connection
        /*net.createServer(function(socket) {
            console.log('SpinLab Connected');
            socket.write("Chlorine w/ Borate\n") ;

            socket.on('data', function(data) {
                console.log('SpinLab answer : '+data);
            });

            socket.on('end', function(data) {
                console.log('SpinLab disconnected');
            });

        }).listen('\\\\.\\pipe\\WLSpinDataPipe');
        */



        //read report template
        var templateHTML = fs.readFileSync(path.dirname(process.execPath)+"/report/template.html",  {encoding : "UTF-8"});

        var genAndOpenPdf = function(html, callback){
            var pdf = new Pdf() ;
            pdf.genPdf(html, function(err, outputFile){
                if(err){
                    return callback(err) ;
                }
                gui.Shell.openItem(outputFile);
                callback();
            }) ;
        };

        var genAndSendPdf = function(html, from, to, subject, bodyPlain, bodyHTML, callback){
            var pdf = new Pdf() ;
            console.log("GEN PDF...");
            pdf.genPdf(html, function(err, outputFile){
                if(err){
                    return callback(err) ;
                }
                console.log("SEND MAIL...");
                var email = new Email() ;
                email.sendEmail(from, to, subject, bodyPlain, bodyHTML,
                    {
                        filename : "diagnostic.pdf",
                        path : outputFile
                    },
                    function(err){
                    console.log("MAIL SENT...");
                    console.log(err);
                    callback(err) ;
                }) ;
            }) ;
        };

        var genAndPrintPdf = function(html, callback){
            var pdf = new Pdf() ;
            console.log("GEN PDF...");
            pdf.genPdf(html, true, function(err, outputFile){
                if(err){
                    return callback(err) ;
                }
                console.log("PRINT...");
                callback() ;
                pdf.printPdf(outputFile) ;
            }) ;
        };

        var genAndOpenXls = function(datas, callback){
            var xls = new Xls() ;
            xls.genXls(datas, function(err, outputFile){
                if(err){
                    return callback(err) ;
                }
                gui.Shell.openItem(outputFile);
                callback();
            }) ;
        } ;

        var genAndOpenCsv = function(datas, callback){
            var csv = new Csv() ;
            csv.genCsv(datas, function(err, outputFile){
                if(err){
                    return callback(err) ;
                }
                gui.Shell.openItem(outputFile);
                callback();
            }) ;
        } ;


        var frenchCities = fs.readFileSync(path.dirname(process.execPath)+"/villes_france.csv", {encoding : "utf8"});
        var zipCodes = {} ;
        frenchCities.split("\n").forEach(function(line){
            var li = line.split(",") ;
            if(li[8]){
                var zips = li[8].replace(/"/g, "").split("-") ;
                var cityName = li[5].replace(/"/g, "") ;
                zips.forEach(function(zip){
                    if(!zipCodes[zip]){
                        zipCodes[zip] = []
                    }
                    zipCodes[zip].push(cityName) ;
                });
            }
        }) ;


        var execPath = path.dirname( process.execPath );
        var licencePath = execPath+path.sep+"license.lic" ;
        licenseApi.checkLicense(licencePath, function(err, licenseInfos){
            var licenseErr = false ;
            if(err){
                console.log(err) ;
                licenseErr = err ;
            }


            EV = mainGui(api, licenseErr, licenseInfos, {}, {}, templateHTML,genAndOpenPdf, genAndSendPdf, genAndPrintPdf, null, {}, genAndOpenXls, genAndOpenCsv, zipCodes) ;
        }) ;
	});



}
