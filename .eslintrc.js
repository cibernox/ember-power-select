'use strict';

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
    'no-console': 0,
    'ember/avoid-leaking-state-in-ember-objects': 0,
    'ember/no-jquery': 'error',
    'ember/no-computed-properties-in-native-classes': 0,
    'ember/no-classic-components': 0,
    'ember/no-classic-classes': 0,
    'ember/require-tagless-components': 0,
    'ember/classic-decorator-no-classic-methods': 0
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.prettierrc.js',
        '.template-lintrc.js',
        'compile-css.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js'
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'run-fastboot-tests.js',
        'tests/dummy/app/**',
        'app/templates/snippets/**/*.js'
      ],
      parserOptions: {
        sourceType: 'script'
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended']
    }
  ]
};
