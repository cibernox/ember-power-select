/* eslint-env node */
'use strict';

// For ember-cli < 2.7 findHost doesnt exist so we backport from that version
// for earlier version of ember-cli.
//https://github.com/ember-cli/ember-cli/blame/16e4492c9ebf3348eb0f31df17215810674dbdf6/lib/models/addon.js#L533
  function findHostShim() {
    let current = this;
    let app;
    do {
      app = current.app || app;
    } while (current.parent.parent && (current = current.parent));
    return app;
  }

module.exports = {
  name: 'ember-power-select',

  included(appOrAddon) {
    let findHost = this._findHost || findHostShim;
    let app = findHost.call(this);
    if (!app.__emberPowerSelectIncludedInvoked) {
      app.__emberPowerSelectIncludedInvoked = true;

      let options = typeof app.options === 'object' ? app.options : {};
      let addonConfig = options['ember-power-select'] || {};

      // Since ember-power-select styles already `@import` styles of ember-basic-dropdown,
      // this flag tells to ember-basic-dropdown to skip importing its styles provided
      // we're using a theme (or the default styles)
      if (addonConfig.theme !== false) {
        app.__skipEmberBasicDropdownStyles = true;
      }

      this._super.included.apply(this, arguments);

      let hasSass = !!app.registry.availablePlugins['ember-cli-sass'];
      let hasLess = !!app.registry.availablePlugins['ember-cli-less'];

      // Don't include the precompiled css file if the user uses a supported CSS preprocessor
      if (!hasSass && !hasLess) {
        if (addonConfig.theme) {
          app.import(`vendor/ember-power-select-${addonConfig.theme}.css`);
        } else if (addonConfig.theme !== false) {
          app.import('vendor/ember-power-select.css');
        }
      }
    }
  },

  contentFor(type, config) {
    let emberBasicDropdown = this.addons.find((a) => a.name === 'ember-basic-dropdown');
    return emberBasicDropdown.contentFor(type, config);
  }
};
