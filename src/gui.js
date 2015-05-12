var i18n = require("../bower_components/i18next/i18next.js");

var HomeView = require("./views/home/home.js");
var BannerView = require("./views/home/banner.js");

var PatientsCtrl = require("./controllers/patients.js");
var DiagCtrl = require("./controllers/diag.js");

var EventSource = require("./common/EventSource.js") ;
var async = require("async");

var LANG = "Vi";

function mainGui(api, licenseErr, licenseInfos, diagFiles, blockTemplates, templateHTML, Pdf, genAndSendPdf, genAndPrintPdf,
                 startSpinLab, base64, genAndOpenXls, genAndOpenCsv, zipCodes) {
    i18n.init({ lng: LANG }, function (tr) {


        var t = tr;

        w2utils.locale("locales/"+LANG+"/w2ui.json");
        w2utils.settings.groupSymbol = "" ;


        if(licenseErr){
            $("#licenseError").show() ;
            $("#licenseError").html(t("home.licErr."+licenseErr)) ;
        }

        var homeView = new HomeView(t, licenseErr);
        var bannerView = new BannerView(t, licenseErr);

        var patientsCtrl = new PatientsCtrl(api, t, licenseErr, zipCodes);
        var diagCtrl = new DiagCtrl(api, t, licenseErr, licenseInfos);

        var showHome = function(){
            homeView.show();
            bannerView.hide();
            patientsCtrl.hide();
            diagCtrl.hide();
        };

        var showPatient = function(){
            homeView.hide();
            bannerView.show();
            patientsCtrl.showPatient();
            diagCtrl.hide();
        };

        var showDiag = function(){
            homeView.hide();
            bannerView.show();
            patientsCtrl.hide();
            diagCtrl.showDiagOnly();
        };

        homeView.on("newPatient", showPatient);
        bannerView.on("home", showHome);
        bannerView.ON("selectPatient", showPatient);
        new EventSource().ON("newPatient", showPatient);

        async.parallel([
            homeView.init,
            bannerView.init,
            patientsCtrl.init,
            diagCtrl.init
        ], function () {
            homeView.show();
        });


    });

    return new EventSource() ;

}

module.exports = mainGui;
