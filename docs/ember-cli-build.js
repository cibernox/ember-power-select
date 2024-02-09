'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['ember-power-select'],
    },
    babel: {
      plugins: [
        require.resolve('ember-concurrency/async-arrow-task-transform'),
      ],
    },
    'ember-cli-babel': { enableTypeScriptTransform: true },
    'ember-prism': {
      components: ['scss', 'javascript', 'handlebars', 'markup-templating'], //needs to be an array, or undefined.
    },
    snippetPaths: ['app/components/snippets', 'app/templates/snippets/'],
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};
