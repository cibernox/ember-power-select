/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-power-select',

  included(appOrAddon) {
    let app = appOrAddon.app || appOrAddon;
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

      // Don't include the precompiled css file if the user uses ember-cli-sass
      if (!app.registry.availablePlugins['ember-cli-sass']) {
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
 