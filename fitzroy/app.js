var m = require('mithril');
var app = {}; // Create a namespace for the entire app

// Load components and add them to the app namespace
app.logs = require('./logs');
app.comments = require('./comments')
app.wiki = require('./wiki')

m.module(document.getElementById('logs'), app.logs);
m.module(document.getElementById('comments'), app.comments);
m.module(document.getElementById('wiki'), app.wiki);

