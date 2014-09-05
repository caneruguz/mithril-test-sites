// Some of this from https://github.com/browserstate/ajaxify

// Polyfill for .bind
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}



var finch = Finch;

var FitzRoy = FitzRoy || function(){
    var routes = [],
        mapping = {},
        base = '',
        init = function(){
            $.expr[':'].external = function (a) {
                var PATTERN_FOR_EXTERNAL_URLS = /^\w+:\/\//;
                var href = $(a).attr('href');
                return href !== undefined &&
                    href.search(PATTERN_FOR_EXTERNAL_URLS) !== -1;
            };
            $.expr[':'].internal = function (a) {
                return $(a).attr('href') !== undefined && !$.expr[':'].external(a);
            };

            History.options.debug = false;

            History.Adapter.bind(window,'statechange',function(){
                finch.call(History.getState().hash);
            });
        };
    init();
};

FitzRoy.prototype.getHash = function(){
    return History.getState().hash;
};
FitzRoy.prototype.pushState = function(data, title, url){
    History.pushState(data, title, url);
};
FitzRoy.prototype.call = function(route){
    finch.call(route);
};
FitzRoy.prototype.add = function(route, fn, context){
    var base = this.base;
    if(route.substring(0, 1)==='['){
        route = route.substring(1, route.length);
        base = '[' + base;
    }
    route = base + route;
    finch.route(route, function(bindings){
        fn.call(context, bindings);
    });
};
FitzRoy.prototype.ajaxify = function(el){
    if(!(el instanceof $)){
        el = $(el);
    }
    var selector = 'a:internal:not(.no-ajax)';
    $(el).off('click', selector).on('click',selector,
        function(event){
            // Prepare
            var $this = $(this),
                url = $this.attr('href'),
                title = $this.attr('title')||null;
            // Continue as normal for cmd clicks etc
            if ( event.which == 2 || event.metaKey ) { return true; }
            // Ajaxify this link
            History.pushState(null, title, url);
            event.preventDefault();
            return false;
        }
    );
};

//module.exports = FitzRoy;
// amd compliance https://github.com/sockjs/sockjs-client/blob/master/lib/index.jsttps://github.com/sockjs/sockjs-client/blob/master/lib/index.js