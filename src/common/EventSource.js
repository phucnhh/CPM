var async = require("async") ;

var globalListeners = {} ;
var globalInterceptors = {} ;

/**
 * Base object for view
 */ 
function EventSource(){
	this.listeners = {};
    this.interceptors = {};

    var _self = this;
	
	/**
	 * Emit event
	 * 
	 * @param type {string} the type of event
	 * @param [data] {object} the data to give with the signal
	 * @param [global] {boolean} if true, broadcast the event fo global listeners
	 */
	this.emit = function(type, data, global) {
        var list = this.interceptors[type];
        if (!list) {
            list = [];
        }
        if (global && globalInterceptors[type]) {
            list = list.concat(globalInterceptors[type]);
        }

        var callWithCallback = [];
        var intercepted = false;
        list.forEach(function (l) {
            if (intercepted) {
                return; //already intercepted
            }
            if (l.length === 2) {
                //call with callback
                callWithCallback.push(function (cb) {
                    l({event: type, data: data}, function (result) {
                        if (result === false) {
                            cb("intercepted");
                        } else {
                            cb();
                        }
                    });
                });
            } else {
                var result = l({event: type, data: data});
                if (result === false) {
                    //synchronized interception
                    intercepted = true;
                }
            }
        });

        if (intercepted) {
            return; //intercepted, stop here
        }

        if (callWithCallback.length > 0) {
            //there is async interceptors to call
            async.series(callWithCallback, function (err) {
                if (err) {
                    //intercepted stop here!
                    return;
                }
                _self._callListeners(type, data, global);
            });
        } else {
            //no async interceptors, OK to call normal listeners
            _self._callListeners(type, data, global);
        }
    };

    /**
     * Call listeners of an event
     *
     * @param type {string} the type of event
     * @param [data] {object} the data to give with the signal
     * @param [global] {boolean} if true, broadcast the event fo global listeners
     * @private
     */
    this._callListeners = function(type, data, global) {
        var list = this.listeners[type];
        if(!list){
            list = [] ;
        }
        if(global && globalListeners[type]){
            list = list.concat(globalListeners[type]) ;
        }

        list.forEach(function(l){
            l({ event : type, data : data }) ;
        });
	};

    /**
     * Emit a global event
     *
     * same as
     * @example
     *   emit(event, data, true) ;
     *
     * @param type {string} the type of event
     * @param [data] {object} the data to give with the signal
     */
    this.EMIT = function(event, data){
       this.emit(event, data, true) ;
    } ;
	
	/**
	 * Listen to a event
	 * 
	 * @param type {string} the type of event
	 * @param func {function} the function to call when event occurs
     * @param [global] {boolean} if true, listen to global (broadcast) events
	 */
	this.on = function(type, func, global){
        var list = this.listeners;
        if(global){
            list = globalListeners ;
        }
		if(!list[type]){
            list[type] = [];
		}
        list[type].push(func) ;
	};


    /**
     * Listen to a global (broadcast) event
     *
     * same as
     * @example
     *   on(event, func, true) ;
     *
     * @param type {string} the type of event
     * @param func {function} the function to call when event occurs
     */
    this.ON = function(type, func){
        this.on(type, func, true) ;
    } ;

    /**
     * Add a special listener that will be called before normal listener
     * and that can cancel the event by returning false;
     *
     * @param type {string} the type of event
     * @param func {function} the function to call when event occurs
     * @param [global] {boolean} if true, listen to global (broadcast) events
     */
    this.intercept = function(type, func, global){
        var list = this.interceptors;
        if(global){
            list = globalInterceptors ;
        }
        if(!list[type]){
            list[type] = [];
        }
        list[type].push(func) ;
    };

    /**
     * Add interceptor listener to a global (broadcast) event
     *
     * same as
     * @example
     *   intercept(event, func, true) ;
     *
     * @param type {string} the type of event
     * @param func {function} the function to call when event occurs
     */
    this.INTERCEPT = function(type, func){
        this.intercept(type, func, true) ;
    } ;


    /**
     * Use this to receive and forward the event. Example :
     * <pre><code>
     * 	someObjectThatFireSomething.on("anEvent", this.fw) ;
     * </code></pre>
     *
     * @param event {object} the event to forward
     */
    this.fw = function(event){
        _self.emit(event.event, event.data) ;
    };

}

module.exports = EventSource;
