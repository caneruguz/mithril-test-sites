define([
    'intern!object',
    'intern/assert',
    'require'
], function (registerSuite, assert, require) {
    var appUrl = 'broute/';
    var scroll = "window.scrollTo(0, document.body.scrollHeight);";
    var getBrowser = function(remote) {
        return remote.environmentType.browserName;
    };
    registerSuite({
        name: 'routes',

        'clicking home navigates to home': function() {
            return this.get('remote').get(require.toUrl(appUrl))
                .findByLinkText('Home').click().end()
                .getCurrentUrl().then(function (data) {
                    assert.strictEqual(data, "http://localhost:9000/broute/", 'Home url is not accurate, returned instead : ' + data);
                });
        },

        'clicking about navigates to about page': function() {
            return this.get('remote').get(require.toUrl(appUrl))
                .findByLinkText('About').click().end()
                .getCurrentUrl().then(function (data) {
                    assert.strictEqual(data, "http://localhost:9000/broute/about", 'About url is not accurate, returned instead : ' + data);
                });
        },

        'clicking item example navigates to item example': function() {
            return this.get('remote').get(require.toUrl(appUrl))
                .findByLinkText('Item Example').click().end()
                .getCurrentUrl().then(function (data) {
                    assert.strictEqual(data, "http://localhost:9000/broute/item/2/SomeTitle", 'Item url is not accurate, returned instead : ' + data);
                });
        },

        'clicking home navigates to home AND shows content': function() {
            return this.get('remote').get(require.toUrl(appUrl))
                .findByLinkText('Home').click().end()
                .setFindTimeout(3000)
                .findById('pageTitle')
                .getVisibleText()
                .then(function(text){
                    assert.strictEqual(text, 'App Page',
                        'Home Title should say "App Page", returned instead : ' + text );
                })
        },

        'clicking about navigates to about page AND shows content': function() {
            return this.get('remote').get(require.toUrl(appUrl))
                .findByLinkText('About').click().end()
                .setFindTimeout(3000)
                .findById('pageTitle')
                .getVisibleText()
                .then(function(text){
                    assert.strictEqual(text, 'About Page',
                            'About Title should say "About Page", returned instead : ' + text );
                })
        },

        'clicking item example navigates to item example AND shows content': function() {
            return this.get('remote').get(require.toUrl(appUrl))
                .findByLinkText('Item Example').click().end()
                .setFindTimeout(3000)
                .findById('pageTitle')
                .getVisibleText()
                .then(function(text){
                    assert.strictEqual(text, 'Checking Route parameters',
                            'Item Example Title should say "Checking Route parameters", returned instead : ' + text );
                })
        },

        // item returns param ID
        'item returns param ID ': function() {
            return this.get('remote').get(require.toUrl(appUrl))
                .setFindTimeout(4000)
                .findByLinkText('Item Example').click().end()
                .setFindTimeout(4000)
                .findById('param_id')
                .getVisibleText()
                .then(function (data) {
                    assert.strictEqual(data, "2", 'Param ID is not accurate, returned instead : ' + data);
                });
        },

        // Item returns param Title
            'item returns param title ': function() {
                return this.get('remote').get(require.toUrl(appUrl))
                    .setFindTimeout(4000)
                    .findByLinkText('Item Example').click().end()
                    .findById('param_title')
                    .getVisibleText()
                    .then(function (data) {
                        assert.strictEqual(data, "SomeTitle", 'Param Title is not accurate, returned instead : ' + data);
                    });
            }
    });
});

