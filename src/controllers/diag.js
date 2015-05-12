var DiagOnlyView = require("../views/diag/diagOnly.js");
var async = require("async");

var EventSource = require("../common/EventSource");

/**
 * Controller of diagnosis
 *
 * @param {Api} api an instance of Api object
 * @param {i18n} t an instance of i18n object
 * @param licenseErr
 * @param licenseinfo
 * @constructor
 */
function DiagController (api, t, licenseErr, licenseInfos){

    var _self = this;

    this.currentPatient = null;

    this.diagOnlyView = new DiagOnlyView(t, licenseErr);

    /**
     * contructor
     * @param callback
     */
    this.init = function(callback){
        async.parallel([
            _self.diagOnlyView.init
        ], callback);

        _self.diagOnlyView.on("save", _self.onSaveDiagnosis);
        new EventSource().ON("newDiag", _self.newDiag);
        new EventSource().ON("selectDiagnosis", _self.onSelectDiag);
    };

    /**
     * create new Diag
     *
     */
    this.newDiag = function(ev){

        _self.diagOnlyView.clear();
        _self.diagOnlyView.show();

        var patient = ev.data.patient;
        if(patient){
            _self.diagOnlyView.loadPatient(patient);
        }
    };

    /**
     * only show diag
     */
    this.showDiagOnly = function(){
        _self.diagOnlyView.show();
    };

    /**
     * hide diagOnly
     */
    this.hide = function(){
        _self.diagOnlyView.hide();
    };

    this.onSaveDiagnosis = function(ev){
        if(licenseErr){
            return _self.info(t("mustHaveLicense"));
        }
        var patient = ev.data.patient;
        var patientId = patient._id;
        if(patientId){
            //add or update diagnosis
            var diagnosis = ev.data.diagnosis;
            var diagnosisId = diagnosis._id;
            if(diagnosisId){
                //update diagnosis
                api.updateDiagnosis(diagnosis, patient, function(err, patient, diagnosis){

                    if(err){
                        return _self.diagOnlyView.error(err);
                    }
                    if(ev.data.nextScreen !== "home"){
                        _self.diagOnlyView.load(diagnosis);
                        _self.diagOnlyView.toast(t("diag.updateOK"));
                    }
                    if(ev.data.callback){
                        ev.data.callback(patient, diagnosis);
                    }
                });
            }else{
                //add diagnosis
                //console.log("add diagnosis");
                api.addDiagnosis(diagnosis, patient, function(err, patient, diagnosis){
                    if(err){
                        return _self.diagOnlyView.error(err);
                    }
                    if(ev.data.nextScreen !== "home"){
                        _self.diagOnlyView.load(diagnosis);
                        _self.diagOnlyView.toast(t("diag.createOK"));
                    }
                    if(ev.data.callback){
                        ev.data.callback(patient, diagnosis);
                    }
                });
            }
        }else{
            //show error
        }
    };

    this.onSelectDiag = function(ev){
        var patient = ev.data.patient;
        var diagnosis = ev.data.diagnosis;
        _self.diagOnlyView.loadPatient(patient);
        _self.diagOnlyView.load(diagnosis);
        _self.diagOnlyView.show();
    };

    /**
     * select patient in when create 
     * @return {[type]} [description]
     */
    this.onSelectPatient = function(ev){
        api.getPatient(ev.data.id, function(err, patient){
            _self.currentPatient = patient;
            _self.diagOnlyView.loadPatient(patient);
        });
    };



}

module.exports = DiagController;