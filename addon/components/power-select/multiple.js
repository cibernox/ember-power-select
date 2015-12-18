import Ember from 'ember';
import PowerSelectBaseComponent from './base';
import layout from '../../templates/components/power-select/main';

const { computed, get } = Ember;

export default PowerSelectBaseComponent.extend({
  layout: layout,

  // CPs
  selection: computed('selected', {
    get() { return Ember.A(this.get('selected')); },
    set(_, v) { return v; }
  }),

  concatenatedClasses: computed('class', function() {
    const classes = ['ember-power-select', 'multiple'];
    if (this.get('class')) { classes.push(this.get('class')); }
    return classes.join(' ');
  }),

  // Actions
  actions: {
    select(dropdown, option, e) {
      e.preventDefault();
      e.stopPropagation();
      const newSelection = this.cloneSelection();
      if (newSelection.indexOf(option) > -1) {
        newSelection.removeObject(option);
      } else {
        newSelection.addObject(option);
      }
      if (this.get('closeOnSelect')) {
        dropdown.actions.close(e);
      }
      this.get('onchange')(newSelection, this.buildPublicAPI(dropdown));
    },

    handleKeydown(dropdown, e) {
      const onkeydown = this.get('onkeydown');
      if (onkeydown) { onkeydown(this.buildPublicAPI(dropdown), e); }
      if (e.defaultPrevented) { return; }
      if (e.keyCode === 8) {  // BACKSPACE
        this.removeLastOptionIfSearchIsEmpty(dropdown, e);
        dropdown.actions.open(e);
      } else if (e.keyCode === 13) {
        e.stopPropagation();
        if (dropdown.isOpen) {
          const highlighted = this.get('highlighted');
          if (highlighted && (this.get('selected') || []).indexOf(highlighted) === -1) {
            this.send('select', dropdown, highlighted, e);
          } else {
            dropdown.actions.close(e);
          }
        } else {
          dropdown.actions.open(e);
        }
      } else {
        this._super(...arguments);
      }
    },

    handleFocus(dropdown, evt) {
      const action = this.get('onfocus');
      if (action) {
        action(this.buildPublicAPI(dropdown), evt);
      }
      this.focusSearch();
    }
  },

  // Methods
  defaultHighlighted() {
    return this.optionAtIndex(0);
  },

  removeLastOptionIfSearchIsEmpty(dropdown, e) {
    if (this.get('searchText.length') !== 0) { return; }
    const lastSelection = this.get('selection.lastObject');
    if (!lastSelection) { return; }
    const lastText = typeof lastSelection === 'string' ? lastSelection : get(lastSelection, this.get('searchField'));
    this.removeOption(dropdown, lastSelection, e);
    this.set('searchText', lastText);
  },

  removeOption(dropdown, option, e) {
    const newSelection = this.cloneSelection();
    newSelection.removeObject(option);
    this.get('onchange')(newSelection, this.buildPublicAPI(dropdown), e);
  },

  focusSearch() {
    let el = Ember.$('.' + this.get('triggerUniqueClass'))[0];
    if (el) {
      el.querySelector('.ember-power-select-trigger-multiple-input').focus();
    }
  },

  cloneSelection() {
    return Ember.A((this.get('selection') || []).slice(0));
  }
});
