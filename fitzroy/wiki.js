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
    this.data = m.request({method: "GET", url: '/fitzroy/wiki.json', type : wiki.model});//.then(self.data);

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