var BaseView = require("../BaseView.js");
var async = require("async");
var FieldCollection = require("../fields/collection.js");
var SimilarSearchView = require("./similar.js");
var SearchView = require("../home/search.js");
var uuid = require("node-uuid");
var moment = require("moment");

/**
 * View of patient form
 * @class
 * @extends BaseView
 * @param {i18n} t an instance of i18n
 * @param {} licenseErr
 * @param {object} zipCodes cities zip code table
 */
function PatientsFormView (t, licenseErr, zipCodes){
    /**
     * @todo 
     * - save patient
     *     @name  views.PatientsFormView#save
     *     @event
     *     @property {object} data
     *     @property {object} patient
     *     @property {function} callback
     * - delete patient
     *     @name  views.PatientsFormView#delete
     *     @event
     *     @property {object} data
     *     @property {object} patient
     * - open diag in read only only mode
     *     @name  views.PatientsFormView#openDiagReadOnly
     *     @event
     *     @property {object} data
     *     @property {object} diag
     */
    BaseView.call(this, t, "patients", "form");

    var _self = this;

    this.patient = null;

    var fields = new FieldCollection(t);

    var requireFields = [
        fields.fieldName
    ];

    this.similarView = new SimilarSearchView(t);
    this.searchView = new SearchView(t);


    this.elSimilarContainer = null;
    this.gridDiagsId = "patients_form__diagsGrid";

    this.btSave = null;
    this.btDelete = null;
    this.btNewDiagTable = null;
    this.elDiags = null;
    this.elDiagsGrid = null;

    this._initElements = function(){
        _self.elSimilarContainer = _self.getByClass("similar");
        var elSearch = _self.getById("search");

        _self.searchView.on("selectPatient", _self.fw);

        async.parallel([
            async.apply(fields.init, _self.container, "patients_form"),
            async.apply(_self.similarView.init, _self.elSimilarContainer),
            async.apply(_self.searchView.init, elSearch)
        ], function(){
            $( "#patients_form__patient" ).tabs();
            $( "#patients_form__similarSearch" ).tabs();
            $( "#patients_form__diags" ).tabs();

            $(_self.container).find("button").button() ;

            _self.elDiags = _self.getById("diags");
            _self.elDiagsGrid = _self.getById("diagsGrid");
            _self.btSave = _self.getByClass("save");
            _self.btDelete = _self.getByClass("delete");
            _self.btNewDiagTable = _self.getByClass("newDiagTable");

            _self.btSave.addEventListener("click", _self.onSave);
            _self.btDelete.addEventListener("click", _self.onDelete);
            _self.btNewDiagTable.addEventListener("click", _self.onNewDiag);


            requireFields.forEach(function(field){
                field.setRequired(true);
            });

            _self.similarView.on("selectSimilar", _self.onSelectSimilar);

            /**
             * render diags
             * @param  {Array} records: array of diagnosis of patient
             * @param  {function} onDblClick: select diagnosis in list of diagnosis. After double click, show diagnosis detail
             * @param  {function} onClick: click a button in diagnosis
             */
            _self.gridDiags = $().w2grid({
                name: _self.gridDiagsId,
                header: '',
                columns: [
                    {field: 'date', caption: t("fields.date"), size: '30%', sortable: true},

                    { field: 'symptoms', caption: t("patients.diag.symptoms"), size: '67%', sortable : false},

                    { field: 'btActions', caption: "", size: '3%', sortable : false, render : function(record){
                        var html = "<button class='patients_form__deleteDiag ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only'  title='"+ t("patients.deleteDiag")+"'>&#xd7;</button>" ;
                        return html;
                    }}
                ],
                records: [],
                onDblClick: function (event) {
                    _self.EMIT("selectDiagnosis", {
                        diagnosis : _self.gridDiags.get(event.recid),
                        patient : _self.patient
                    });
                    _self.hide();
                },
                onClick: function(event){
                    var target = event.originalEvent.target;
                    if(target.className.indexOf("deleteDiag")!==-1){
                        _self.onDeleteDiag(_self.gridDiags.get(event.recid));
                    }
                }
            });

            fields.fieldName.addEventListener("keyup", _self.searchSimilarName);
            fields.fieldIdentifyCardNumber.addEventListener("keyup", _self.searchSimilarIdentify);
            fields.fieldPhoneNumber.addEventListener("keyup", _self.searchSimilarPhoneNumber);

        }, function(err){
            console.log(err);
        });
    };

    /**
     * copy static properties (such as _is) from original patient
     *
     * @param modifiedCustomer
     * @private
     */
    this._copyStaticProperties = function(modifiedPatient){
        if(_self.patient){
            modifiedPatient._id = _self.patient._id;
            modifiedPatient._name = _self.patient._name;
            modifiedPatient._address = _self.patient._address;
        }
    };


    /**
     * do the save patient
     * @param {function} callback
     * @private
     */
    this._doSave = function(values, callback){
        _self._copyStaticProperties(values);
        if(_self.patient){
            var diagnosis = _self.patient.diagnosis;
            values.diagnosis = diagnosis;
        }
        _self.emit("save", {patient: values, callback: callback});
    };

    /**
     * called on save
     * @fires {views.CustomerFormView#save
     */
    this.onSave = function(){
        if(licenseErr){
            return _self.info(t("mustHaveLicense"));
        }


        var values = fields.values(false);
        //Don't check error. add check error later
        if(_self._checkError(values)){
            _self._doSave(values);
        }
    };

    /**
     * load patient to the form
     * @param {object} patient
     */
    this.load = function(patient){
        _self.patient = patient;

        _self.hideSimilar() ;
        _self.btDelete.style.display = "inline-block";
        _self.elDiags.style.display = "block";
        $(_self.container).find("input").removeClass("w2ui-error") ;
        $(_self.container).find("select").removeClass("w2ui-error") ;

        _self.containerErrors.style.display = "none" ;
        //load patient
        fields.clear();
        fields.load(patient);
        //render diags of this patient
        _self.gridDiags.clear() ;
        var diags = patient.diagnosis ;
        if(!diags){
            diags = [] ;
        }
        var diagsGrid = [] ;
        diags.forEach(function(d){
            d.recid = uuid.v4() ;
            diagsGrid.push(d) ;
        }) ;

        _self.gridDiags.add(diagsGrid.reverse()) ;

        $(_self.elDiagsGrid).w2render(_self.gridDiags);
    };

    /**
     * check form errors
     * @return {boolean} true if no error
     * @private
     */
    this._checkError = function(values){
        $(_self.container).find('input').removeClass("w2ui-error");
        _self.containerErrors.style.display = "none";
        var errors = [];

        //check required fields
        requireFields.forEach(function(f){
            if(f.isEmpty()){
                $(f.elInput).addClass("w2ui-error");
                errors.push(t("msg.required", {field : t("fields."+f.code)}));
            }
        });

        //validate identify card number
        //identify card number only has digit
        var regexNumber = /^\d+$/;
        var identifyValue = values.identifyCardNumber;
        if(identifyValue && identifyValue.trim() != ""){
            if(!regexNumber.test(values.identifyCardNumber)){
                $(fields.fieldIdentifyCardNumber.elInput).addClass("w2ui-error");
                errors.push(t("msg.mustBeOnlyNumber", {field: t("fields." + fields.fieldIdentifyCardNumber.code)}));
            }
        }
    

        //validate phone number
        //phone number only has digit
        var phoneNumberValue = values.phoneNumber;
        if(phoneNumberValue && phoneNumberValue.trim() != ""){
            if(!regexNumber.test(phoneNumberValue)){
                $(fields.fieldPhoneNumber.elInput).addClass("w2ui-error");
                errors.push(t("msg.mustBeOnlyNumber", {field: t("fields." + fields.fieldPhoneNumber.code)}));
            }else{
                //phone number only has 9-11 digits
                if(!(phoneNumberValue.length >= 9 && phoneNumberValue.length <= 11)){
                    $(fields.fieldPhoneNumber.elInput).addClass("w2ui-error");
                    errors.push(t("msg.mustBeFrom9-11digits", {field: t("fields." + fields.fieldPhoneNumber.code)}));
                }
            }
        }
        

        if(errors.length > 0){
            _self.error(errors.join("<br/>"));
            return false;
        }
        return true;

    };

    /**
     * clear form to create new patient
     */
    this.clear = function(){
        _self.patient = null;
        _self.showSimilar();
        fields.clear();
        _self.searchView.clear();
        _self.similarView.clear();
        _self.btDelete.style.display = "none";
        _self.elDiags.style.display = "none";
        $(_self.container).find("input").removeClass("w2ui-error");
        _self.containerErrors.style.display = "none";
        fields.fieldName.focus();
    };

    /**
     * delete patient in batadase
     * @todo 
     * - show confirm delete patient
     * - if yes, delete this patient and close this dialog, else onloy close this dialog
     * @return {[type]} [description]
     */
    this.onDelete = function(){
        if(licenseErr){
            return _self.info(t("mustHaveLicense"));
        }
        if(!_self.patient){
            return ;
        }

        var buttons = {};
        buttons[t("patients.confirmDeleteYes")] = function(){
	        _self.emit("delete", {patient: _self.patient});
	        _self.clear();
	        $(this).dialog("close");
        };
        buttons[t("patients.confirmDeleteNo")] = function(){
        	$(this).dialog("close");
        };
        $("#patients_form__confirmDelete").dialog({
        	resizable: false,
        	height: 180,
        	width: 500,
        	modal: true,
        	buttons: buttons,
        	open: function(){
                $("#patients_form__confirmDelete").parent().find("button:eq(2)").focus();
        	}
        });

    };

    /**
     * open screen diagnosis with create new one
     * @return {[type]} [description]
     */
    this.onNewDiag = function(){
        if(licenseErr){
            return _self.info(t("mustHaveLicense"));
        }
        if(_self.patient){
            _self.EMIT("newDiag", {patient: _self.patient});
        }
    };

    /**
     * show similar view create new patient
     * @return {[type]} [description]
     */
    this.onShow = function(){
        _self.similarView.show();
        $('#patients_form__diagsGrid').w2render(_self.gridDiags);
        fields.fieldName.focus();
    };

    /**
     * When user select a similar patient
     *
     * @param ev {views.SimilarSearchView#selectSimilar}
     */
    this.onSelectSimilar = function(ev){
        _self.EMIT("selectPatient", {id : ev.data.patient._id}) ;
    } ;


    /**
     * Search similar
     * @todo 
     * - show all patient when create new patient which has some fields matched
     */
     
    this.searchSimilarName = function(){
        if(!_self.patient){
            var search = fields.fieldName.value().name;
            _self.similarView.searchSimilar("name", search);
        }
        
    };

    /**
     * Search similar
     * @todo 
     * - show all patient when create new patient which has some fields matched
     */
     
    this.searchSimilarIdentify = function(){
        if(!_self.patient){
            var search = fields.fieldIdentifyCardNumber.value().identifyCardNumber;
            _self.similarView.searchSimilar("identifyCardNumber", search);
        }
        
    };

    /**
     * Search similar
     * @todo 
     * - show all patient when create new patient which has some fields matched
     */
     
    this.searchSimilarPhoneNumber = function(){
        if(!_self.patient){
            var search = fields.fieldPhoneNumber.value().phoneNumber;
            _self.similarView.searchSimilar("phoneNumber", search);
        }
        
    };

    /**
     * Show similar search
     */
    this.showSimilar = function(){
        $('#patients_form__similar').css("display", "inline-block");
        $('#patients_form__patient').css({
            width: "calc(100% - 415px)",
            display: "inline-block",
            "margin-bottom": "20px"
        });
        _self.similarView.show();
        $('.patients_form__coordinates').remove("col-2-3");
        $('.patients_form__notesFieldSet').css("width" , "calc(100% - 27px)") ;
    };

    /**
     * Hide similar search
     * When not create patient, hide similar search
     */
    this.hideSimilar = function(){
        $('#patients_form__similar').css("display","none") ;
        $('#patients_form__patient').css({
            width : "calc(100% - 10px)",
            display: "block",
            "margin-bottom": "0px"}) ;
        $('.patients_form__coordinates').addClass("col-2-3") ;
        $('.patients_form__notesFieldSet').css("width" , "60% ! important") ;
    } ;

    /**
     * delete one diagnosis of patient
     * @todo 
     * - confirm delete diagnosis
     * - if yes then delete this one, render list diagnosis of patient and close this dialog, else only close this dialog
     * @param  {object} diag: this one which you want delete
     */
    this.onDeleteDiag = function(diag){
        if(licenseErr){
            return _self.info(t("mustHaveLicense"));
        }
        if(!_self.patient){
            return ;
        }

        var buttons = {};
        buttons[t("patients.confirmDeleteDiagYes")] = function(){
            _self.emit("deleteDiag", {patient: _self.patient, diagnosis: diag});
            _self.clear();
            $(this).dialog("close");
        };

        buttons[t("patients.confirmDeleteDiagNo")] = function(){
            $(this).dialog("close");
        };

        $("#patients_form__confirmDeleteDiag").dialog({
            resizable: false,
            height: 180,
            width: 500,
            modal: true,
            buttons: buttons,
            open: function(){
                $('#patients_form__confirmDeleteDiag').parent().find("button:eq(2)").focus();
            }
        });
    };

}

module.exports = PatientsFormView;