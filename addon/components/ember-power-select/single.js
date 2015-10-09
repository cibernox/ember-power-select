import Ember from 'ember';
import PowerSelectBaseComponent from './base';
import layout from '../../templates/components/ember-power-select/single';

const { computed } = Ember;

export default PowerSelectBaseComponent.extend({
  layout: layout,

  // CPs
  selection: computed('selected', {
    get() { return this.get('selected'); },
    set(_, v) { return v; }
  }),

  // Actions
  actions: {
    clear(e) {
      e.stopPropagation();
      e.preventDefault();
      this.set('selection', null);
      if (this.get('onchange')) { this.get('onchange')(null); }
    },

    searchKeydown(closeDropdown, e) {
      if (e.keyCode === 40 || e.keyCode === 38) { // Arrow up/down
        this.handleVerticalArrowKey(e);
      } else if (e.keyCode === 13) {  // Enter
        const highlighted = this.get('_highlighted');
        this.select(highlighted);
        closeDropdown(e);
      } else if (e.keyCode === 9) {   // Tab
        closeDropdown();
      } else if (e.keyCode === 27) {  // escape
        e.preventDefault();
        closeDropdown(e);
      } else if (e.keyCode === 8) {   // backspace
        this.handleBackspace(e);
      }
    },
  },

  // Methods
  defaultHighlighted() {
    return this.get('selection') || this.optionAtIndex(0);
  },

  select(option) {
    if (this.get('selection') !== option) {
      this.set('selection', option);
      if (this.get('onchange')) { this.get('onchange')(this.get('selection')); }
    }
  },

  focusSearch() {
    Ember.$('.ember-power-select-search input').focus();
  }
});
