define([
    'intern!object',
    'intern/assert',
    'require'
], function (registerSuite, assert, require) {
    var all = 'all/';
    var scroll = "window.scrollTo(0, document.body.scrollHeight);";
    var getBrowser = function(remote) {
        return remote.environmentType.browserName;
    };
    registerSuite({
        name: 'Basic testing',
        "idle-timeout": 120,

        //LOADING DATA Tests:
        //All good
        'wiki title does not equal undefined': function () {
            return this.get('remote')
                .get(require.toUrl(all))
                .setFindTimeout(500)
                .findByClassName('panel-title')
                .getVisibleText()
                .then(function (text) {
                    assert.notEqual(text, 'undefined',
                        'Wiki should load data properly');
                });
        },

        //All good
        'number of comments loaded is accurate': function () {
            return this.get('remote')
                .get(require.toUrl(all))
                .setFindTimeout(2000)
                .findAllByClassName('commentRow')
                .then(function (array) {
                    assert.lengthOf(array, 5,
                        'Page should load 5 comments');
                });

        },

        // All good
        'number of logs loaded is accurate': function () {
            return this.get('remote')
                .get(require.toUrl(all))
                .setFindTimeout(2000)
                .findAllByClassName('log-row')
                .then(function (array) {
                    assert.lengthOf(array, 2,
                        'Page should load 2 logs');
                });
        },


        // BINDING TESTS:
        //All good
        'Wiki title equals data': function () {
            return this.get('remote')
                .get(require.toUrl(all))
                .setFindTimeout(2000)
                .findByClassName('panel-title')
                .getVisibleText()
                .then(function (text) {
                    assert.strictEqual(text, 'Wiki Title Loaded from server',
                        'Wiki title should be the same as bound data title');
                });
        },

        //All good
        'After wiki edit, version number is increased in view': function () {
            return this.get('remote')
                .get(require.toUrl(all))
                .setFindTimeout(2000)
                .findByClassName('editWikiButton')
                .click()
                .pressKeys('Head')
                .end()
                .findByClassName('saveWikiButton')
                .click()
                .end()
                .findByClassName('wikiVersion')
                .getVisibleText()
                .then(function (text) {
                    assert.strictEqual(text, 'Version 2',
                            'Making edits to wiki should increase the version number. Retunrned instead: "' + text + '"');
                });
        },

        // ONCLICK Tests:
        //All good
        'added comment shows the comment added': function () {
            var remote = this.get('remote');
            var cmd = "";
            if (getBrowser(this.get('remote')) === "safari") {
                cmd = "document.getElementsByClassName('ht-comment-box')[0].dispatchEvent(new Event('change'));";
            }
            return this.get('remote').get(require.toUrl(all))
                .setWindowSize(1000, 900)
                .execute(scroll)
                .findByClassName('ht-comment-box')
                .click()
                .type('My New Comment')
                .execute(cmd)
                .end()
                .setFindTimeout(2000)
                .findById('addComment')
                .click()
                .end()
                .setFindTimeout(4000)
                .findByCssSelector('.commentRow:last-child > .commentContent ')
                .getVisibleText()
                .then(function (text) {
                    assert.strictEqual(text, 'My New Comment',
                        'Clicking edit should make title editable input');
                });
        },

        //All good
        'clicking “edit” on wiki turns title into editable input': function () {
            return this.get('remote')
                .get(require.toUrl(all))
                .setFindTimeout(2000)
                .findByClassName('editWikiButton')
                .click()
                .end()
                .setFindTimeout(1000)
                .findByClassName('editWikiTitle')
                .getTagName()
                .then(function (text) {
                    assert.strictEqual(text, 'input',
                        'Clicking edit should make title editable input');
                });
        },

        // ONCHANGE Tests:
        // All good
        'typing text to filter box accurately changes number of comments shown': function () {
            var remote = this.get('remote');
            var cmd = "";
            if (getBrowser(this.get('remote')) === "safari") {
                cmd = "document.getElementById('filter').dispatchEvent(new Event('change'));";
            }
            return remote.get(require.toUrl(all))
                .setFindTimeout(3000)
                .findById('cm-comment')
                .end()
                .setFindTimeout(3000)
                .findById('filter')
                .click()
                .type('c')
                .sleep(500)
                .type('o')
                .sleep(500)
                .type('m')
                .sleep(3000)
                .end()
                .execute(cmd)
                .execute(scroll)
                .setFindTimeout(3000)
                .findAllByClassName('commentRow')
                .then(function (array) {
                    assert.lengthOf(array, 3,
                        'Filtering should hide unmatched rows');
                });
        },

        'typing text to filter box shows only comments that have this text in them': function () {
            var remote =this.get('remote');
            return remote.get(require.toUrl(all))
                .setFindTimeout(2000)
                .findById('filter')
                .click()
                .type('c')
                .sleep(500)
                .type('o')
                .sleep(500)
                .type('m')
                .sleep(500)
                .end()
                .setFindTimeout(2000)
                .findAllByClassName('commentContent')
                .getVisibleText()
                .then(function (array) {
                    var includes = true;
                    var output = "";
                    for(var i = 0; i < array.length; i++){
                        output += array[i] + ",";
                        if(array[i].indexOf('com') == -1){
                            includes = false;
                        }
                    }
                    assert.isTrue(includes,
                            'Filtering should hide unmatched rows. Instead returned: "'+ output + '"');
                });

        },

        // CROSS_MODULE COMMUNICATION Tests
        // All good
        'When wiki is changed a log is also added': function () {
            return this.get('remote')
                .get(require.toUrl(all))
                .setFindTimeout(2000)
                .findByClassName('editWikiButton')
                .click()
                .pressKeys('Head')
                .end()
                .setFindTimeout(2000)
                .findByClassName('saveWikiButton')
                .click()
                .end()
                .execute(scroll)
                .setFindTimeout(2000)
                .findByCssSelector('.log-row:last-child > td > .logContent')
                .getVisibleText()
                .then(function (text) {
                    assert.strictEqual(text, '2',
                        'Making edits to wiki should add a log');
                });
        },

        // All good
        'When a comment is added, a log is also added': function () {
            var cmd = "";
            if (getBrowser(this.get('remote')) === "safari") {
                cmd = "document.getElementsByClassName('ht-comment-box')[0].dispatchEvent(new Event('change'));";
            }
            return this.get('remote').get(require.toUrl(all))
                .setWindowSize(1000, 900)
                .execute(scroll)
                .findByClassName('ht-comment-box')
                .click()
                .type('My New Comment')
                .execute(cmd)
                .end()
                .setFindTimeout(2000)
                .findById('addComment')
                .click()
                .end()
                .setFindTimeout(4000)
                .findByCssSelector('.log-row:last-child > td > .logContent')
                .getVisibleText()
                .then(function (text) {
                    assert.strictEqual(text, 'My New Comment',
                            'Adding comment should add log to the end pf logs list. Found instead : "' + text + '"');
                });

        },

        'clicking home navigates to home AND shows content': function() {
            return this.get('remote').get(require.toUrl(all))
                .findByLinkText('Home').click().end()
                .setFindTimeout(3000)
                .findById('pageTitle')
                .getVisibleText()
                .then(function(text){
                    assert.strictEqual(text, 'App Page',
                            'Home Title should say "Welcome Home", returned instead : ' + text );
                })
        },

        'clicking About navigates to about page AND shows content': function() {
            return this.get('remote').get(require.toUrl(all))
                .findByLinkText('About').click().end()
                .setFindTimeout(3000)
                .findById('pageTitle')
                .getVisibleText()
                .then(function(text){
                    assert.strictEqual(text, 'About Page',
                            'About Title should say "File Page", returned instead : ' + text );
                })
        },

        // item returns param ID
        'Clicking item navigates to item page and Returns parameters accurately': function() {
            return this.get('remote').get(require.toUrl(all))
                .setFindTimeout(4000)
                .findByLinkText('Item Example').click().end()
                .setFindTimeout(4000)
                .findById('param_id')
                .getVisibleText()
                .then(function (text) {
                    assert.strictEqual(text, "2", 'Param ID is not accurate, returned instead : ' + text);
                });
        }




    });
});

