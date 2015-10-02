/* jshint node: true */
'use strict';

// var path = require('path');

module.exports = {
  name: 'ember-power-select',
  contentFor: function(type, config) {
    if (config.environment !== 'test' && type === 'body-footer') {
      return '<div id="ember-power-select-wormhole"></div>';
    }
  },

  included: function(app) {
    this._super.included(app);
    // this.app.registry.availablePlugins['ember-cli-sass'] --->' 4.2.1',
    // I can use this to determine if the consumer app is using sass
    // and if so take a different approch.
  },

  // treeForStyles: function(){
  //   debugger;
  //   var tree = new Funnel(this.treePaths['addon-styles'], {
  //     srcDir: '/',
  //     destDir: '/app/styles'
  //   });
  //   return tree;
  // }
};
 