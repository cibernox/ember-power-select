import Component from 'ember-component';
import layout from '../../templates/components/power-select/trigger';

export default Component.extend({
  layout: layout,
  tagName: '',

  // Actions
  actions: {
    clear(e) {
      e.stopPropagation();
      this.getAttr('select').actions.select(null);
    }
  }
});
