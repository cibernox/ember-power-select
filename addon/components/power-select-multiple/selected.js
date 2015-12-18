import Ember from 'ember';
import layout from '../../templates/components/power-select-multiple/selected';

const { computed } = Ember;
const { htmlSafe } = Ember.String;

export default Ember.Component.extend({
  tagName: '',
  layout,

  // CPs
  triggerMultipleInputStyle: computed('searchText.length', 'selection.length', function() {
    if (this.get('selection.length') === 0) {
      return htmlSafe('width: 100%;');
    } else {
      return htmlSafe(`width: ${(this.get('searchText.length') || 0) * 0.5 + 2}em`);
    }
  }),

  maybePlaceholder: computed('placeholder', 'selection.length', function() {
    return this.get('selection.length') === 0 ? (this.get('placeholder') || '') : '';
  }),

  // Actions
  actions: {
    search(term, e) {
      let { search, open } = this.get('select.actions');
      search(term, e);
      open(e);
    },

    handleKeydown(e) {
      if (e.keyCode === 13) {
        const { highlighted, closeOnSelect, onkeydown, select } = this.getProperties('highlighted', 'closeOnSelect', 'onkeydown', 'select');
        if (onkeydown) { onkeydown(select, e); }
        if (e.defaultPrevented) { return; }
        const newSelection = Ember.A((this.get('selection') || []).slice(0));
        if (newSelection.indexOf(highlighted) > -1) {
          newSelection.removeObject(highlighted);
        } else {
          newSelection.addObject(highlighted);
        }
        this.get('select.actions.select')(newSelection, e);
        if (closeOnSelect) {
          this.get('select.actions.close')(e);
        }
      } else {
        this.get('select.actions.handleKeydown')(e);
      }
    },

    removeOption(/*option, e*/) {
      console.debug('Not implemented');
    }
  }
});
