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
    choose(dropdown, option, e) {
      this.send('select', dropdown, this.buildNewSelection(option), e);
      if (this.get('closeOnSelect')) {
        dropdown.actions.close(e);
      }
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
            this.send('choose', dropdown, highlighted, e);
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
    this.send('select', dropdown, this.buildNewSelection(lastSelection), e);
    this.set('searchText', lastText);
  },

  focusSearch() {
    let el = Ember.$('.' + this.get('triggerUniqueClass'))[0];
    if (el) {
      el.querySelector('.ember-power-select-trigger-multiple-input').focus();
    }
  },

  cloneSelection() {
    return Ember.A((this.get('selection') || []).slice(0));
  },

  buildNewSelection(option) {
    const newSelection = this.cloneSelection();
    if (newSelection.indexOf(option) > -1) {
      newSelection.removeObject(option);
    } else {
      newSelection.addObject(option);
    }
    return newSelection;
  }
});
