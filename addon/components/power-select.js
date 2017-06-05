import Component from 'ember-component';
import layout from '../templates/components/power-select';

export default Component.extend({
  layout,
  tagName: '',

  actions: {
    buildSelection(options) {
      let action = this.get('buildSelection');
      if (action) {
        return action(...arguments);
      }
      return options;
    }
  }
});
