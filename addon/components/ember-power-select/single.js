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
      this.get('onchange')(null);
    },

    searchKeydown(dropdown, e) {
      if (e.keyCode === 40 || e.keyCode === 38) { // Arrow up/down
        this.handleVerticalArrowKey(e);
      } else if (e.keyCode === 13) {  // Enter
        const highlighted = this.get('_highlighted');
        this.select(highlighted, dropdown, e);
      } else if (e.keyCode === 9) {   // Tab
        dropdown.close();
      } else if (e.keyCode === 27) {  // escape
        e.preventDefault();
        dropdown.close(e);
      }
    },
  },

  // Methods
  defaultHighlighted() {
    return this.get('selection') || this.optionAtIndex(0);
  },

  select(option, dropdown, e) {
    if (this.get('closeOnSelect')) {
      dropdown.close(e);
    }
    if (this.get('selection') !== option) {
      this.get('onchange')(option);
    }
  },

  focusSearch() {
    Ember.$('.ember-power-select-search input').focus();
  }
});
