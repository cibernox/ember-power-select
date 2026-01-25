'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { compatBuild } = require('@embroider/compat');

module.exports = async function (defaults) {
  const { buildOnce } = await import('@embroider/vite');

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
    // Add options here
  });

  return compatBuild(app, buildOnce);
};
