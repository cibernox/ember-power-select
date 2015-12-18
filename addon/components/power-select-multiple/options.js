import Ember from 'ember';
import layout from '../../templates/components/power-select/options';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'ul',
  attributeBindings: ['role'],
  role: 'listbox',

  // Actions
  actions: {
    choose(option, e) {
      this.get('select.actions.select')(this.buildNewSelection(option), e);
      if (this.get('closeOnSelect')) {
        this.get('select.actions.close')(e);
      }
    }
  },

  // Methods
  buildNewSelection(option) {
    const newSelection = Ember.A((this.get('selection') || []).slice(0));
    if (newSelection.indexOf(option) > -1) {
      newSelection.removeObject(option);
    } else {
      newSelection.addObject(option);
    }
    return newSelection;
  }
});