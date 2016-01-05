import Ember from 'ember';
import layout from '../../templates/components/power-select/trigger';

export default Ember.Component.extend({
  layout: layout,
  tagName: '',

  // Actions
  actions: {
    clear(e) {
      this.get('select.actions.select')(null, e);
    }
  }
});
