define([
    'intern!object',
    'intern/assert',
    'require'
], function (registerSuite, assert, require) {
    appUrl = 'http://mithril-test.cos.io/basic/';

    var getBrowser = function(remote) {
        return remote.environmentType.browserName;
    };

    suite = {
        name: 'test page behavior',

        before: function() {
            NEXTTODO = 'upnext';
        },

        //// Fails:
        //// IE6
        //// IE7
        //// IE8
        'initial page loads, h1 == "Home"': function() {
            return this.get('remote').get(appUrl)
                .findByTagName('h1').getVisibleText().then(function (data) {
                    assert.strictEqual(data, 'Home', "h1 header says 'Home'");
                });
        },

        //// Fails:
        //// IE6
        //// IE7
        //// IE8
        'clicking home from basic navigates to same URL': function() {
            return this.get('remote').get(appUrl)
                .findByLinkText('home').click().end()
                .getCurrentUrl().then(function (data) {
                    assert.strictEqual(data, appUrl, 'new URL is the same one');
                });
        },

        //// Fails:
        ////    IE9
        'initial population of todo list is correct': function() {
            var expectedList = ['one', 'two'];
            return this.get('remote')
                .get(appUrl)
                .findByLinkText('todo').click().end()
                .findById('content').findAllByTagName('li').getVisibleText()
                .then(function(data) {
                    assert.deepEqual(data, expectedList, 'initial list is the specified list');
                });
        },

        //// Fails:
        ////    IE9
        'typing in text box updates its value': function() {
            return this.get('remote')
                .get(appUrl)
                .findByLinkText('todo').click().end()
                .findByTagName('input').click().type(NEXTTODO).end()
                .findByTagName('input').getProperty('value')
                .then(function(data) {
                    assert.strictEqual(data, NEXTTODO, 'value of <input> is correct');
                });
        },

        //// Fails:
        ////    IE9
        'typing, then clicking submit adds todo item': function() {
            var expectedList = ['one', 'two'];
            expectedList.push(NEXTTODO);
            var cmd = "";
            // Safari's WebDriver doesn't cause change events to be fired
            // when text is typed into an element, so we have to fake it
            if (getBrowser(this.get('remote')) === "safari") {
                cmd = "document.getElementsByTagName('input')[0].dispatchEvent(new Event('change'))";
            }
            return this.get('remote')
                .get(appUrl)
                .findByLinkText('todo').click().end()
                .findByTagName('input').click().type(NEXTTODO).end()
                .execute(cmd)
                .findById('content').findByTagName('button').click().end()
                .findById('content').findAllByTagName('li').getVisibleText()
                .then(function(data) {
                    assert.equal(data, expectedList, 'new item added to list');
                });
        },


        //// Fails:
        ////    IE9
        'navigate to todo works correctly': function () {
            return this.get('remote')
                .get(appUrl)
                .findByLinkText('todo').click().end()
                .findByTagName('h1')
                .getVisibleText()
                .then(function (data) {
                    assert.strictEqual(data, "Todo");
                }).end()
                .getCurrentUrl().then(function(data) {
                    assert.strictEqual(data, (appUrl + 'todo'), 'navigated to todo');
                });
        },
    };

    registerSuite(suite);
});

// note: if things don't work, try: .then(pollUntil('return document.readyState;'), 5000)
