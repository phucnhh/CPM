var BaseView = require("../BaseView.js");
var async = require("async");
var FieldCollection = require("../fields/collection.js");
var moment = require("moment");
var uuid = require("node-uuid");
var _ = require("underscore");
/**
 * Diagnosis only view
 *
 * @class
 * @memberOf views
 * @param {i18n} t an instance of i18n object
 * @param licenseErr
 * @constructor
 */
function DiagOnlyView (t, licenseErr){

    BaseView.call(this, t, "diag", "diagOnly");

    var _self = this;

    this.patient = null;
    this.diagnosis = null;
    this.btSave = null;     //button save
    this.btReset = null;    //button reset, to reset diagnosis
    this.btPatientScr = null;//button to come back patient screen
    this.btAddMedicine = null;//button to add new medicine in treatment
    this.elNewDiag = null;

    this.treatmentMedicineId = "diag_diagOnly__treatmentMedicine";
    var fields = new FieldCollection(t);

    var readOnlyFields = [
    ];
    var readOnlyIfPatient = [
    ];

    var listMedicine = [] ; //list of medicine of this diagnosis
    var medicine = null;
    var fieldsDiag = ["blood", "pulse", "temperature", "weight", "height", "symptoms"];
    var fieldsTreatment = ["medicineName", "medicineQuantity", "usageNotes"];

    this._initElements = function(){

        async.parallel([
            async.apply(fields.init, _self.container, "diag_diagOnly")
        ], function(){
            $("#diag_diagOnly__newDiag").tabs();
            $("#diag_diagOnly__patientContent").tabs();


            _self.elTreatment = _self.getById("treatmentMedicine");

            _self.btSave = _self.getByClass("save");
            _self.btReset = _self.getByClass("reset");

            _self.btPatientScr = _self.getByClass("patientScreen");
            _self.btAddMedicine = _self.getByClass("addMedicine");

            _self.btSave.addEventListener("click", _self.onSave);
            _self.btPatientScr.addEventListener("click", _self.returnPatientScreen);
            _self.btAddMedicine.addEventListener("click", _self.onAddOrUpdateMedicine);
            _self.btReset.addEventListener("click", _self.onResetDiagnosis);

            /**
             * reder medicines of treatment
             * @param  {Array} records: medicines of treatment
             * @param  {function} onDblClick: when double click a row in this table
             * @param  {function} onClick: when click a button in a row
             */
            _self.treatmentMedicine = $().w2grid({
                name: _self.treatmentMedicineId,
                header: '',
                columns: [
                    {field: 'medicineName', caption: t("diag.treatment.medicine"), size: '500px', sortable: false},

                    { field: 'medicineQuantity', caption: t("diag.treatment.quantity"), size: '250px', sortable : false},

                    { field: 'usageNotes', caption: t("diag.treatment.usageNotes"), size: '500px', sortable : false},

                    { field: 'btActions', caption: "", size: '36px', sortable : false, render : function(record){
                        var html = "<button class='diag_diagOnly__deleteMedicine ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only'  title='"+ t("diag.deleteMedicine")+"'>&#xd7;</button>" ;
                        return html;
                    }}

                ],
                records: [],
                onDblClick: function (event) {
                    medicine = _self.treatmentMedicine.get(event.recid);
                    fields.load(medicine);
                },
                onClick: function(event){
                    var target = event.originalEvent.target;
                    if(target.className.indexOf("deleteMedicine") !== -1){
                        _self.onDeleteMedicine(_self.treatmentMedicine.get(event.recid));
                    }
                }
            });
        });
    };

    /**
     * load patient
     * @param patient
     */
    this.loadPatient = function(patient){
        _self.diagnosis = null;
        var oldValues = fields.values();
        _self.patient = patient;

        fields.load(patient);
        $('#diag_diagOnly__patientName').html(patient._nameLastName);
        $('#diag_diagOnly__patientSelected').css("display", "inline-block");

        readOnlyIfPatient.forEach(function(f){
            f.setReadOnly(true);
        });
    };

    /**
     * called on save diagnosis
     * @fires {views.diagDiagOnlyView#save
     * @returns {*}
     */
    this.onSave = function(){
        if(licenseErr){
            return _self.info(t("mustHaveLicense"));
        }
        //check error
        if(_self._checkError()){
            _self._doSave();
        }
    };

    /**
     * check error before 
     * @return {[type]} [description]
     */
    this._checkError = function(){
        if(fields.isAllEpmty()){
            _self.warning(t("diag.allFieldIsEmpty"), t("warning"));
            return false;
        }
        return true;
    }

    /**
     * do the save
     * @todo
     * - get values for diagnosis
     * - create value date for diagnosis
     * - call save this one
     * @param {function} callback
     * @private
     */
    this._doSave = function(callback){
        var diagValues = fields.values(true, fieldsDiag);
        _self._copyStaticProperties(diagValues);
        diagValues.treatment = listMedicine; //treatment is list of medicines
        var now = moment().format("DD-MM-YYYY");
        diagValues.date = now;
        _self.emit("save", {diagnosis: diagValues, patient: _self.patient, callback: callback});
    };

    /**
     * copy static properties (such as _id) from original diagnosis
     * @param modifierDiagnosis
     * @private
     */
    this._copyStaticProperties = function(modifierDiagnosis){
        if(_self.diagnosis){
            modifierDiagnosis._id = _self.diagnosis._id;
        }
    };

    /**
     * load diagnosis to the it's form
     * @todo
     * - load all field of diagnosis in screen
     * - render medicines of treatment
     * @param {object} diagnosis
     */
    this.load = function(diagnosis){
        _self.diagnosis = diagnosis;
        if(diagnosis){
            listMedicine = diagnosis.treatment;
        }

        fields.load(diagnosis);
        _self.renderMedicinesInTreatment(listMedicine);
    };

    /**
     * clear diagnosis screen
     * @todo 
     * - reset all variable
     * - reset all field and remove all error
     * - render medicines in treatment
     */
    this.clear = function(){
        _self.diagnosis = null;
        listMedicine = [];
        medicine = null;
        //$('#diag_diagOnly__patientSelected').css("display", "none");

        $(_self.container).find("input").removeClass("w2ui-error");
        $(_self.container).find("select").removeClass("w2ui-error");

        readOnlyIfPatient.forEach(function(f){
            f.setReadOnly(false);
        });

        fields.clear();
        _self.renderMedicinesInTreatment(listMedicine);
    };

    /**
     * cone back patient screen to see al information of patient
     */
    this.returnPatientScreen = function(){
        _self.hide();
        _self.EMIT("selectPatient", {id: _self.patient._id});
    };

    /**
     * set if fields are read only or not
     * @param {boolean} readOnly
     */
    this.setReadOnly = function(readOnly){
        fields.setReadOnly(readOnly);
        if(!readOnly){
            //not read only mode but some fields are always read only, don't reactive them
            readOnlyFields.forEach(function(f){
                f.setReadOnly(true);
            });
        }
    };

    /**
     * render medicines in treatment
     * @return {[type]} [description]
     */
    this.renderMedicinesInTreatment = function(medicinesArray){
        _self.treatmentMedicine.clear();
        var medicines = [] ;
        medicinesArray.forEach(function(d){
            d.recid = uuid.v4() ;
            medicines.push(d) ;
        });

        _self.treatmentMedicine.add(medicines);
        $(_self.elTreatment).w2render(_self.treatmentMedicine);
    };

    /**
     * add medicine into medicine array and render them again
     * @param {object} medicine [description]
     */
    this.addMedicineIntoTreatment = function(medicine){
        var medicineName = medicine.medicineName;
        if(medicineName && medicineName.trim() != ""){
            if(listMedicine){
                var medicineResult = _.find(listMedicine, function(medicineTemp){
                    return (medicine.medicineName == medicineTemp.medicineName);
                });
                if(medicineResult){
                    //show message for user
                    console.log("Has this medicine in list")
                }else{
                    listMedicine.push(medicine);
                }
                _self.renderMedicinesInTreatment(listMedicine);
            }
        }else{
            console.log("Medicine name is empty");
        }
        medicine = null;
        fields.clear(fieldsTreatment);
        fields.fieldMedicineName.focus();
        
    };



    /**
     * add or update medicine
     * @return {[type]} [description]
     */
    _self.onAddOrUpdateMedicine = function(){
        if(medicine){
            //update medicine in treatment
            //@todo remove this medicine in listMedicine
            listMedicine = _.reject(listMedicine, function(medicineTemp){
                return (medicine.recid === medicineTemp.recid);
            });
        }
        //get value of 
        var medicineTmp = {};
        medicineTmp = fields.values(true, fieldsTreatment);
        _self.addMedicineIntoTreatment(medicineTmp);
    };

    /**
     * delete medicine in treatment
     * @param  {object} medicineDelete
     * {
     *     medicineName: "Pamin",
     *     medicineQuantity: "1 vi",
     *     usageNotes: "1vien/lan 2lan/ngay"
     * }
     */
    this.onDeleteMedicine = function(medicineDelete){
        if(medicineDelete){
            listMedicine = _.reject(listMedicine, function(medicineTmp){
                return (medicineTmp.medicineName === medicineDelete.medicineName);
            });
        }
        _self.renderMedicinesInTreatment(listMedicine);
    };

    /**
     * reset diagnosis to create new diagnosis
     * @return {[type]} [description]
     */
    this.onResetDiagnosis = function(){
        if(fields.isAllEpmty()){
            _self.warning(t("diag.allFieldIsEmpty"), t("warning"));
        }else{
            var buttons = {};
            buttons[t("diag.confirmResetYes")] = function(){
                _self.clear();
                _self.toast(t("diag.resetOK"));
                $(this).dialog("close");
            };

            buttons[t("diag.confirmResetNo")] = function(){
                $(this).dialog("close");
            };

            $('#diag_diagOnly__confirmReset').dialog({
                resizable: false,
                height: 180,
                width: 500,
                modal: true,
                buttons: buttons,
                open: function(){
                    $('#diag_diagOnly__confirmReset').parent().find("button:eq(2)").focus();
                }
            });
        }
        
    };
}

module.exports = DiagOnlyView;