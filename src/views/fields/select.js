var BaseView = require("../BaseView.js");
var FieldGeneric = require("./generic.js");


/**
 * select field view
 *
 * @class
 * @extends FieldGeneric
 * @memberOf views
 *
 * @param {i18n} t an instance of i18n object
 * @param {string} code the field code. The label with be taken from translation in fields.code and the value will be reported as {code: value}
 * @param {object} items the entries of the select with the form {val: label}
 * @constructor
 */
function FieldSelect(t, code, items){
    FieldGeneric.call(this, t, code);
    BaseView.call(this, t, "fields", "select");

    var _self = this;

    this.elLabel = null;
    this.elInput = null;

    this.items = {};
    Object.keys(items).forEach(function(key){
        _self.items[key] = items[key];
    });


    this.initialVisibility = "visible";

    this._initElements = function(){
        _self.elLabel = _self.container.getElementsByClassName("fields_" + _self.name + "__label")[0];
        _self.elInput = _self.container.getElementsByClassName("fields_" + _self.name + "__input")[0];

        _self.elLabel.innerText = t("fields." + code);
        _self.elLabel.title = t("fields." + code);

        Object.keys(_self.items).forEach(function(key){
            $('<option value="'+ t("fields." + key)+'">' + t("fields." + _self.items[key]) + '</option>').appendTo($(_self.elInput));
        });
    };

    /**
     * Enable and disable a value
     * @param value
     * @param enable
     */
    this.setValueEnable = function(value, enable){
        if(enable){
            $(_self.elInput).find("option[value=" + t("fields."+ value) + "]").removeAttr("disabled");
        }else{
            $(_self.elInput).find("option[value=" + t("fields."+ value) + "]").attr("disabled", "disabled");
        }
    };

    /**
     * set if the field is readonly or not
     * @param {boolean} readOnly is this field is read only
     */
    this.setReadOnly = function(readOnly){
        _self.elInput.disabled = readOnly;
    };

    /**
     * get value
     * @returns {object} the value with form {code: value}
     */
    this.value = function(){
        var val = _self.elInput.value;
        if (_self.type === "float" || _self.type === "money") {
            val = val === "" ? null : parseFloat(val, 10);
        } else if (_self.type === "int") {
            val = val === "" ? null : parseInt(val, 10);
        }
        var returnVal = {};
        returnVal[_self.code] = val;
        return returnVal;
    };

    /**
     * [clear description]
     * @return {[type]} [description]
     */
    this.clear = function(){
        var keys = Object.keys(_self.items);
        if(keys && keys.length > 0){
            _self.elInput.value = t("fields." + keys[0]);
        }else{
            _self.elInput.value = "";
        }
    }


}

module.exports = FieldSelect;