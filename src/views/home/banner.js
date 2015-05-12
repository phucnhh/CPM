var BaseView = require("../BaseView.js");
function BannerView (t, licenseErr){
    BaseView.call(this, t, "home", "banner");

    var _self = this;

    this.elHome = null;
    this.elPatient = null;
    this.elDiagnosis = null;

    this._initElements = function(){
        _self.elHome = _self.getByClass("home");

        _self.elHome.addEventListener("click", function(){
            _self.EMIT("home");
        });
    }
}

module.exports = BannerView;