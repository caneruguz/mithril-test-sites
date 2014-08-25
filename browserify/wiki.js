var logs = require('./logs');


var wiki = {};

wiki.data =

    wiki.model = function(){
        this.title = m.prop(wiki.data().title);
        this.content = m.prop(wiki.data().content);
        this.version = m.prop(wiki.data().version)
    }
// Long way of binding the data to view
wiki.controller = function(){
    var self = this;
    this.data = m.prop({});
    m.request({method: "GET", url: './wiki.json'}).then(self.data);

    this.edit = m.prop(false);


    this.toggleView = function(){
        if(self.edit()){
            // save
            self.data().version++;
            logs.List().push(new logs.singleLog("wiki", self.data().version));
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
                        m("span", "Change Title: "), m("input.form-control", { onchange: m.withAttr("value", function(store){ controller.data().title = store; }), value: controller.data().title} )
                    ]),
                    m(".col-md-3.cm-wikiBar", [
                        m(".btn-group", [
                            m("button.btn.btn-sm.btn-default[type='button']",{ onclick : controller.toggleView },  m("i.fa.fa-save", " Save"))
                        ])
                    ])
                ])
            ]),
            m(".panel-body", [
                m("textarea.ht-wiki-edit", { onchange: m.withAttr("value", function(store){ controller.data().content = store; }), value: controller.data().content} )
            ])
        ])
    } else {
        return m(".panel", [
            m(".panel-heading", [
                m(".row", [
                    m(".col-md-9", [
                        m("h2.panel-title", controller.data().title)
                    ]),
                    m(".col-md-3.cm-wikiBar", [
                        m(".btn-group", [
                            m("button.btn.btn-sm.btn-default[type='button']",{ onclick : controller.toggleView }, m("i.fa.fa-pencil", " Edit"))
                        ])
                    ])
                ])
            ]),
            m(".panel-body", [
                m("p#wiki-preview", controller.data().content)
            ]),
            m(".panel-footer", " Version " + controller.data().version)
        ])
    }


};

module.exports = wiki;