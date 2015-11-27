import Ember from 'ember';
import PowerSelectBaseComponent from './base';
import layout from '../../templates/components/power-select/multiple';

const { computed, get } = Ember;

export default PowerSelectBaseComponent.extend({
  layout: layout,

  // CPs
  selection: computed('selected', {
    get() { return Ember.A(this.get('selected')); },
    set(_, v) { return v; }
  }),

  triggerUniqueClass: computed('elementId', function() {
    return `ember-power-select-trigger-${this.elementId}`;
  }),

  triggerClass: computed('triggerUniqueClass', function() {
    return `ember-power-select-trigger ${this.get('triggerUniqueClass')}`;
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
      this.get('onchange')(newSelection, dropdown);
    },

    removeOption(dropdown, option, e) {
      e.stopPropagation();
      this.removeOption(dropdown, option);
    },

    handleKeydown(dropdown, e) {
      const onkeydown = this.get('onkeydown');
      if (onkeydown) { onkeydown(dropdown, e); }
      if (e.defaultPrevented) { return; }
      if (e.keyCode === 8) {  // BACKSPACE
        this.removeLastOptionIfSearchIsEmpty(dropdown);
        dropdown.actions.open(e);
      } else if (e.keyCode === 13) {
        e.stopPropagation();
        if (dropdown.isOpen) {
          const highlighted = this.get('_highlighted');
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
  },

  // Methods
  defaultHighlighted() {
    return this.optionAtIndex(0);
  },

  removeLastOptionIfSearchIsEmpty(dropdown) {
    if (this.get('_searchText.length') !== 0) { return; }
    const lastSelection = this.get('selection.lastObject');
    if (!lastSelection) { return; }
    this.removeOption(dropdown, lastSelection);
    if (typeof lastSelection === 'string') {
      this.performSearch(lastSelection);
    } else {
      if (!this.get('searchField')) { throw new Error('Need to provide `searchField` when options are not strings'); }
      this.performSearch(get(lastSelection, this.get('searchField')));
    }
  },

  removeOption(dropdown, option) {
    const newSelection = this.cloneSelection();
    newSelection.removeObject(option);
    this._resultsDirty = true;
    this.get('onchange')(newSelection, dropdown);
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
