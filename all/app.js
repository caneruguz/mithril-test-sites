var m = require('mithril');
var app = {}; // Create a namespace for the entire app

// Load components and add them to the app namespace
app.logs = require('./logs');
app.comments = require('./comments')
app.wiki = require('./wiki')

var linkList= [
    {title: "Home", url: "/all/"},
    {title: "About", url: "/all/about"},
    {title: "Item Example", url: "/all/item/2/SomeTitle"}
];

var links = m(".links", [
    linkList.map(function(link) {
        return m("a", {href: link.url }, link.title)
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
    if(ctrl.pageId() === 0 ){
        return m("div", "Page info did not load")
    } else {
        return ctrl.pageInfo().map(function(item, index, array){
            if(item.id === ctrl.pageId()){
                return [ m('h1#pageTitle', item.title), m('p', item.content), ];
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
    controller : function(bindings){
        this.page = new app.pages.controller(3);
        this.bindings = bindings; // {id : 1, title : "Hi"};
    },
    view : function(ctrl) {
        return m('#container', [
            m('.box', links),
            m('.box', app.pages.view(ctrl.page)),
            m('.box',[
                m('h4',
                    [m('span', "ID : "), m('span.#param_id',ctrl.bindings.id )]
                ),
                m('h4',
                    [m('span', "Title : "), m('span.#param_title',ctrl.bindings.title)]
                )
            ])
        ])
    }
}

var router = new FitzRoy();
router.base = '';
var indexPage = function(){
    m.module(document.getElementById('wrapper'), home)
};
var aboutPage = function(){
    m.module(document.getElementById('wrapper'), about)

};
var itemPage  = function(context, bindings){
    var bindings;
    if(arguments[0] == undefined){
        bindings = arguments[1];
    } else {
        bindings = arguments[0];
    }
    var controller = new item.controller(bindings);
    m.render(document.getElementById('wrapper'), item.view(controller))
//    m.module(document.getElementById('wrapper'), { controller: function(){return item.controller(bindings) }, view : item.view  })

};

router.add('/all/', indexPage, {});
router.add('/all/about', aboutPage, {});
router.add('/all/item/:id/:title', itemPage, {});

$(document).ready(function(){
    router.ajaxify(window.document.body);
    router.call(router.getHash());
});

