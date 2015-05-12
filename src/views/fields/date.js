var BaseView = require("../BaseView.js");

function FieldDate(t, code, type, options, postLabel){
    if(typeof(options)==="string"){
        postLabel = options;
        options = null;
    }

    BaseView.call(this, t, "fields", "date");

    var _self = this;

    this.initialVisibility = "visible";

    this.type = type;
    this.code = code;
    this.postLabel = postLabel;

    this.elLabel = null;
    this.elInput = null;
    this.errorMsg = null;

    this._initElements = function(){
        _self.elLabel = _self.getByClass("label");
        _self.elInput = _self.getByClass("input");

        _self.elLabel.innerText = t("fields." + _self.code);
        _self.elLabel.title = t("fields." + _self.code);


    };

    this.focus = function(){
        _self.elInput.focus();
    };

    /**
     * check field is empty
     * @returns {boolean} true if this field is empty
     */
    this.isEmpty = function(){
        return (_self.value()[_self.code] === null || _self.value()[_self.code]==="");
    };

    /**
     * get value of field
     * @returns {{}}
     */
    this.value = function(){
        var val = _self.elInput.value;
        if(_self.type === "float" || _self.type === "money"){
            val = val === ""? null : parseFloat(val, 10);
        }else if(_self.type === "int"){
            val = val === "" ? null : parseInt(val, 10);
        }
        var returnVal = {};
        returnVal[_self.code] = val;
        return returnVal;
    };

    this.setRequired = function(required){
        if(required){
            $(_self.elLabel).addClass("required");
        }else{
            $(_self.elLabel).removeClass("required");
        }
    };

    /**
     * load value to this field
     * @return val the value to load
     */
    this.load = function(val){
        _self.elInput.value = val?val:"";
    };

    this.clear = function(){
        _self.elInput.value = "";
    };

    /**
     * Set if the field is read only or not
     * @param {boolean} readOnly is the field is read only
     */
    this.setReadOnly = function(readOnly){
        _self.elInput.disabled = readOnly;
    };
}

module.exports = FieldDate;