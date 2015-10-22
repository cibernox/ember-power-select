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
    // It is not evident what is going on here, so I'll explain why.
    //
    // As of this writting, Ember doesn allow to yield data to the "inverse" block.
    // Because of that, elements of this component rendered in the trigger can't receive the
    // yielded object contaning the public API of the ember-basic-dropdown, with actions for open,
    // close and toggle.
    //
    // The only possible workaround for this is to on initialization inject a similar object
    // to the one yielded and store it to make it available in the entire component.
    //
    // This this limitation on ember should be fixed soon, this is temporary. Because of that this
    // object will be passed to the action from the inverse block like if it was yielded.
    //
    registerDropdown(dropdown) {
      this.set('registeredDropdown', dropdown);
    },

    removeOption(option, e) {
      e.stopPropagation();
      this.removeOption(option);
    },

    multipleModeInputKeydown(dropdown, e) {
      if (e.keyCode === 40 || e.keyCode === 38) { // Arrow up/down
        this.handleVerticalArrowKey(e);
      } else if (e.keyCode === 8) {   // backspace
        this.removeLastOptionIfSearchIsEmpty();
        dropdown.open(e);
      } else if (e.keyCode === 13) {  // Enter
        e.stopPropagation();
        const highlighted = this.get('_highlighted');
        if (highlighted && (this.get('selected') || []).indexOf(highlighted) === -1) {
          this.select(highlighted, dropdown, e);
        } else {
          dropdown.close(e);
        }
      } else if (e.keyCode === 9) {   // Tab
        dropdown.close(e);
      } else if (e.keyCode === 27) {  // escape
        e.preventDefault();
        dropdown.close(e);
      } else {
        dropdown.open(e);
      }
    }
  },

  // Methods
  defaultHighlighted() {
    return this.optionAtIndex(0);
  },

  select(option, dropdown, e) {
    let newSelection = (this.get('selection') || []).slice(0);
    newSelection = Ember.A(newSelection);
    if (newSelection.indexOf(option) > -1) {
      newSelection.removeObject(option);
    } else {
      newSelection.addObject(option);
    }
    this.get('onchange')(newSelection);
    dropdown.close(e);
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
