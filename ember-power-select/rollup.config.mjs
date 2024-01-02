import { babel } from '@rollup/plugin-babel';
import { Addon } from '@embroider/addon-dev/rollup';
import styles from 'rollup-plugin-styles';
import path from 'path';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

export default [
  // Compile scss file for js import
  {
    input: './_index.scss',
    output: {
      file: './vendor/ember-power-select.js',
      assetFileNames: '[name][extname]',
    },
    plugins: [
      styles({
        mode: ['extract', 'ember-power-select.css'],
        sass: {
          includePaths: [path.resolve('node_modules')],
        },
      }),
    ],
  },
  {
    input: './scss/bootstrap-complete.scss',
    output: {
      file: './vendor/ember-power-select-bootstrap.js',
      assetFileNames: '[name][extname]',
    },
    plugins: [
      styles({
        mode: ['extract', 'ember-power-select-bootstrap.css'],
        sass: {
          includePaths: [path.resolve('node_modules')],
        },
      }),
    ],
  },
  {
    input: './scss/material-complete.scss',
    output: {
      file: './vendor/ember-power-select-material.js',
      assetFileNames: '[name][extname]',
    },
    plugins: [
      styles({
        mode: ['extract', 'ember-power-select-material.css'],
        sass: {
          includePaths: [path.resolve('node_modules')],
        },
      }),
    ],
  },
  {
    // This provides defaults that work well alongside `publicEntrypoints` below.
    // You can augment this if you need to.
    output: addon.output(),

    plugins: [
      // These are the modules that users should be able to import from your
      // addon. Anything not listed here may get optimized away.
      // By default all your JavaScript modules (**/*.js) will be importable.
      // But you are encouraged to tweak this to only cover the modules that make
      // up your addon's public API. Also make sure your package.json#exports
      // is aligned to the config here.
      // See https://github.com/embroider-build/embroider/blob/main/docs/v2-faq.md#how-can-i-define-the-public-exports-of-my-addon
      addon.publicEntrypoints(['index.js', '**/*.js']),

      // These are the modules that should get reexported into the traditional
      // "app" tree. Things in here should also be in publicEntrypoints above, but
      // not everything in publicEntrypoints necessarily needs to go here.
      addon.appReexports([
        'components/**/*.js',
        'helpers/**/*.js',
        'test-support/*.js',
        'utils/*.js',
      ]),

      // Follow the V2 Addon rules about dependencies. Your code can import from
      // `dependencies` and `peerDependencies` as well as standard Ember-provided
      // package names.
      addon.dependencies(),

      // This babel config should *not* apply presets or compile away ES modules.
      // It exists only to provide development niceties for you, like automatic
      // template colocation.
      //
      // By default, this will load the actual babel config from the file
      // babel.config.json.
      babel({
        extensions: ['.js', '.gjs', '.ts', '.gts'],
        babelHelpers: 'bundled',
      }),

      // Ensure that standalone .hbs files are properly integrated as Javascript.
      addon.hbs(),

      // Ensure that .gjs files are properly integrated as Javascript
      addon.gjs(),

      // addons are allowed to contain imports of .css files, which we want rollup
      // to leave alone and keep in the published output.
      addon.keepAssets(['**/*.css']),

      // Remove leftover build artifacts when starting a new build.
      addon.clean(),
    ],
  },
];
