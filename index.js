/* jshint node: true */
'use strict';

// var path = require('path');

module.exports = {
  name: 'ember-power-select',
  included: function(app) {
    // Don't include the precompiled css file if the user uses ember-cli-sass
    if (!app.registry.availablePlugins['ember-cli-sass']) {
      app.import('vendor/ember-power-select.css');
    }
  },

  contentFor: function(type, config) {
    this.eachAddonInvoke('contentFor', [this, type, config]);
  }
};
 