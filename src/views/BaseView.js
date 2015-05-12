/**
* Views namespace.
* @namespace views
*/

var EventSource = require("../common/EventSource.js") ;

var loadedCss = {} ;

/**
 * Base object for view
 *
 * @class
 * @memberof views
 * @param t {i18n} an instance of i18n object
 * @param module {string} module name
 * @param name {string} view name
 */
function BaseView(t, module, name){

	EventSource.call(this) ;

	this.module = module ;
	this.name = name;
	this.initialVisibility = "hidden" ;
	this.initDone = false;


	this.defaultContainer = this.module+"_"+this.name+"__container" ;

	this.container = null;
	this.containerErrors = null;
	var _self = this;

	/**
	 * Load the view in an HTML container
	 *
	 * @param elContainer {string} container in which load the view. Optional, if not set, default value defaultContainer is used
	 * @param [callback] {function} called when load is finished
	 */
	this.init = function(elContainer, callback){

		if(elContainer !== undefined && typeof(elContainer) === "function"){
			//elContainer was not given and first argument was callback
			callback = elContainer;
		}
		if(elContainer === undefined || typeof(elContainer) === "function"){
			elContainer = _self.defaultContainer;
		}
		if(!callback){
			callback = function(){} ;
		}

		if(_self.initDone){
			//already init
			callback() ;
			return;
		}

		var fileHtml = _self.name+".html" ;

		var baseUrl = window.location.href ;
		baseUrl = baseUrl.substring(0,baseUrl.lastIndexOf("/")) ;
		var htmlUrl = baseUrl+"/views/"+_self.module+"/"+_self.name+".html" ;

		$.ajax({
		  url: htmlUrl
		})
		.done(function( html ) {
			if(typeof(elContainer) === "string"){
				_self.container = document.getElementById(elContainer);
			}else{
				_self.container = elContainer;
			}

			if(!_self.container){
				throw elContainer+" is not found" ;
			}
			if(_self.initialVisibility === "hidden"){
				_self.hide() ;
			}
			_self.container.innerHTML = html;

			$(_self.container).i18n();


            _self.containerErrors = _self.getByClass("errors") ;

            if(_self._initElements){
                if(_self._initElements.length>0){
                    //_initElements handle callback
                    _self._initElements(function(){
                        _self.initDone = true ;
                        callback() ;
                    }) ;
                }else{
                    //_initElements does not handle callback
                    _self._initElements();
                    _self.initDone = true ;
                    callback();
                }
            }else{
                //no _initElements
                _self.initDone = true ;
                callback() ;
            }
		});

		if(!loadedCss[_self.name]){
			var cssUrl = baseUrl+"/views/"+_self.module+"/"+_self.name+".css" ;
			$('head').append('<link rel="stylesheet" href="'+cssUrl+'" type="text/css" />');
			loadedCss[_self.name] = true ;
		}
	};

    /**
     * Helper function to get a HTMLElement in the view. The searched element must have the CLASS : module_name__id
     *
     * @param id {string}       the id of the element
     * @returns {HTMLElement}   the found HTMLElement
     */
    this.getByClass = function(id){
        return _self.container.getElementsByClassName(_self.module+"_"+_self.name+"__"+id)[0] ;
    };

    /**
     * Helper function to get a HTMLElement. The searched element must have the ID : module_name__id
     *
     * @param id {string}       the id of the element
     * @returns {HTMLElement}   the found HTMLElement
     */
    this.getById = function(id){
        return document.getElementById(_self.module+"_"+_self.name+"__"+id) ;
    };


    /**
	 * Show the view
	 */
	this.show = function(){
		_self.container.style.display = "" ;
        if(_self.onShow){
            _self.onShow() ;
        }
	};

	/**
	 * Hide the view
	 */
	this.hide = function(){
		_self.container.style.display = "none" ;
        if(_self.onHide){
            _self.onHide() ;
        }
	};

	/**
	 * Check if the view is visible
	 * @returns {boolean}
	 */
	this.isVisible = function(){
		return _self.container.style.display !== "none" ;
	}

	this.waitCount = 0;
	this.$waiter = null;

	/**
	 * Start wait animation
	 */
	this.startWait = function(){
		if(_self.waitCount === 0){
			//show wait animation
			var html = '<div id="waiter"><div id="floatingCirclesG"><div class="f_circleG" id="frotateG_01"></div>'+
			'<div class="f_circleG" id="frotateG_02"></div><div class="f_circleG" id="frotateG_03">'+
			'</div><div class="f_circleG" id="frotateG_04"></div><div class="f_circleG" id="frotateG_05">'+
			'</div><div class="f_circleG" id="frotateG_06"></div><div class="f_circleG" id="frotateG_07">'+
			'</div><div class="f_circleG" id="frotateG_08"></div></div></div>' ;
			_self.$waiter = $(html) ;
			var $container = $(_self.container) ;
			_self.$waiter.css({
				position : "absolute",
				top : 0,
				left : 0,
				right : 0,
				bottom : 0
			}) ;
			_self.$waiter.appendTo($(_self.container)) ;
		}
		_self.waitCount++ ;
	} ;

	/**
	* End wait animation
	*/
	this.endWait = function(){
		_self.waitCount-- ;
		if(_self.waitCount === 0){
			_self.$waiter.remove() ;
		}
	} ;

	/**
	 * Display error to user
	 *
	 * @param err {string} the error message
	 */
	this.error = function (err){
        if(_self.containerErrors){
            _self.containerErrors.innerHTML = err ;
            $( _self.containerErrors).effect( "bounce", {}, 500);
        }else{
            alert(err) ;
        }
	};

    /**
     * Display a simple information message
     * @param str
     */
    this.info = function (str){
        if($().dialog){
            $("<div>"+str+"</div>").dialog({
                    buttons: {
                        "OK": function () {
                            $( this ).dialog( "close" );
                        }
                    }
                }
            );
        }else{
            alert(str) ;
        }
    } ;


	/**
	 * Display toaster information
	 * @param str
	 */
	this.toast = function (str, title){

		toastr.options = {
			"closeButton": true,
			"debug": false,
			"positionClass": "toast-top-full-width",
			"onclick": null,
			"showDuration": "300",
			"hideDuration": "1000",
			"timeOut": "2000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
		}
		toastr.success(str, title) ;
	} ;

	/**
	 * Display warning message
	 * @param  {String} str is message
	 * @param  {String} title is title
	 */
	this.warning = function(str, title){
		toastr.options = {
			"closeButton": true,
			"debug": false,
			"positionClass": "toast-top-full-width",
			"onclick": null,
			"showDuration": "300",
			"hideDuration": "1000",
			"timeOut": "2000",
			"extendedTimeOut": "1000",
			"showEasing": "swing",
			"hideEasing": "linear",
			"showMethod": "fadeIn",
			"hideMethod": "fadeOut"
		}
		toastr.warning(str, title);
	};


}

module.exports = BaseView;
