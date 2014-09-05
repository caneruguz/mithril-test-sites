define([
    'intern!object',
    'intern/assert',
    'require'
], function (registerSuite, assert, require) {
    var home = 'fitzroy/';
    var scroll = "window.scrollTo(0, document.body.scrollHeight);";
    var getBrowser = function(remote) {
        return remote.environmentType.browserName;
    };
    var getVersion = function (remote){
        return remote.environmentType.version;
    }
    registerSuite({
        name: 'Mithril + Fitzroy Testing',

        'clicking home navigates to home AND shows content': function() {
            return this.get('remote').get(require.toUrl(home))
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
            return this.get('remote').get(require.toUrl(home))
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
            return this.get('remote').get(require.toUrl(home))
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

