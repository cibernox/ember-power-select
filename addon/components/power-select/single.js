import Ember from 'ember';
import PowerSelectBaseComponent from './base';
import layout from '../../templates/components/power-select/single';

const { computed } = Ember;

export default PowerSelectBaseComponent.extend({
  layout: layout,

  // CPs
  selection: computed('selected', {
    get() { return this.get('selected'); },
    set(_, v) { return v; }
  }),

  concatenatedClasses: computed('class', function() {
    const classes = ['ember-power-select'];
    if (this.get('class')) { classes.push(this.get('class')); }
    return classes.join(' ');
  }),

  // Actions
  actions: {
    clear(dropdown, e) {
      e.stopPropagation();
      e.preventDefault();
      this.set('selection', null);
      this.get('onchange')(null, dropdown);
    }
  },

  // Methods
  onKeydown(dropdown, e) {
    if (e.defaultPrevented) { return; }
    if (e.keyCode === 13 && dropdown.isOpen) { // Enter
      this.select(this.get('_highlighted'), dropdown, e);
    } else {
      this._super(...arguments);
    }
  },

  defaultHighlighted() {
    return this.get('selection') || this.optionAtIndex(0);
  },

  select(option, dropdown, e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.get('closeOnSelect')) {
      dropdown.actions.close(e);
    }
    if (this.get('selection') !== option) {
      this.get('onchange')(option, dropdown);
    }
  },

  focusSearch() {
    Ember.$('.ember-power-select-search input').focus();
  }
});
