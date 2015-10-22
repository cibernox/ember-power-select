import Ember from 'ember';
import PowerSelectBaseComponent from './base';
import layout from '../../templates/components/ember-power-select/multiple';

const { computed, get } = Ember;
const { htmlSafe } = Ember.String;

export default PowerSelectBaseComponent.extend({
  layout: layout,

  // CPs
  selection: computed('selected', {
    get() { return Ember.A(this.get('selected')); },
    set(_, v) { return v; }
  }),

  triggerMultipleInputStyle: computed('_searchText', function() {
    return htmlSafe(`width: ${(this.get('_searchText.length') || 0) * 0.5 + 2}em`);
  }),

  // Actions
  actions: {
    removeOption(option, e) {
      e.stopPropagation();
      this.removeOption(option);
    },

    multipleModeInputKeydown(e) {
      if (e.keyCode === 40 || e.keyCode === 38) { // Arrow up/down
        return this.handleVerticalArrowKey(e);
      }
      let event = document.createEvent('Event');
      if (e.keyCode === 8) {   // backspace
        this.removeLastOptionIfSearchIsEmpty();
        event.initEvent('dropdown:open', true, true);
      } else if (e.keyCode === 13) {  // Enter
        e.stopPropagation();
        const highlighted = this.get('_highlighted');
        if (highlighted && (this.get('selected') || []).indexOf(highlighted) === -1) {
          this.select(highlighted);
        }
        event.initEvent('dropdown:toggle', true, true);
      } else if (e.keyCode === 9) {   // Tab
        event.initEvent('dropdown:close', true, true);
      } else if (e.keyCode === 27) {  // escape
        e.preventDefault();
        event.initEvent('dropdown:close', true, true);
      } else {
        event.initEvent('dropdown:open', true, true);
      }
      this.element.querySelector('.ember-power-select').dispatchEvent(event);
    }
  },

  // Methods
  defaultHighlighted() {
    return this.optionAtIndex(0);
  },

  select(option) {
    let newSelection = (this.get('selection') || []).slice(0);
    newSelection = Ember.A(newSelection);
    if (newSelection.indexOf(option) > -1) {
      newSelection.removeObject(option);
    } else {
      newSelection.addObject(option);
    }
    this.get('onchange')(newSelection);
  },

  removeLastOptionIfSearchIsEmpty() {
    if (this.get('_searchText.length') !== 0) { return; }
    const lastSelection = this.get('selection.lastObject');
    if (!lastSelection) { return; }
    this.removeOption(lastSelection);
    if (typeof lastSelection === 'string') {
      this.set('_searchText', lastSelection); // TODO: Convert last selection to text
    } else {
      if (!this.get('searchField')) { throw new Error('Need to provide `searchField` when options are not strings'); }
      this.set('_searchText', get(lastSelection, this.get('searchField'))); // TODO: Convert last selection to text
    }
  },

  removeOption(option) {
    this.get('selection').removeObject(option);
    this._resultsDirty = true;
    this.get('onchange')(this.get('selection'));
  },

  focusSearch() {
    this.element.querySelector('.ember-power-select-trigger-multiple-input').focus();
  }
});
