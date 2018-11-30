'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const VersionChecker = require('ember-cli-version-checker'); // eslint-disable-line
const crawl = require('prember-crawler');

module.exports = function(defaults) {
  let checker = new VersionChecker(defaults);
  let emberChecker = checker.forEmber();
  let options = {
    snippetPaths: ['tests/dummy/app/templates/snippets'],
    prember: {
      urls: crawl
    }
  };

  if (process.env.DEPLOY_TARGET === undefined && emberChecker.isAbove('2.14.0')) {
    options.vendorFiles = { 'jquery.js': null };
  }

  let app = new EmberAddon(defaults, options);

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
