var FieldGeneric = require("./generic.js");
var FieldTextarea = require("./textarea.js");
var FieldDate = require("./date.js");
var FieldSelect = require("./select.js");
var async = require("async");
var _ = require("underscore");

/**
 *
 * @param t
 * @param zipCodes
 * @constructor
 */
function FieldCollection(t){
    var _self = this;

    /**
     * fields of patient
     */
    this.fieldName = new FieldGeneric(t, "name");
    this.fieldLastName = new FieldGeneric(t, "lastName");
    this.fieldIdentifyCardNumber = new FieldGeneric(t, "identifyCardNumber");
    this.fieldBirthday = new FieldDate(t, "dateOfBirth");
    this.fieldGender = new FieldSelect(t, "gender", {"male": "male", "female": "female"});

    this.fieldAddress = new FieldGeneric(t, "address");
    this.fieldPhoneNumber = new FieldGeneric(t, "phoneNumber");
    this.fieldEmail = new FieldGeneric(t, "email");
    this.fieldSpecialNotes = new FieldTextarea(t, "specialNotes");

    /**
     * fields of diagnosis
     */
    this.fieldBlood = new FieldGeneric(t, "blood");
    this.fieldPulse = new FieldGeneric(t, "pulse");
    this.fieldTemperature = new FieldGeneric(t, "temperature");
    this.fieldWeight = new FieldGeneric(t, "weight");
    this.fieldHeight = new FieldGeneric(t, "height");
    this.fieldSymptoms = new FieldTextarea(t, "symptoms");

    /**
     * fields of treatment
     */
    this.fieldMedicineName = new FieldGeneric(t, "medicineName");
    this.fieldMedicineQuantity = new FieldGeneric(t, "medicineQuantity");
    this.fieldUsageNotes = new FieldTextarea(t, "usageNotes");

    this.fieldList = [];

    this.init = function(container, prefix, callback){{
        _self._container = container;
        _self._prefix = prefix;

        var calls = [];
        Object.keys(_self).forEach(function(key){
            var field = _self[key];
            if(typeof field !== "function" && key[0] !== "_"){
                calls.push(function(cb){
                    var el = container.getElementsByClassName(prefix + "__" + field.code)[0];
                    if(el){
                        _self.fieldList.push(field);
                        field.init(el, cb);
                    }else{
                        cb();
                    }
                });
            }
        });

        async.parallel(calls, function(err){
            if(callback){
                callback(err);
            }
        });

    }

    };

    /**
     * Return all fields values
     *
     * @param {boolean} flat if true all values are flattened one big object
     * @param {Array} fields if want get values by some fields
     * @return {object} fields values
     */
    this.values = function(flat, fields){
        var values = {};
        if(fields && fields.length > 0){
            fields.forEach(function(field){
                var fieldResult = _.find(_self.fieldList, function(fieldTmp){
                    return (field == fieldTmp.code);
                });
                if(fieldResult){
                    var val = fieldResult.value();
                    if(Object.keys(val).length === 1){
                        //if has only 1 value, return in main object
                        values[field] = val[field];
                    }else{
                        values[field] = val;
                    }
                }
            });
        }else{
            if(flat===undefined){
                flat = true;
            }
            _self.fieldList.forEach(function(field){
                var val = field.value();
                if(flat){
                    //return all keys in main object
                    Object.keys(val).forEach(function(code){
                        values[code] = val[code];
                    });
                }else{
                    if(Object.keys(val).length === 1){
                        //if has only 1 value, return in main object
                        values[field.code] = val[field.code];
                    }else{
                        values[field.code] = val;
                    }
                }
            });
        }
        return values;

    };


    this.isAllEpmty = function(){
        var allEmpty = true;
        _self.fieldList.every(function(field){
            if(!field.isEmpty()){
                allEmpty = false;
                return false;
            }
            return true;
        });
        return allEmpty;
    };

    /**
     * clear some fields or clear all fields
     * @param  {Array} fields array of fields which need clear
     */
    this.clear = function(fields){
        if(fields){
            //clear some fields
            //@todo find 
            fields.forEach(function(field){
                var fieldResult = _.find(_self.fieldList, function(f){
                    return (field == f.code);
                });
                if(fieldResult){
                    fieldResult.clear();
                }
            });
        }else{
            //clear all fields
            _self.fieldList.forEach(function(field){
                field.clear();
            });
        }
    };

    /**
     * Load values in fields
     *
     * @param values {object} fields values
     */
    this.load = function(values){
        if(values){
            Object.keys(_self).forEach(function (k) {
                var field = _self[k];
                if (typeof field !== "function" && k[0]!=="_" && field.initDone) {
                    if(values[field.code] !== undefined && values[field.code] !== null ){
                        field.load(values[field.code]) ;
                    }
                }
            });
        }
        
    };

    /**
     * set read only
     * @param {boolean} readOnly is fields should be read only
     */
    this.setReadOnly = function(readOnly){
        Object.keys(_self).forEach(function(k){
            var field = _self[k];
            if(typeof field !== "function" && k[0] !== "_" && field.initDone){
                field.setReadOnly(readOnly);
            }
        });
    };
}

module.exports = FieldCollection;