import Ember from 'ember';
import layout from '../../templates/components/power-select/options';

// TODO: Do I really need a component? A recursive template would do ...
export default Ember.Component.extend({
  layout: layout,
  tagName: 'ul',
  attributeBindings: ['role'],
  role: 'listbox',

  // Actions
  actions: {
    choose(dropdown, option, e) {
      this.get('select.actions.select')(dropdown, this.buildNewSelection(option), e);
    }
  },

  // Methods
  buildNewSelection(option) {
    if (!this.get('multiple')) { return option; }
    const newSelection = Ember.A((this.get('selection')).slice(0));
    if (newSelection.indexOf(option) > -1) {
      newSelection.removeObject(option);
    } else {
      newSelection.addObject(option);
    }
    return newSelection;
  }
});
