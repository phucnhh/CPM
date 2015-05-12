var BaseView = require("../BaseView.js");
var moment = require("moment");
var uuid = require("node-uuid");

/**
 * View of patient form
 * @emit
 * 	validate: the user validated the form
 * 	new: the user clicked on button new
 * 	
 * @param {i18n} t an instance of i18n object
 */
function SimilarSearchView(t){

	/**
	 * select similar patient
	 * @name  views.SimilarSearchView#selectSimilar
	 * @event
	 * @property {object} data
	 * @property {object} patient
	 */
	BaseView.call(this, t, "patients", "similar");

	var _self = this;

	this.gridSearchId = uuid.v4();
	this.elGrid = null;

	this._initElements = function(){
		_self.elGrid = _self.getByClass("grid");

		_self.gridSearch = $().w2grid({
			name: _self.gridSearchId,
			header: '',
			searches: [
                {field: "name", caption: t("fields.name"), type: 'text'},
                {field: "identifyCardNumber", caption: t("fields.identifyCardNumber"), type: "text"},
                {field: "phoneNumber", caption: t("fields")}
            ],
			columns: [
				{ field: '_nameLastName', caption: t("fields.name"), size: '140px', sortable : true},
				{field: 'identifyCardNumber', caption: t("fields.identifyCardNumber"), size: '100px', sortable: true},
                { field: 'phoneNumber', caption: t("fields.phoneNumber"), size: '20%', sortable : true}
			],
			records: [],
			onDblClick: function(event){
				_self.emit("selectSimilar", {patient: _self.gridSearch.get(event.recid)});
			}
		});
	};

	/**
	 * show similar search
	 */
	this.onShow = function(){
		$(_self.elGrid).w2render(_self.gridSearch);
	};

	/**
	 * Search similar
	 */
	this.searchSimilar = function(fieldSearch, search){
		if(!search){
			return _self.gridSearch.clear();
		}
		_self.EMIT("search", {fieldSearch: fieldSearch, search: search, callback: function(patients){
			_self.gridSearch.clear();
			if(patients && patients.length > 0){
				patients.forEach(function(patient){
					patient.recid = patient._id;
				});
				_self.gridSearch.add(patients);
			}
		}});
	};
	/**
	 * clear the similat grid
	 */
	this.clear = function(){
		_self.gridSearch.clear();
	};
}

module.exports = SimilarSearchView;