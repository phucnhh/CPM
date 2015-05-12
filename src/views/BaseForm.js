var BaseView = require("./BaseView.js");

/**
 * Base form view
 *
 * @class
 * @memberof views
 * @param t {i18n} an instance of i18n object
 */
function BaseForm(t, module, name) {
    BaseView.call(this, t, module, name);

    var _self = this;

    /**
     * put here the list of fields of the form
     */
    this.fields = [
        /*{ name : "fieldName", required : true }*/

    ];
    this.elFields = {};

    this._initElements = function () {
        _self.fields.forEach(function (f) {
            _self.elFields[f.name] = _self.container.getElementsByClassName(module + "_" + name + "__" + f.name)[0];
            if (f.required) {
                $(_self.elFields[f.name]).addClass("required");
            }
        });
    };

    /**
     * Get fields values
     *
     * @return {object} values - values of form fields
     */
    this.values = function () {
        var values = {};
        _self.fields.forEach(function (f) {
            if(f.type === "radio"){
                values[f.name] = $('input[name='+ module + "_" + name + "__" +f.name+']:checked', _self.container).val() ;
            }else if(f.type === "checkbox"){
                values[f.name] = _self.elFields[f.name].checked;
            }else{
                values[f.name] = _self.elFields[f.name].value;
            }
        });
        return values;
    };

    /**
     * Load fields values
     *
     * @param {object} values - values to load
     */
    this.load = function (values) {
        _self.fields.forEach(function (f) {
            if(values[f.name] !== undefined && values[f.name] !== null){
                if(f.type === "radio"){
                    $('input[name='+ module + "_" + name + "__" +f.name+'][value='+values[f.name]+']', _self.container).prop("checked", true) ;
                }else if(f.type === "checkbox"){
                    _self.elFields[f.name].checked = values[f.name] ;
                }else{
                    _self.elFields[f.name].value = values[f.name] ;
                }
            }

        });
    };

    /**
     * Validate the user input.
     * Display errors directly on screen
     *
     * @return {boolean} true if no error, false if some error
     */
    this.validate = function () {
        var values = _self.values();
        var ok = true;
        _self.fields.forEach(function (f) {
            if (f.required && values[f.name] === "") {
                ok = false;
                _self.fieldError(f.name, t("msg.required"));
            }
        });
        return ok;
    };

    this.fieldError = function (field, msg) {
        $(_self.elFields[field]).w2tag(msg, {class: "w2ui-error"});
        //setTimeout(function(){
        //$(_self.elFields[field]).w2tag()	 ;
        //}, 500) ;
    };


    /**
     * Set if fields are readonly or not
     * @param readOnly
     */
    this.setReadOnly= function(readOnly){
        _self.fields.forEach(function (f) {
            if(f.type === "radio"){
                $('input[name='+ module + "_" + name + "__" +f.name+']', _self.container).each(function(){
                    this.disabled = readOnly ;
                })
            }else{
                _self.elFields[f.name].disabled = readOnly ;
            }


        });
    };
}

module.exports = BaseForm;
