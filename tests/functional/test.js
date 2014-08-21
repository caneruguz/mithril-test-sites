define([
    'intern!object',
    'intern/assert',
    'require'
], function (registerSuite, assert, require) {
    registerSuite({
        name: 'index',

        // LOADING DATA Tests:
//        'wiki title does not equal undefined': function () {
//            return this.get('remote')
//                .get(require.toUrl('basic/index.html'))
//                .setFindTimeout(500)
//                .findByClassName('panel-title')
//                .getVisibleText()
//                .then(function (text) {
//                    assert.notEqual(text, 'undefined',
//                        'Wiki should load data properly');
//                });
//        },
//
//        'number of comments loaded is accurate': function () {
//            return this.get('remote')
//                .get(require.toUrl('basic/index.html'))
//                .setFindTimeout(2000)
//                .findAllByClassName('commentRow')
//                .then(function (array) {
//                    assert.lengthOf(array, 5,
//                        'Page should load 5 comments');
//                });
//
//        },
//
//        'number of logs loaded is accurate': function () {
//            return this.get('remote')
//                .get(require.toUrl('basic/index.html'))
//                .setFindTimeout(2000)
//                .findAllByClassName('log-row')
//                .then(function (array) {
//                    assert.lengthOf(array, 2,
//                        'Page should load 2 logs');
//                });
//        },
//
//
//        // BINDING TESTS:
//        'Wiki title equals data': function () {
//            return this.get('remote')
//                .get(require.toUrl('basic/index.html'))
//                .setFindTimeout(2000)
//                .findByClassName('panel-title')
//                .getVisibleText()
//                .then(function (text) {
//                    assert.strictEqual(text, 'Wiki Title Loaded from server',
//                        'Wiki title should be the same as bound data title');
//                });
//        },
//
//        'After wiki edit, version number is increased in view': function () {
//            return this.get('remote')
//                .get(require.toUrl('basic/index.html'))
//                .setFindTimeout(2000)
//                .findByClassName('editWikiButton')
//                .click()
//                .pressKeys('Head')
//                .end()
//                .findByClassName('saveWikiButton')
//                .click()
//                .end()
//                .findByClassName('wikiVersion')
//                .getVisibleText()
//                .then(function (text) {
//                    assert.strictEqual(text, 'Version 2',
//                        'Making edits to wiki should increase the version number');
//                });
//        },
//
////        // ONCLICK Tests:
////        // FAILED on firefox 28.0 on LINUX
////        // FAILED on Safari 7.0 on MAC
////        // FAILED on Safari 6.5 on MAC
//        'added comment shows the comment added': function () {
//            var remote =this.get('remote')
//            return remote.get(require.toUrl('basic/index.html')).setFindTimeout(2000)
//                .setWindowSize(800, 600)
//                .findByCssSelector('.ht-comment-box')
//                .click()
//                .type('My New Comment')
//                .end()
//                .findByCssSelector('#addComment')
//                .click()
//                .end()
//                .setFindTimeout(500)
//                .findByCssSelector('.commentRow:last-child > .commentContent ')
//                .then(function(element){
//                    return remote.moveMouseTo(element);
//                })
//                .getVisibleText()
//                .then(function (text) {
//                    assert.strictEqual(text, 'My New Comment',
//                        'Adding a comment should display the comment. Showed instead ' + text);
//                });
//        },
//
//        'clicking “edit” on wiki turns title into editable input': function () {
//            return this.get('remote')
//                .get(require.toUrl('basic/index.html'))
//                .setFindTimeout(2000)
//                .findByClassName('editWikiButton')
//                .click()
//                .end()
//                .setFindTimeout(1000)
//                .findByClassName('editWikiTitle')
//                .getTagName()
//                .then(function (text) {
//                    assert.strictEqual(text, 'input',
//                        'Clicking edit should make title editable input');
//                });
//        },

        // ONCHANGE Tests:
        // FAILED on InternetExplorer 11 on WINDOWS
        // FAILED on InternetExplore 10 on Windows
        // FAILED on InternetExporer 9 on Windows
        // FAILED on Chrome 34.0.1847.116 on Mac OS X
        // FAILED on firefox 28.0 on XP
        // Check out Jim's onchange version to correct this
        'typing text to filter box accurately changes number of comments shown': function () {
            var remote = this.get('remote');
            return remote.get(require.toUrl('basic/index.html'))
                .setFindTimeout(2000)
                .findById('cm-comment')
                .pressKeys('PAGE_DOWN')
                .end()
                .findById('filter')
                .click()
                .type('com')
                .end()
                .findByCssSelector('.commentRow:last-child')
                .then(function(element){
                    return remote.moveMouseTo(element);
                })
                .end()
                .findAllByClassName('commentRow')
                    .then(function (array) {
                        assert.lengthOf(array, 3,
                            'Filtering should hide unmatched rows');
                    });
        },

        // FAILED on firefox 28.0 on XP
        // FAILED on InternetExplorer 9 on WINDOWS

        'typing text to filter box shows only comments that have this text in them': function () {
            var remote =this.get('remote');
            return remote.get(require.toUrl('basic/index.html'))
                .setFindTimeout(2000)
                .findById('filter')
                .click()
                .pressKeys('com')
                .end()
                .findByCssSelector('.commentRow:last-child')
                .then(function(element){
                    return remote.moveMouseTo(element);
                })
                .end()
                .findAllByClassName('commentContent')
                .getVisibleText()
                .then(function (array) {
                    var includes = true;
                    for(var i = 0; i < array.length; i++){
                        if(array[i].indexOf('com') == -1){
                            includes = false;
                        }
                    }
                    assert.isTrue(includes,
                        'Filtering should hide unmatched rows');
                });

        },

//        // CROSS_MODULE COMMUNICATION Tests
//        'When wiki is changed a log is also added': function () {
//            return this.get('remote')
//                .get(require.toUrl('basic/index.html'))
//                .setFindTimeout(2000)
//                .findByClassName('editWikiButton')
//                .click()
//                .pressKeys('Head')
//                .end()
//                .findByClassName('saveWikiButton')
//                .click()
//                .end()
//                .findByCssSelector('.log-row:last-child > td > .logContent')
//                .getVisibleText()
//                .then(function (text) {
//                    assert.strictEqual(text, '2',
//                        'Making edits to wiki should add a log');
//                });
//        },
//
//        // FAILED on Safari 7.0 on MAC
//        // FAILED on Safaro 6.5 on MAC
//        'When a comment is added, a log is also added': function () {
//            return this.get('remote')
//                .get(require.toUrl('basic/index.html'))
//                .setFindTimeout(2000)
//                .findByCssSelector('.ht-comment-box')
//                .click()
//                .type('My New Comment')
//                .end()
//                .findByCssSelector('#addComment')
//                .click()
//                .end()
//                .findByCssSelector('.log-row:last-child > td > .logContent')
//                .getVisibleText()
//                .then(function (text) {
//                    assert.strictEqual(text, 'My New Comment',
//                        'Adding comment should add log to the end pf logs list');
//                });
//
//        }




    });
});

