'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const VersionChecker = require('ember-cli-version-checker'); // eslint-disable-line

module.exports = function(defaults) {
  let checker = new VersionChecker(defaults);
  let emberChecker = checker.for('ember-source');
  let options = {
    snippetPaths: ['tests/dummy/app/templates/snippets']
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

  const safeDummyComponentsToIgnore = [
    'custom-trigger-with-search',
    'selected-country',
    'custom-before-options',
    'list-of-countries',
    'custom-after-options',
    'custom-search-message',
    'custom-no-matches-message',
    'custom-placeholder',
    'custom-group-component',
  ].reduce((acum, curr) => {
    return {
      ...acum,
      [`{{component '${curr}'}}`]: {
        safeToIgnore: true,
      },
    };
  }, {});

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    packageRules: [
      {
        package: 'dummy',
        components: safeDummyComponentsToIgnore
      },
    ],
  });
};
