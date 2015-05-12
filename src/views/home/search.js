var BaseView = require("../BaseView.js");
var uuid = require("node-uuid");

function SearchView(t){

    BaseView.call(this, t, "home", "search");

    var _self = this;

    this.elSearch = null;
    this.elBt = null;
    this.elPopup = null;
    this.elGrid = null;
    this.grid = null;
    this.gridId = uuid.v4();

    this.initialVisibility = "visible";

    this._initElements = function(){
        _self.elSearch = _self.getByClass("search");
        _self.elBt = _self.getByClass("bt");
        _self.elPopup = _self.getByClass("popup");
        _self.elGrid = _self.getByClass("grid");

        $(_self.elBt).button();
        _self.elBt.addEventListener("click", _self.openPopup);
        $(_self.elSearch).keypress(function(e){
            if(e.which == 13){
                _self.openPopup();
            }
        });

        _self.grid = $().w2grid({
            name: _self.gridId,
            show: {
                toolbar: true,
                toolbarReload: false,
                selectColumn: false
            },
            header: '',
            searches: [
                {field: "name", caption: t("fields.name"), type: 'text'},
                {field: "identifyCardNumber", caption: t("fields.identifyCardNumber"), type: "text"},
                {field: "phoneNumber", caption: t("fields.phoneNumber"), type: "text"}
            ],
            columns: [
                {field: 'name', caption: t("fields.name"), size: '150px', sortable: true},
                {field: 'lastName', caption: t("fields.lastName"), size: '100px', sortable: false},
                {field: "identifyCardNumber", caption: t("fields.identifyCardNumber"), size: "150px", sortable: true},
                {field: 'gender', caption: t("fields.gender"), size: '50px', sortable: false},
                {field: 'dateOfBirth', caption: t("fields.dateOfBirth"), size: '100px', sortable: false},
                {field: 'address', caption: t("fields.address"), size: '200px', sortable: false},
                {field: 'phoneNumber', caption: t("fields.phoneNumber"), size: '100px', sortable: false},
                {field: 'specialNotes', caption: t("fields.specialNotes"), size: '150px', sortable: false}
            ],
            records: [],
            onDblClick: function(event){
                _self.emit("selectPatient", {id: event.recid});
                $(_self.elPopup).dialog("close");
            }
        });

    };

    this.onHide = function(){
        _self.emit("hide");
    };

    /**
     * show patients matched
     */
    this.openPopup = function(){
        _self.EMIT("search", {search: "*", callback: function(allPatient){
            $(_self.elPopup).dialog({
                title: t('home.search'),
                width: 900,
                height: 420,
                open: function(){
                    _self.grid.clear();
                    allPatient.forEach(function(patient){
                        patient.recid = patient._id;
                    });
                    _self.grid.add(allPatient);
                    $(_self.elGrid).w2render(_self.gridId);

                    $(_self.elGrid).find(".w2ui-search-all").val(_self.elSearch.value) ;
                    $(_self.elGrid).find(".w2ui-search-all").change() ;
                    var e = $.Event("keydown");
                    e.which = $.ui.keyCode.ENTER ; // # Some key code value
                    $(_self.elGrid).find(".w2ui-search-all").trigger(e);
                },
                close: function(){
                    _self.elSearch.value="";
                }
            });
        }});
    };

    /**
     * clear search field
     */
    this.clear = function(){
        _self.elSearch.value = "";
    };
}

module.exports = SearchView;