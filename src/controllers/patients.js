var PatientsFormView = require("../views/patients/form.js");
var async = require("async");
var EventSource = require("../common/EventSource");
var _ = require("underscore");

/**
 * Controller of patients
 *
 * @param api {Api} an instance of api object
 * @param t {function} an instance of i18n object
 * @param zipCodes {object} table of zip codes
 * @constructor
 */
function PatientsController(api, t, licenseErr, zipCodes){
    var _self = this;

    this.formView = new PatientsFormView(t, licenseErr, zipCodes);

    this.init = function(callback){
        async.parallel([
            _self.formView.init
        ], callback);

        _self.formView.on("save", _self.onPatientValidate);
        _self.formView.on("delete", _self.onPatientDelete);
        _self.formView.on("selectPatient", _self.onSelect);
        _self.formView.on("deleteDiag", _self.onDeleteDiag);

        new EventSource().ON("newPatient", _self.onNewPatient);
        new EventSource().ON("search", _self.onSearch);
        new EventSource().ON("selectPatient", _self.onSelect);
        new EventSource().ON("newDiag", _self.hide);

    };

    /**
     * show patient
     */
    this.showPatient = function(){
        _self.formView.show();
    };

    this.hide = function(){
        _self.formView.hide();
    };

    /**
     * show Patient screen
     */
    this.onNewPatient = function(){
        if(licenseErr){
            return _self.info(t("mustHaveLicense"));
        }
        _self.formView.clear();
        _self.formView.show();
    };

    /**
     * validate before create Patient in db
     */
    this.onPatientValidate = function(ev){
        if(licenseErr){
            return _self.info(t("mustHaveLicense"));
        }
        var patient = ev.data.patient;
        if(patient._id){
            //update patient
            api.updatePatient(patient, function (err) {
                if (err) {
                    return _self.formView.error(err);
                }
                if(ev.data.nextScreen !== "home"){
                    _self.formView.load(patient) ;
                    _self.formView.show() ;
                    _self.formView.toast(t("patients.updateOK")) ;
                }
                if(ev.data.callback){
                    ev.data.callback(patient) ;
                }
            });
        }else{
            //add new patient
            api.addPatient(patient, function(err, newPatient){
                if(err){
                    return _self.formView.error(err);
                }
                if(ev.data.nextScreen !== "home"){
                    _self.formView.load(newPatient);
                    _self.formView.show();
                    _self.formView.toast(t("patients.createOK"));
                }
                if(ev.data.callback){
                    ev.data.callback(newPatient);
                }
            });
        }
    };

    /**
     * delete patient and then show success message
     * @param  {object} ev
     */
    this.onPatientDelete = function(ev){
        if(licenseErr){
            return _self.info(t("mustHaveLicense"));
        }
        var patient = ev.data.patient;
        if(patient && patient._id){
            api.deletePatient(patient._id, function(err){
                if(err){
                    return _self.formView.error(err);
                }
                _self.formView.toast(t("patients.deleteOK"));
            });
        }
    };

    /**
     * Search Patient with condition
     * @param  {object}   search   search condition
     * @param  {Function} callback
     */
    this.searchPatientsByConditions = function(fieldSearch, search, callback){
        var regSearch = search;
        regSearch = regSearch.replace(/\*/g, ".*");
        var searchObj = {};
        if(fieldSearch){
            searchObj[fieldSearch] =  new RegExp("^"+regSearch, "i");
        }else{
            searchObj._nameLastName = new RegExp("^"+regSearch, "i");;
        }
        api.findPatients(searchObj, function(err, patients){
            if(err){
                return _self.formView.error(err);
            }
            callback(patients);
        });
    };

    /**
     * Search patient
     * @param ev
     */
    this.onSearch = function(ev){
        _self.searchPatientsByConditions(ev.data.fieldSearch, ev.data.search, ev.data.callback);
    };

    /**
     * select patient
     * @param ev
     */
    this.onSelect = function(ev){
        api.getPatient(ev.data.id, function(err, patient){
            if(err){
                return _self.formView.error(err) ;
            }
            _self.formView.load(patient);
            _self.formView.show();
        }) ;
    };

    /**
     * delete this diag of patient
     * @param  {} ev [description]
     */
    this.onDeleteDiag = function(ev){
        var patient = ev.data.patient;
        var diagnosisList = patient.diagnosis;
        var diagnosis = ev.data.diagnosis;
        var diagnosises = [];
        diagnosises = _.reject(diagnosisList, function(diagnosisTmp){
            return (diagnosisTmp._id === diagnosis._id);
        });
        patient.diagnosis = diagnosises;
        api.updatePatient(patient, function(err){;
            if (err) {
                return _self.formView.error(err);
            }
            if(ev.data.nextScreen !== "home"){
                _self.formView.load(patient) ;

                _self.formView.show() ;
                _self.formView.toast(t("patients.deleteDiagOK")) ;
            }
            if(ev.data.callback){
                ev.data.callback(patient) ;
            }
        });
    }

}

module.exports = PatientsController;