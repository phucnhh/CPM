var BaseView = require("../BaseView.js");

function FieldGeneric(t, code, type, options, postLabel){
    if(typeof(options) === "string"){
        postLabel = options;
        options = null;
    }

    BaseView.call(this, t, "fields", "generic");

    var _self = this;

    this.initialVisibility = "visible";

    this.type = type;
    this.code = code;
    this.postLabel = postLabel;

    this.elLabel = null;
    this.elInput = null;
    this.elPostLabel = null;
    this.errorMsg = null;

    this._initElements = function(){
        _self.elLabel = _self.getByClass("label");
        _self.elInput = _self.getByClass("input");
        _self.elPostLabel = _self.getByClass("postLabel");

        _self.elLabel.innerText = t("fields." + _self.code);
        _self.elLabel.title = t("fields." + _self.code);

        if(postLabel){
            _self.elPostLabel.innerHTML = postLabel;
            _self.elPostLabel.style.display = "";
        }
    };

    this.focus = function(){
        _self.elInput.focus();
    };


    /**
     * check if the field is empty
     * @returns {boolean} true if field is empty
     */
    this.isEmpty = function(){
        return (_self.value()[_self.code] === null || _self.value()[_self.code] === "");
    };

    /**
     * set if the field is requires or not
     * @param required {boolean} is this field is required
     */
    this.setRequired = function(required){
        if(required){
            $(_self.elLabel).addClass("required");
        } else {
            $(_self.elLabel).removeClass("required");
        }
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
     * Load value to this field
     *
     * @param val the value to load
     */
    this.load = function(val) {
        _self.elInput.value = val?val:"";
    } ;

    this.clear = function(){
        _self.elInput.value = "";
    };

    /**
     * Register an event
     * @param {string} event the event type
     * @param {function} listener the listener function
     */
    this.addEventListener = function(event, listener){
    	_self.elInput.addEventListener(event, listener);
    };

    /**
     * Set if the field is readOnly or not
     * @param {boolean} readOnly is the field is read only
     */
    this.setReadOnly = function(readOnly){
        _self.elInput.disabled = readOnly;
    };
}

module.exports = FieldGeneric;