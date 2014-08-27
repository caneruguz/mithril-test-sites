(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var m = require('mithril');
var app = {}; // Create a namespace for the entire app

// Load components and add them to the app namespace
app.logs = require('./logs');
app.comments = require('./comments')
app.wiki = require('./wiki')

var linkList= [
    {title: "Home", url: "/broute/"},
    {title: "About", url: "/broute/about"},
    {title: "Item Example", url: "/broute/item/2/SomeTitle"}
];

var links = m(".links", [
    linkList.map(function(link) {
        return m("a", {href: link.url, config : m.route }, link.title)
    })
]);


app.pages = {};

app.pages.model =  [
        {
            id: 1,
            title: "About Page",
            content : "Welcome to Mithril testing"
        },
        {
            id: 2,
            title: "App Page",
            content : "Get some things done here"
        },
        {
            id: 3,
            title: "Checking Route parameters",
            content : "Check if the below information is correct, it should repeat the parameters in the url as /id/title."
        }
    ];

app.pages.controller = function(pageId) {
    this.pageInfo = m.prop(app.pages.model)
    this.pageId = m.prop(pageId);
}

app.pages.view = function(ctrl) {
    console.log(ctrl.pageInfo())
    if(ctrl.pageId() === 0 ){
        return m("div", "Page info did not load")
    } else {
        return ctrl.pageInfo().map(function(item, index, array){
                if(item.id === ctrl.pageId()){
                    return [ m('h1', item.title), m('p', item.content), ];
                }
        });
    }

}


var home = {
    controller : function(){
        this.page = new app.pages.controller(2);
        this.logs = new app.logs.controller();
        this.comments = new app.comments.controller();
        this.wiki = new app.wiki.controller();

    },
    view : function(ctrl) {
        return m('#container', [
                m('.box', links),
                m('.box', app.pages.view(ctrl.page)),
                m('.box', app.wiki.view(ctrl.wiki)),
                m('.box', app.comments.view(ctrl.comments)),
                m('.box', app.logs.view(ctrl.logs))

        ])
    }
}

var about = {
    controller : function(){
        this.page = new app.pages.controller(1);
    },
    view : function(ctrl) {
        return m('#container', [
            m('.box', links),
            m('.box', app.pages.view(ctrl.page)),
            m('.box', "Nothing else here")
        ])
    }
}
var item = {
    controller : function(){
        this.page = new app.pages.controller(3);
    },
    view : function(ctrl) {
        return m('#container', [
            m('.box', links),
            m('.box', app.pages.view(ctrl.page)),
            m('.box',[
                m('h4', [
                    m('span', "ID :"),
                    m('span#param_id', m.route.param("id") )
                ]),
                m('h4', [
                    m('span', "Title :"),
                    m('span#param_title', m.route.param("title") )
                ])

            ])
        ])
    }
}


m.route.mode = "pathname";
m.route(document.getElementById('container'), "/broute/", {
    "/broute/": home,
    "/broute/about": about,
    "/broute/item/:id/:title": item
});
},{"./comments":2,"./logs":3,"./wiki":4,"mithril":5}],2:[function(require,module,exports){
var logs = require('./logs');

var comments = {};

// Load existing comments from server
//comments.List = m.request({method: "GET", url: "../components/comments/comments.json"});

// Comment Model, uses information from the App about User.
comments.comment = function(content){
    this.userid = 1;
    this.username = "Caner";
    this.content = content;
    this.date = new Date();
    this.show = true;
}

comments.controller = function (){
    var self = this;
    this.comments = m.prop("");
    m.request({method: "GET", url: "comments.json"}).then(this.comments);
    // Filter search term to use for filtering later.
    this.filterText = m.prop("");
    // Declare and empty setter for content of the comment to bind it to the form.
    this.content = m.prop("");
    // add comment
    this.add = function () {
        if(self.content()){
            // New comment
            self.comments().push(new comments.comment(self.content()));
            // Log this behavior by adding a new Log model
            logs.List().push(new logs.singleLog("comment", self.content()));
            // Reset the form for new comments.
            self.content("");
        }

    }
    // filtering
    this.filter = function (){
        var result;
        // If filtertext is set run filter
        if(self.filterText()){
            // Go through each comment
            self.comments().map(function(comment, index){
                var text = self.filterText().toLowerCase()
                result = comment.content.toLowerCase().indexOf(text);
                // Compare text
                if(result !== -1){
                    // If found, add to comment an attribute called cmshow
                    comment.show = true;
                } else {
                    // If not found, add to the comment and attribute called cmhide
                    comment.show = false;
                }
            });
        } else {
            // If filtertext is not set reset view to show everything
            self.comments().map(function(comment, index){
                comment.show = true;
            });
        }
    }
    this.runFilter = function(e){
        var event = e || window.event; //IE does not pass the event object
        m.withAttr("value", self.filterText)(event);
        self.filter();
    }
}

// Loads commenting form and list of comments
// Loads commenting form and list of comments
comments.view = function(ctrl){
    return m(".container-fluid", [m(".row", [
        m(".col-sm-12", [
            m(".col-xs-12[id='cm-comment']", [
                m("input.#filter.form-control.input-sm[placeholder='filter'][type='text']", { onkeyup: ctrl.runFilter, value : ctrl.filterText()} )
            ]),
            m("hr"),
            m("[id='cm-boxWrapper']", [
                m(".row", [
                    m(".col-xs-9", [
                        m("textarea.ht-comment-box", {onchange: m.withAttr("value", ctrl.content), value: ctrl.content()})
                    ]),
                    m(".col-xs-3", [
                        m("button#addComment.btn.btn-default.btn-block.btn-lg", {onclick: ctrl.add}, " Add ")
                    ])
                ]),
                m(".row", [
                    m(".col-xs-12[id='cm-commentList']", [
                        m("table.table.table-condensed", [
                            m("tbody", [
                                ctrl.comments().map(function(comment, index){
                                    if(comment.show){
                                        return m("tr.commentRow", [
                                            m("td", [
                                                m("b", comment.username)
                                            ]),
                                            m("td.commentContent", comment.content),
                                            m("td", [
                                                m("span.text-muted", comment.date)
                                            ])
                                        ])
                                    }
                                })
                            ])
                        ])
                    ])
                ])
            ])
        ])
    ]),
        m(".col-sm-4.col-xs-12", [
            m("[id='cm-logs']", [

            ])
        ])
    ])
}

module.exports = comments;
},{"./logs":3}],3:[function(require,module,exports){

var logs = {};

// Assign model directly to loaded content
logs.List = m.prop("")
m.request({method: "GET", url: "logs.json"}).then(logs.List);

// Model for individual logs
logs.singleLog = function(logType, logContent){
    this.logText = "";
    switch(logType){
        case "comment" :
            this.logText =  " commented ";
            break;
        case "wiki" :
            this.logText = " changed wiki to version ";
            break;
    }
    this.logUserID = 1;
    this.logUser = "Caner";;
    this.logDate = new Date();
    this.logContent = logContent;
}

// Log actions, add log
logs.controller = function(){
    // This example is not using the m.prop getter and setter since direct javascript makes more sense for one time log writing.
    // Add log -- This gets fired in the controller when comment is being added. Will implement for wiki as well.

}

// Log layout, loads directly from the model, not through the controller.
logs.view = function(controller){
    return [
        m("table.table.table-condensed", [
            m("tbody", [
                logs.List().map(function(log, index){
                    return m("tr.log-row", [
                        m("td", [
                            m("span.text-muted", log.logDate)
                        ]),
                        m("td", [
                            m("a[href='user/1']", log.logUser),
                            " ",
                            m("span.logText", log.logText),
                            m("i.logContent", log.logContent),
                            ".\n                        "
                        ])
                    ])
                })

            ])
        ])
    ]
}

module.exports = logs;
},{}],4:[function(require,module,exports){
var logs = require('./logs');


var wiki = {};

wiki.data =

    wiki.model = function(content){
        this.title = m.prop(content.title);
        this.content = m.prop(content.content);
        this.version = m.prop(content.version)
    }
// Long way of binding the data to view
wiki.controller = function(){
    var self = this;
    //this.data = m.prop();
    this.data = m.request({method: "GET", url: './wiki.json', type : wiki.model});//.then(self.data);

    this.edit = m.prop(false);


    this.toggleView = function(){
        if(self.edit()){
            // save
            self.data().version(self.data().version()+1);
            logs.List().push(new logs.singleLog("wiki", self.data().version()));
            self.edit(false);
        } else {

            self.edit(true);
        }
    }
    return self;
}


// Wiki html
wiki.view = function (controller) {
    if(controller.edit()){
        return m(".panel.panel-default",  [
            m(".panel-heading", [
                m(".row", [
                    m(".col-md-9", [
                        m("span", "Change Title: "), m("input.form-control.editWikiTitle", { onchange: m.withAttr("value", controller.data().title), value: controller.data().title()} )
                    ]),
                    m(".col-md-3.cm-wikiBar", [
                        m(".btn-group", [
                            m("button.saveWikiButton.btn.btn-sm.btn-default[type='button']",{ onclick : controller.toggleView },  m("i.fa.fa-save", " Save"))
                        ])
                    ])
                ])
            ]),
            m(".panel-body", [
                m("textarea.ht-wiki-edit", { onchange: m.withAttr("value", controller.data().content), value: controller.data().content()} )
            ])
        ])
    } else {
        return m(".panel", [
            m(".panel-heading", [
                m(".row", [
                    m(".col-md-9", [
                        m("h2.panel-title", controller.data().title())
                    ]),
                    m(".col-md-3.cm-wikiBar", [
                        m(".btn-group", [
                            m("button.editWikiButton.btn.btn-sm.btn-default[type='button']",{ onclick : controller.toggleView }, m("i.fa.fa-pencil", " Edit"))
                        ])
                    ])
                ])
            ]),
            m(".panel-body", [
                m("p#wiki-preview", controller.data().content())
            ]),
            m(".panel-footer.wikiVersion", " Version " + controller.data().version())
        ])
    }


};

module.exports = wiki;
},{"./logs":3}],5:[function(require,module,exports){
Mithril = m = new function app(window, undefined) {
	var type = {}.toString
	var parser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[.+?\])/g, attrParser = /\[(.+?)(?:=("|'|)(.*?)\2)?\]/
	var voidElements = /AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TR‌​ACK|WBR/

	function m() {
		var args = arguments
		var hasAttrs = args[1] != null && type.call(args[1]) == "[object Object]" && !("tag" in args[1]) && !("subtree" in args[1])
		var attrs = hasAttrs ? args[1] : {}
		var classAttrName = "class" in attrs ? "class" : "className"
		var cell = {tag: "div", attrs: {}}
		var match, classes = []
		while (match = parser.exec(args[0])) {
			if (match[1] == "") cell.tag = match[2]
			else if (match[1] == "#") cell.attrs.id = match[2]
			else if (match[1] == ".") classes.push(match[2])
			else if (match[3][0] == "[") {
				var pair = attrParser.exec(match[3])
				cell.attrs[pair[1]] = pair[3] || (pair[2] ? "" :true)
			}
		}
		if (classes.length > 0) cell.attrs[classAttrName] = classes.join(" ")

		cell.children = hasAttrs ? args[2] : args[1]

		for (var attrName in attrs) {
			if (attrName == classAttrName) cell.attrs[attrName] = (cell.attrs[attrName] || "") + " " + attrs[attrName]
			else cell.attrs[attrName] = attrs[attrName]
		}
		return cell
	}
	function build(parentElement, parentTag, parentCache, parentIndex, data, cached, shouldReattach, index, editable, namespace, configs) {
		//`build` is a recursive function that manages creation/diffing/removal of DOM elements based on comparison between `data` and `cached`
		//the diff algorithm can be summarized as this:
		//1 - compare `data` and `cached`
		//2 - if they are different, copy `data` to `cached` and update the DOM based on what the difference is
		//3 - recursively apply this algorithm for every array and for the children of every virtual element
		
		//the `cached` data structure is essentially the same as the previous redraw's `data` data structure, with a few additions:
		//- `cached` always has a property called `nodes`, which is a list of DOM elements that correspond to the data represented by the respective virtual element
		//- in order to support attaching `nodes` as a property of `cached`, `cached` is *always* a non-primitive object, i.e. if the data was a string, then cached is a String instance. If data was `null` or `undefined`, cached is `new String("")`
		//- `cached also has a `configContext` property, which is the state storage object exposed by config(element, isInitialized, context)
		//- when `cached` is an Object, it represents a virtual element; when it's an Array, it represents a list of elements; when it's a String, Number or Boolean, it represents a text node

		//`parentElement` is a DOM element used for W3C DOM API calls
		//`parentTag` is only used for handling a corner case for textarea values
		//`parentCache` is used to remove nodes in some multi-node cases
		//`parentIndex` and `index` are used to figure out the offset of nodes. They're artifacts from before arrays started being flattened and are likely refactorable
		//`data` and `cached` are, respectively, the new and old nodes being diffed
		//`shouldReattach` is a flag indicating whether a parent node was recreated (if so, and if this node is reused, then this node must reattach itself to the new parent)
		//`editable` is a flag that indicates whether an ancestor is contenteditable
		//`namespace` indicates the closest HTML namespace as it cascades down from an ancestor
		//`configs` is a list of config functions to run after the topmost `build` call finishes running

		//there's logic that relies on the assumption that null and undefined data are equivalent to empty strings
		//- this prevents lifecycle surprises from procedural helpers that mix implicit and explicit return statements
		//- it simplifies diffing code
		if (data == null) data = ""
		if (data.subtree === "retain") return cached

		var cachedType = type.call(cached), dataType = type.call(data)
		if (cached == null || cachedType != dataType) {
			if (cached != null) {
				if (parentCache && parentCache.nodes) {
					var offset = index - parentIndex
					var end = offset + (dataType == "[object Array]" ? data : cached.nodes).length
					clear(parentCache.nodes.slice(offset, end), parentCache.slice(offset, end))
				}
				else if (cached.nodes) clear(cached.nodes, cached)
			}
			cached = new data.constructor
			cached.nodes = []
		}

		if (dataType == "[object Array]") {
			data = flatten(data)
			var nodes = [], intact = cached.length === data.length, subArrayCount = 0

			//keys algorithm: sort elements without recreating them if keys are present
			//1) create a map of all existing keys, and mark all for deletion
			//2) add new keys to map and mark them for addition
			//3) if key exists in new list, change action from deletion to a move
			//4) for each key, handle its corresponding action as marked in previous steps
			//5) copy unkeyed items into their respective gaps
			var DELETION = 1, INSERTION = 2 , MOVE = 3
			var existing = {}, unkeyed = [], shouldMaintainIdentities = false
			for (var i = 0; i < cached.length; i++) {
				if (cached[i] && cached[i].attrs && cached[i].attrs.key != null) {
					shouldMaintainIdentities = true
					existing[cached[i].attrs.key] = {action: DELETION, index: i}
				}
			}
			if (shouldMaintainIdentities) {
				for (var i = 0; i < data.length; i++) {
					if (data[i] && data[i].attrs) {
						if (data[i].attrs.key != null) {
							var key = data[i].attrs.key
							if (!existing[key]) existing[key] = {action: INSERTION, index: i}
							else existing[key] = {action: MOVE, index: i, from: existing[key].index, element: parentElement.childNodes[existing[key].index]}
						}
						else unkeyed.push({index: i, element: parentElement.childNodes[i]})
					}
				}
				var actions = Object.keys(existing).map(function(key) {return existing[key]})
				var changes = actions.sort(function(a, b) {return a.action - b.action || a.index - b.index})
				var newCached = cached.slice()

				for (var i = 0, change; change = changes[i]; i++) {
					if (change.action == DELETION) {
						clear(cached[change.index].nodes, cached[change.index])
						newCached.splice(change.index, 1)
					}
					if (change.action == INSERTION) {
						var dummy = window.document.createElement("div")
						dummy.key = data[change.index].attrs.key
						parentElement.insertBefore(dummy, parentElement.childNodes[change.index])
						newCached.splice(change.index, 0, {attrs: {key: data[change.index].attrs.key}, nodes: [dummy]})
					}

					if (change.action == MOVE) {
						if (parentElement.childNodes[change.index] !== change.element && change.element !== null) {
							parentElement.insertBefore(change.element, parentElement.childNodes[change.index])
						}
						newCached[change.index] = cached[change.from]
					}
				}
				for (var i = 0; i < unkeyed.length; i++) {
					var change = unkeyed[i]
					parentElement.insertBefore(change.element, parentElement.childNodes[change.index])
					newCached[change.index] = cached[change.index]
				}
				cached = newCached
				cached.nodes = []
				for (var i = 0, child; child = parentElement.childNodes[i]; i++) cached.nodes.push(child)
			}
			//end key algorithm

			for (var i = 0, cacheCount = 0; i < data.length; i++) {
				//diff each item in the array
				var item = build(parentElement, parentTag, cached, index, data[i], cached[cacheCount], shouldReattach, index + subArrayCount || subArrayCount, editable, namespace, configs)
				if (item === undefined) continue
				if (!item.nodes.intact) intact = false
				var isArray = type.call(item) == "[object Array]"
				subArrayCount += isArray ? item.length : 1
				cached[cacheCount++] = item
			}
			if (!intact) {
				//diff the array itself
				
				//update the list of DOM nodes by collecting the nodes from each item
				for (var i = 0; i < data.length; i++) {
					if (cached[i] != null) nodes = nodes.concat(cached[i].nodes)
				}
				//remove items from the end of the array if the new array is shorter than the old one
				//if errors ever happen here, the issue is most likely a bug in the construction of the `cached` data structure somewhere earlier in the program
				for (var i = 0, node; node = cached.nodes[i]; i++) {
					if (node.parentNode != null && nodes.indexOf(node) < 0) clear([node], [cached[i]])
				}
				//add items to the end if the new array is longer than the old one
				for (var i = cached.nodes.length, node; node = nodes[i]; i++) {
					if (node.parentNode == null) parentElement.appendChild(node)
				}
				if (data.length < cached.length) cached.length = data.length
				cached.nodes = nodes
			}
		}
		else if (data != null && dataType == "[object Object]") {
			//if an element is different enough from the one in cache, recreate it
			if (data.tag != cached.tag || Object.keys(data.attrs).join() != Object.keys(cached.attrs).join() || data.attrs.id != cached.attrs.id) {
				clear(cached.nodes)
				if (cached.configContext && typeof cached.configContext.onunload == "function") cached.configContext.onunload()
			}
			if (typeof data.tag != "string") return

			var node, isNew = cached.nodes.length === 0
			if (data.attrs.xmlns) namespace = data.attrs.xmlns
			else if (data.tag === "svg") namespace = "http://www.w3.org/2000/svg"
			else if (data.tag === "math") namespace = "http://www.w3.org/1998/Math/MathML"
			if (isNew) {
				node = namespace === undefined ? window.document.createElement(data.tag) : window.document.createElementNS(namespace, data.tag)
				cached = {
					tag: data.tag,
					//process children before attrs so that select.value works correctly
					children: build(node, data.tag, undefined, undefined, data.children, cached.children, true, 0, data.attrs.contenteditable ? node : editable, namespace, configs),
					attrs: setAttributes(node, data.tag, data.attrs, {}, namespace),
					nodes: [node]
				}
				parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			else {
				node = cached.nodes[0]
				setAttributes(node, data.tag, data.attrs, cached.attrs, namespace)
				cached.children = build(node, data.tag, undefined, undefined, data.children, cached.children, false, 0, data.attrs.contenteditable ? node : editable, namespace, configs)
				cached.nodes.intact = true
				if (shouldReattach === true && node != null) parentElement.insertBefore(node, parentElement.childNodes[index] || null)
			}
			//schedule configs to be called. They are called after `build` finishes running
			if (typeof data.attrs["config"] === "function") {
				configs.push(data.attrs["config"].bind(window, node, !isNew, cached.configContext = cached.configContext || {}, cached))
			}
		}
		else if (typeof dataType != "function") {
			//handle text nodes
			var nodes
			if (cached.nodes.length === 0) {
				if (data.$trusted) {
					nodes = injectHTML(parentElement, index, data)
				}
				else {
					nodes = [window.document.createTextNode(data)]
					if (!parentElement.nodeName.match(voidElements)) parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null)
				}
				cached = "string number boolean".indexOf(typeof data) > -1 ? new data.constructor(data) : data
				cached.nodes = nodes
			}
			else if (cached.valueOf() !== data.valueOf() || shouldReattach === true) {
				nodes = cached.nodes
				if (!editable || editable !== window.document.activeElement) {
					if (data.$trusted) {
						clear(nodes, cached)
						nodes = injectHTML(parentElement, index, data)
					}
					else {
						//corner case: replacing the nodeValue of a text node that is a child of a textarea/contenteditable doesn't work
						//we need to update the value property of the parent textarea or the innerHTML of the contenteditable element instead
						if (parentTag === "textarea") parentElement.value = data
						else if (editable) editable.innerHTML = data
						else {
							if (nodes[0].nodeType == 1 || nodes.length > 1) { //was a trusted string
								clear(cached.nodes, cached)
								nodes = [window.document.createTextNode(data)]
							}
							parentElement.insertBefore(nodes[0], parentElement.childNodes[index] || null)
							nodes[0].nodeValue = data
						}
					}
				}
				cached = new data.constructor(data)
				cached.nodes = nodes
			}
			else cached.nodes.intact = true
		}

		return cached
	}
	function setAttributes(node, tag, dataAttrs, cachedAttrs, namespace) {
		var groups = {}
		for (var attrName in dataAttrs) {
			var dataAttr = dataAttrs[attrName]
			var cachedAttr = cachedAttrs[attrName]
			if (!(attrName in cachedAttrs) || (cachedAttr !== dataAttr) || node === window.document.activeElement) {
				cachedAttrs[attrName] = dataAttr
				if (attrName === "config") continue
				else if (typeof dataAttr == "function" && attrName.indexOf("on") == 0) {
					node[attrName] = autoredraw(dataAttr, node)
				}
				else if (attrName === "style" && typeof dataAttr == "object") {
					for (var rule in dataAttr) {
						if (cachedAttr == null || cachedAttr[rule] !== dataAttr[rule]) node.style[rule] = dataAttr[rule]
					}
					for (var rule in cachedAttr) {
						if (!(rule in dataAttr)) node.style[rule] = ""
					}
				}
				else if (namespace != null) {
					if (attrName === "href") node.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataAttr)
					else if (attrName === "className") node.setAttribute("class", dataAttr)
					else node.setAttribute(attrName, dataAttr)
				}
				else if (attrName === "value" && tag === "input") {
					if (node.value !== dataAttr) node.value = dataAttr
				}
				else if (attrName in node && !(attrName == "list" || attrName == "style")) {
					node[attrName] = dataAttr
				}
				else node.setAttribute(attrName, dataAttr)
			}
		}
		return cachedAttrs
	}
	function clear(nodes, cached) {
		for (var i = nodes.length - 1; i > -1; i--) {
			if (nodes[i] && nodes[i].parentNode) {
				nodes[i].parentNode.removeChild(nodes[i])
				cached = [].concat(cached)
				if (cached[i]) unload(cached[i])
			}
		}
		if (nodes.length != 0) nodes.length = 0
	}
	function unload(cached) {
		if (cached.configContext && typeof cached.configContext.onunload == "function") cached.configContext.onunload()
		if (cached.children) {
			if (type.call(cached.children) == "[object Array]") for (var i = 0; i < cached.children.length; i++) unload(cached.children[i])
			else if (cached.children.tag) unload(cached.children)
		}
	}
	function injectHTML(parentElement, index, data) {
		var nextSibling = parentElement.childNodes[index]
		if (nextSibling) {
			var isElement = nextSibling.nodeType != 1
			var placeholder = window.document.createElement("span")
			if (isElement) {
				parentElement.insertBefore(placeholder, nextSibling)
				placeholder.insertAdjacentHTML("beforebegin", data)
				parentElement.removeChild(placeholder)
			}
			else nextSibling.insertAdjacentHTML("beforebegin", data)
		}
		else parentElement.insertAdjacentHTML("beforeend", data)
		var nodes = []
		while (parentElement.childNodes[index] !== nextSibling) {
			nodes.push(parentElement.childNodes[index])
			index++
		}
		return nodes
	}
	function flatten(data) {
		var flattened = []
		for (var i = 0; i < data.length; i++) {
			var item = data[i]
			if (type.call(item) == "[object Array]") flattened.push.apply(flattened, flatten(item))
			else flattened.push(item)
		}
		return flattened
	}
	function autoredraw(callback, object, group) {
		return function(e) {
			e = e || window.event
			m.redraw.strategy("diff")
			m.startComputation()
			try {return callback.call(object, e)}
			finally {
				if (!lastRedrawId) lastRedrawId = -1;
				m.endComputation()
			}
		}
	}

	var html
	var documentNode = {
		insertAdjacentHTML: function(_, data) {
			window.document.write(data)
			window.document.close()
		},
		appendChild: function(node) {
			if (html === undefined) html = window.document.createElement("html")
			if (node.nodeName == "HTML") html = node
			else html.appendChild(node)
			if (window.document.documentElement && window.document.documentElement !== html) {
				window.document.replaceChild(html, window.document.documentElement)
			}
			else window.document.appendChild(html)
		},
		insertBefore: function(node) {
			this.appendChild(node)
		},
		childNodes: []
	}
	var nodeCache = [], cellCache = {}
	m.render = function(root, cell, forceRecreation) {
		var configs = []
		if (!root) throw new Error("Please ensure the DOM element exists before rendering a template into it.")
		var id = getCellCacheKey(root)
		var node = root == window.document || root == window.document.documentElement ? documentNode : root
		if (cellCache[id] === undefined) clear(node.childNodes)
		if (forceRecreation === true) reset(root)
		cellCache[id] = build(node, null, undefined, undefined, cell, cellCache[id], false, 0, null, undefined, configs)
		for (var i = 0; i < configs.length; i++) configs[i]()
	}
	function getCellCacheKey(element) {
		var index = nodeCache.indexOf(element)
		return index < 0 ? nodeCache.push(element) - 1 : index
	}

	m.trust = function(value) {
		value = new String(value)
		value.$trusted = true
		return value
	}

	function _prop(store) {
		var prop = function() {
			if (arguments.length) store = arguments[0]
			return store
		}

		prop.toJSON = function() {
			return store
		}

		return prop
	}

	m.prop = function (store) {
		if ((typeof store === 'object' || typeof store === 'function') &&
				typeof store.then === 'function') {
			var prop = _prop()
			newPromisedProp(prop, store).then(prop)

			return prop
		}

		return _prop(store)
	}

	var roots = [], modules = [], controllers = [], lastRedrawId = 0, computePostRedrawHook = null, prevented = false
	m.module = function(root, module) {
		var index = roots.indexOf(root)
		if (index < 0) index = roots.length
		var isPrevented = false
		if (controllers[index] && typeof controllers[index].onunload == "function") {
			var event = {
				preventDefault: function() {isPrevented = true}
			}
			controllers[index].onunload(window.event)
		}
		if (!isPrevented) {
			m.redraw.strategy("all")
			m.startComputation()
			roots[index] = root
			modules[index] = module
			controllers[index] = new module.controller
			m.endComputation()
		}
	}
	m.redraw = function(force) {
		var cancel = window.cancelAnimationFrame || window.clearTimeout
		var defer = window.requestAnimationFrame || window.setTimeout
		if (lastRedrawId && force !== true) {
			cancel(lastRedrawId)
			lastRedrawId = defer(redraw, 0)
		}
		else {
			redraw()
			lastRedrawId = defer(function() {lastRedrawId = null}, 0)
		}
	}
	m.redraw.strategy = m.prop()
	function redraw() {
		var mode = m.redraw.strategy()
		for (var i = 0; i < roots.length; i++) {
			if (controllers[i] && mode != "none") m.render(roots[i], modules[i].view(controllers[i]), mode == "all")
		}
		if (computePostRedrawHook) {
			computePostRedrawHook()
			computePostRedrawHook = null
		}
		lastRedrawId = null
		m.redraw.strategy("diff")
	}

	var pendingRequests = 0
	m.startComputation = function() {pendingRequests++}
	m.endComputation = function() {
		pendingRequests = Math.max(pendingRequests - 1, 0)
		if (pendingRequests == 0) m.redraw()
	}

	m.withAttr = function(prop, withAttrCallback) {
		return function(e) {
			e = e || window.event
			var currentTarget = e.currentTarget || this
			withAttrCallback(prop in currentTarget ? currentTarget[prop] : currentTarget.getAttribute(prop))
		}
	}

	//routing
	var modes = {pathname: "", hash: "#", search: "?"}
	var redirect = function() {}, routeParams = {}, currentRoute
	m.route = function() {
		if (arguments.length === 0) return currentRoute
		else if (arguments.length === 3 && typeof arguments[1] == "string") {
			var root = arguments[0], defaultRoute = arguments[1], router = arguments[2]
			redirect = function(source) {
				var path = currentRoute = normalizeRoute(source)
				if (!routeByValue(root, router, path)) {
					m.route(defaultRoute, true)
				}
			}
			var listener = m.route.mode == "hash" ? "onhashchange" : "onpopstate"
			window[listener] = function() {
				if (currentRoute != normalizeRoute(window.location[m.route.mode])) {
					redirect(window.location[m.route.mode])
				}
			}
			computePostRedrawHook = setScroll
			window[listener]()
		}
		else if (arguments[0].addEventListener) {
			var element = arguments[0]
			var isInitialized = arguments[1]
			if (element.href.indexOf(modes[m.route.mode]) < 0) {
				element.href = window.location.pathname + modes[m.route.mode] + element.pathname
			}
			if (!isInitialized) {
				element.removeEventListener("click", routeUnobtrusive)
				element.addEventListener("click", routeUnobtrusive)
			}
		}
		else if (typeof arguments[0] == "string") {
			currentRoute = arguments[0]
			var querystring = typeof arguments[1] == "object" ? buildQueryString(arguments[1]) : null
			if (querystring) currentRoute += (currentRoute.indexOf("?") === -1 ? "?" : "&") + querystring

			var shouldReplaceHistoryEntry = (arguments.length == 3 ? arguments[2] : arguments[1]) === true

			if (window.history.pushState) {
				computePostRedrawHook = function() {
					window.history[shouldReplaceHistoryEntry ? "replaceState" : "pushState"](null, window.document.title, modes[m.route.mode] + currentRoute)
					setScroll()
				}
				redirect(modes[m.route.mode] + currentRoute)
			}
			else window.location[m.route.mode] = currentRoute
		}
	}
	m.route.param = function(key) {return routeParams[key]}
	m.route.mode = "search"
	function normalizeRoute(route) {return route.slice(modes[m.route.mode].length)}
	function routeByValue(root, router, path) {
		routeParams = {}

		var queryStart = path.indexOf("?")
		if (queryStart !== -1) {
			routeParams = parseQueryString(path.substr(queryStart + 1, path.length))
			path = path.substr(0, queryStart)
		}

		for (var route in router) {
			if (route == path) {
				m.module(root, router[route])
				return true
			}

			var matcher = new RegExp("^" + route.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")

			if (matcher.test(path)) {
				path.replace(matcher, function() {
					var keys = route.match(/:[^\/]+/g) || []
					var values = [].slice.call(arguments, 1, -2)
					for (var i = 0; i < keys.length; i++) routeParams[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
					m.module(root, router[route])
				})
				return true
			}
		}
	}
	function routeUnobtrusive(e) {
		e = e || window.event
		if (e.ctrlKey || e.metaKey || e.keyCode == 2) return
		e.preventDefault()
		m.route(e.currentTarget[m.route.mode].slice(modes[m.route.mode].length))
	}
	function setScroll() {
		if (m.route.mode != "hash" && window.location.hash) window.location.hash = window.location.hash
		else window.scrollTo(0, 0)
	}
	function buildQueryString(object, prefix) {
		var str = []
		for(var prop in object) {
			var key = prefix ? prefix + "[" + prop + "]" : prop, value = object[prop]
			str.push(typeof value == "object" ? buildQueryString(value, key) : encodeURIComponent(key) + "=" + encodeURIComponent(value))
		}
		return str.join("&")
	}
	function parseQueryString(str) {
		var pairs = str.split("&"), params = {}
		for (var i = 0; i < pairs.length; i++) {
			var pair = pairs[i].split("=")
			params[decodeSpace(pair[0])] = pair[1] ? decodeSpace(pair[1]) : (pair.length === 1 ? true : "")
		}
		return params
	}
	function decodeSpace(string) {
		return decodeURIComponent(string.replace(/\+/g, " "))
	}
	function reset(root) {
		var cacheKey = getCellCacheKey(root)
		clear(root.childNodes, cellCache[cacheKey])
		cellCache[cacheKey] = undefined
	}

	function newPromisedProp(prop, promise) {
		prop.then = function () {
			var newProp = m.prop()
			return newPromisedProp(newProp,
				promise.then.apply(promise, arguments).then(newProp))
		}
		prop.promise = prop
		prop.resolve = function (val) {
			prop(val)
			promise = promise.resolve.apply(promise, arguments)
			return prop
		}
		prop.reject = function () {
			promise = promise.reject.apply(promise, arguments)
			return prop
		}

		return prop
	}
	m.deferred = function () {
		return newPromisedProp(m.prop(), new Deferred())
	}
	// Promiz.mithril.js | Zolmeister | MIT
	function Deferred(fn, er) {
		// states
		// 0: pending
		// 1: resolving
		// 2: rejecting
		// 3: resolved
		// 4: rejected
		var self = this,
			state = 0,
			val = 0,
			next = [];

		self['promise'] = self

		self['resolve'] = function (v) {
			if (!state) {
				val = v
				state = 1

				fire()
			}
			return this
		}

		self['reject'] = function (v) {
			if (!state) {
				val = v
				state = 2

				fire()
			}
			return this
		}

		self['then'] = function (fn, er) {
			var d = new Deferred(fn, er)
			if (state == 3) {
				d.resolve(val)
			}
			else if (state == 4) {
				d.reject(val)
			}
			else {
				next.push(d)
			}
			return d
		}

		var finish = function (type) {
			state = type || 4
			next.map(function (p) {
				state == 3 && p.resolve(val) || p.reject(val)
			})
		}

		// ref : reference to 'then' function
		// cb, ec, cn : successCallback, failureCallback, notThennableCallback
		function thennable (ref, cb, ec, cn) {
			if ((typeof val == 'object' || typeof val == 'function') && typeof ref == 'function') {
				try {

					// cnt protects against abuse calls from spec checker
					var cnt = 0
					ref.call(val, function (v) {
						if (cnt++) return
						val = v
						cb()
					}, function (v) {
						if (cnt++) return
						val = v
						ec()
					})
				} catch (e) {
					val = e
					ec()
				}
			} else {
				cn()
			}
		};

		function fire() {

			// check if it's a thenable
			var ref;
			try {
				ref = val && val.then
			} catch (e) {
				val = e
				state = 2
				return fire()
			}
			thennable(ref, function () {
				state = 1
				fire()
			}, function () {
				state = 2
				fire()
			}, function () {
				try {
					if (state == 1 && typeof fn == 'function') {
						val = fn(val)
					}

					else if (state == 2 && typeof er == 'function') {
						val = er(val)
						state = 1
					}
				} catch (e) {
					val = e
					return finish()
				}

				if (val == self) {
					val = TypeError()
					finish()
				} else thennable(ref, function () {
						finish(3)
					}, finish, function () {
						finish(state == 1 && 3)
					})

			})
		}
	}

	m.sync = function(args) {
		var method = "resolve"
		function synchronizer(pos, resolved) {
			return function(value) {
				results[pos] = value
				if (!resolved) method = "reject"
				if (--outstanding == 0) {
					deferred.promise(results)
					deferred[method](results)
				}
				return value
			}
		}

		var deferred = m.deferred()
		var outstanding = args.length
		var results = new Array(outstanding)
		if (args.length > 0) {
			for (var i = 0; i < args.length; i++) {
				args[i].then(synchronizer(i, true), synchronizer(i, false))
			}
		}
		else deferred.resolve()

		return deferred.promise
	}
	function identity(value) {return value}

	function ajax(options) {
		var xhr = new window.XMLHttpRequest
		xhr.open(options.method, options.url, true, options.user, options.password)
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status >= 200 && xhr.status < 300) options.onload({type: "load", target: xhr})
				else options.onerror({type: "error", target: xhr})
			}
		}
		if (options.serialize == JSON.stringify && options.method != "GET") {
			xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		}
		if (typeof options.config == "function") {
			var maybeXhr = options.config(xhr, options)
			if (maybeXhr != null) xhr = maybeXhr
		}
		xhr.send(options.method == "GET" ? "" : options.data)
		return xhr
	}
	function bindData(xhrOptions, data, serialize) {
		if (data && Object.keys(data).length > 0) {
			if (xhrOptions.method == "GET") {
				xhrOptions.url = xhrOptions.url + (xhrOptions.url.indexOf("?") < 0 ? "?" : "&") + buildQueryString(data)
			}
			else xhrOptions.data = serialize(data)
		}
		return xhrOptions
	}
	function parameterizeUrl(url, data) {
		var tokens = url.match(/:[a-z]\w+/gi)
		if (tokens && data) {
			for (var i = 0; i < tokens.length; i++) {
				var key = tokens[i].slice(1)
				url = url.replace(tokens[i], data[key])
				delete data[key]
			}
		}
		return url
	}

	m.request = function(xhrOptions) {
		if (xhrOptions.background !== true) m.startComputation()
		var deferred = m.deferred()
		var serialize = xhrOptions.serialize = xhrOptions.serialize || JSON.stringify
		var deserialize = xhrOptions.deserialize = xhrOptions.deserialize || JSON.parse
		var extract = xhrOptions.extract || function(xhr) {
			return xhr.responseText.length === 0 && deserialize === JSON.parse ? null : xhr.responseText
		}
		xhrOptions.url = parameterizeUrl(xhrOptions.url, xhrOptions.data)
		xhrOptions = bindData(xhrOptions, xhrOptions.data, serialize)
		xhrOptions.onload = xhrOptions.onerror = function(e) {
			try {
				e = e || window.event
				var unwrap = (e.type == "load" ? xhrOptions.unwrapSuccess : xhrOptions.unwrapError) || identity
				var response = unwrap(deserialize(extract(e.target, xhrOptions)))
				if (e.type == "load") {
					if (type.call(response) == "[object Array]" && xhrOptions.type) {
						for (var i = 0; i < response.length; i++) response[i] = new xhrOptions.type(response[i])
					}
					else if (xhrOptions.type) response = new xhrOptions.type(response)
				}
				deferred[e.type == "load" ? "resolve" : "reject"](response)
			}
			catch (e) {
				if (e instanceof SyntaxError) throw new SyntaxError("Could not parse HTTP response. See http://lhorie.github.io/mithril/mithril.request.html#using-variable-data-formats")
				else if (type.call(e) == "[object Error]" && e.constructor !== Error) throw e
				else deferred.reject(e)
			}
			if (xhrOptions.background !== true) m.endComputation()
		}
		ajax(xhrOptions)
		return deferred.promise
	}

	//testing API
	m.deps = function(mock) {return window = mock}
	//for internal testing only, do not use `m.deps.factory`
	m.deps.factory = app

	return m
}(typeof window != "undefined" ? window : {})

if (typeof module != "undefined" && module !== null) module.exports = m
if (typeof define == "function" && define.amd) define(function() {return m})

;;;

},{}]},{},[1])