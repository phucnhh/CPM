var BaseView = require("../BaseView.js");
var SearchView = require("../home/search.js");

function HomeView (t, licenseErr){
    BaseView.call(this, t, "home", "home");

    var _self = this;

    this.btnNewPatient = null;
    this.elSearch = null;

    this.searchView = new SearchView(t);

    this._initElements = function(){
        _self.btnNewPatient = _self.getByClass("new_patient");
        _self.elSearch = _self.getById("search");

        _self.searchView.on("selectPatient", function(ev){
            _self.EMIT("selectPatient", {id : ev.data.id}) ;
        }) ;
        _self.searchView.init(_self.elSearch);
        _self.btnNewPatient.addEventListener("click", _self.onNewPatient);
    };

    /**
     *
     * @returns {*}
     */
    this.onNewPatient = function(){
        if(licenseErr){
            return _self.info(t("mustHaveLicense"));
        }
        _self.EMIT("newPatient");
    };


}

module.exports = HomeView;