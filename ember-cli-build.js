/* eslint-env node */
const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let project = defaults.project;
  let options = {
    snippetPaths: ['tests/dummy/app/templates/snippets']
  };

  if (project.findAddonByName('ember-native-dom-event-dispatcher')) {
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
