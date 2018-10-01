import EmberPowerSelect from '@salsify/ember-power-select/components/power-select';

export default EmberPowerSelect.extend({
  // Place here your system-wide preferences
  searchEnabled: false,
  allowClear: true,

  // You can even use computed properties to do other stuff, like apply i18n, that wouldn't be
  // possible with static configuration.
  i18n: Ember.inject.service(),
  loadingMessage: Ember.computed('i18n.locale', function() {
    return this.get('i18n').t('selects.loading');
  })
});