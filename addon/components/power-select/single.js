import Ember from 'ember';
import PowerSelectBaseComponent from './base';
import layout from '../../templates/components/power-select/main';

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
    choose(dropdown, option, e) {
      this.send('select', dropdown, option, e);
      if (this.get('closeOnSelect')) {
        dropdown.actions.close(e);
      }
    },

    handleKeydown(dropdown, e) {
      const onkeydown = this.get('onkeydown');
      if (onkeydown) { onkeydown(this.buildPublicAPI(dropdown), e); }
      if (e.defaultPrevented) { return; }
      if (e.keyCode === 13 && dropdown.isOpen) { // Enter
        this.send('choose', dropdown, this.get('highlighted'), e);
      } else {
        this._super(...arguments);
      }
    },

    handleFocus(dropdown, event) {
      const action = this.get('onfocus');
      if (action) {
        action(this.buildPublicAPI(dropdown), event);
      }
    }
  },

  // Methods
  defaultHighlighted() {
    const selection = this.get('selection');

    if (!selection || this.indexOfOption(selection) === -1) {
      return this.optionAtIndex(0);
    }

    return selection;
  },

  focusSearch() {
    Ember.$('.ember-power-select-search input').focus();
  }
});
