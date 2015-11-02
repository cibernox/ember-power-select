import Ember from 'ember';
import EmberPowerSelectComponent from 'ember-power-select/components/ember-power-select';

export default EmberPowerSelectComponent.extend({
  init() {
    this._super(...arguments);
    Ember.deprecate('The name of the component has been shortened from {{ember-power-select}} to just {{power-select}}. The old component will be removed in the next major version.', false);
  }
});