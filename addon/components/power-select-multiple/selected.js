import Ember from 'ember';
import layout from '../../templates/components/power-select-multiple/selected';

const { computed, get, isBlank } = Ember;
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
      const {
        highlighted,
        closeOnSelect,
        onkeydown,
        select,
        selection,
        searchText
      } = this.getProperties('highlighted', 'closeOnSelect', 'onkeydown', 'select', 'selection', 'searchText');
      if (onkeydown) { onkeydown(select, e); }
      if (e.defaultPrevented) { return; }
      if (e.keyCode === 13 && select.isOpen) {
        this.get('select.actions.select')(this.buildNewSelection(highlighted), e);
        if (closeOnSelect) { this.get('select.actions.close')(e); }
      } else if (e.keyCode === 8 && isBlank(searchText)) {
        const lastSelection = get(selection, 'lastObject');
        if (lastSelection) {
          this.get('select.actions.select')(this.buildNewSelection(lastSelection), e);
          this.get('select.actions.search')(lastSelection);
        }
      } else {
        this.get('select.actions.handleKeydown')(e);
      }
    },

    removeOption(option, e) {
      this.get('select.actions.select')(this.buildNewSelection(option), e);
    }
  },

  // Methods
  buildNewSelection(option) {
    const newSelection = Ember.A((this.get('selection') || []).slice(0));
    if (newSelection.indexOf(option) > -1) {
      newSelection.removeObject(option);
    } else {
      newSelection.addObject(option);
    }
    return newSelection;
  }
});
