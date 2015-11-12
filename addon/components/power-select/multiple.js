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
    removeOption(option, dropdown, e) {
      e.stopPropagation();
      this.removeOption(option, dropdown);
    },
  },

  // Methods
  onKeydown(dropdown, e) {
    if (e.defaultPrevented) { return; }
    if (e.keyCode === 8) {  // BACKSPACE
      this.removeLastOptionIfSearchIsEmpty(dropdown);
      dropdown.open(e);
    } else if (e.keyCode === 13) {
      e.stopPropagation();
      if (dropdown.isOpen) {
        const highlighted = this.get('_highlighted');
        if (highlighted && (this.get('selected') || []).indexOf(highlighted) === -1) {
          this.select(highlighted, dropdown, e);
        } else {
          dropdown.close(e);
        }
      } else {
        dropdown.open(e);
      }
    } else {
      this._super(...arguments);
    }
  },

  defaultHighlighted() {
    return this.optionAtIndex(0);
  },

  select(option, dropdown, e) {
    e.preventDefault();
    const newSelection = this.cloneSelection();
    if (newSelection.indexOf(option) > -1) {
      newSelection.removeObject(option);
    } else {
      newSelection.addObject(option);
    }
    if (this.get('closeOnSelect')) {
      dropdown.close(e);
    }
    this.get('onchange')(newSelection, dropdown);
  },

  removeLastOptionIfSearchIsEmpty(dropdown) {
    if (this.get('_searchText.length') !== 0) { return; }
    const lastSelection = this.get('selection.lastObject');
    if (!lastSelection) { return; }
    this.removeOption(lastSelection, dropdown);
    if (typeof lastSelection === 'string') {
      this.performSearch(lastSelection);
    } else {
      if (!this.get('searchField')) { throw new Error('Need to provide `searchField` when options are not strings'); }
      this.performSearch(get(lastSelection, this.get('searchField')));
    }
  },

  removeOption(option, dropdown) {
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
