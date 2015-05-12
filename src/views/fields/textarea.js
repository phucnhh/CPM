var FieldGeneric = require("./generic.js");
var BaseView = require("../BaseView.js");

/**
 * Textarea field view
 *
 * @class
 * @extends FieldGeneric
 * @memberOf views
 *
 * @param t {i18n} an instance of i18n object
 * @param code {string} the field code. The label will be taken from translation in fields.code
 *  and the value will reported as {code : value}
 * @constructor
 */
function FieldTextarea(t, code) {
    FieldGeneric.call(this, t, code);
    BaseView.call(this, t, "fields", "textarea");

    var _self = this;

    this.initialVisibility = "visible";

}

module.exports = FieldTextarea;