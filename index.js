'use strict';

module.exports = {
  name: require('./package').name,

  included() {
    let app = this._findHost();
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
