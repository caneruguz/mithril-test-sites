mithril-test-sites
==================

Test sites for compatibility testing of mithril.js using tools like Sauce Labs

Different scenarios of complexity are contained within their folders.

**Basic**

Simple Mithril app utilizing binding, view, click and change events and modularity with three modules changing view states and data. 

**Routing**

Basic mithril application plus routing using mithril's own routing system

**HistoryJS**

Basic mithril application plus history.js routing 


#### Install
run 

   ```npm install```
   

#### Testing 

This testing environment uses Intern.js. Make changes to the Intern.js configuration file located at: ```./tests/intern.js```

More informatin about what to change in this file:
https://github.com/theintern/intern/wiki/Configuring-Intern

Documentation for **Leadfoot** can be found here:
https://theintern.github.io/leadfoot/Element.html

*Using SauceLabs*

To run sauce labs you can add the following alias:

```alias sauce="SAUCE_USERNAME=YOUR_USERNAME SAUCE_ACCESS_KEY=YOUR_ACCESS_KEY ./node_modules/.bin/intern-runner config=tests/intern"```

*Using BrowserStack*

To use BrowserStack you need to add this line for your tunnel in ```./tests/inter.js``` (comment out other tunnel variables)

```tunnel: 'BrowserStackTunnel',```


And use env variables, so add these to your bash profile or ~/.zshrc

    ```//# BrowserStack environment variables
    //export BROWSERSTACK_USERNAME="YOUR_USERNAME"
    //export BROWSERSTACK_ACCESS_KEY="YOUR_KEY"```


