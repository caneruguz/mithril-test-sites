   var logs = {};

// Assign model directly to loaded content
    logs.List = m.prop("");
    m.request({method: "GET", url: "./logs.json"}).then(logs.List);

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
        this.logUser = "Caner";
        this.logDate = new Date();
        this.logContent = logContent;
    };

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
            m.request({method: "GET", url: "./comments.json"}).then(this.comments);
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

    m.module(document.getElementById('comments'), comments);
    m.module(document.getElementById('wiki'), wiki);
    m.module(document.getElementById('logs'), logs);

