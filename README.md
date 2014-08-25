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

      npm install
   

#### Testing 

This testing environment uses Intern.js. Make changes to the Intern.js configuration file located at:
      ./tests/intern.js

More informatin about what to change in this file:
https://github.com/theintern/intern/wiki/Configuring-Intern

Documentation for **Leadfoot** can be found here:
https://theintern.github.io/leadfoot/Element.html

*Using SauceLabs*

To run sauce labs uncomment the following and make sure you comment out browserstack or local testing lines

      tunnel: 'SauceLabsTunnel',

*Using BrowserStack*

To use BrowserStack you need to add this line for your tunnel in ```./tests/inter.js``` (comment out other tunnel variables)

      tunnel: 'BrowserStackTunnel',

**Running Tests**

Run the tests with the following command in Terminal:

      ./node_modules/.bin/intern-runner config=tests/intern"

For convenience you can add the env variables and an alias to your bash profile or ~/.zshrc; so that you can get your tests running regardless of your testing location

      # BrowserStack environment variables 
      export BROWSERSTACK_USERNAME="YOUR_USERNAME"
      export BROWSERSTACK_ACCESS_KEY="YOUR_KEY"

      # SauceLabs environment variables
      export SAUCE_USERNAME="YOUR_USERNAME"
      export SAUCE_ACCESS_KEY="YOUR_KEY"

Alias for running tests 

      alias intern="./node_modules/.bin/intern-runner config=tests/intern"

After that all you need to do is change your environment variables and type this to start testing :

      intern
