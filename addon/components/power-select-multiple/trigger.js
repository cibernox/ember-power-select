import Ember from 'ember';
import layout from '../../templates/components/power-select-multiple/trigger';

const { computed, get, isBlank } = Ember;
const { htmlSafe } = Ember.String;

export default Ember.Component.extend({
  tagName: '',
  layout,

  // CPs
  triggerMultipleInputStyle: computed('searchText.length', 'selected.length', function() {
    if (this.get('selected.length') === 0) {
      return htmlSafe('width: 100%;');
    } else {
      return htmlSafe(`width: ${(this.get('searchText.length') || 0) * 0.5 + 2}em`);
    }
  }),

  maybePlaceholder: computed('placeholder', 'selected.length', function() {
    const selected = this.get('selected');
    return (!selected || get(selected, 'length') === 0) ? (this.get('placeholder') || '') : '';
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
        onkeydown,
        select,
        searchText
      } = this.getProperties('highlighted', 'onkeydown', 'select', 'searchText');
      const selected = Ember.A((this.get('selected') || []));
      if (onkeydown) { onkeydown(select, e); }
      if (e.defaultPrevented) { return; }
      if (e.keyCode === 13 && select.isOpen) {
        if ((this.get('selected') || []).indexOf(highlighted) === -1) {
          this.get('select.actions.choose')(this.buildNewSelection(highlighted), e);
        }
      } else if (e.keyCode === 8 && isBlank(searchText)) {
        const lastSelection = get(selected, 'lastObject');
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
    const newSelection = Ember.A((this.get('selected') || []).slice(0));
    if (newSelection.indexOf(option) > -1) {
      newSelection.removeObject(option);
    } else {
      newSelection.addObject(option);
    }
    return newSelection;
  }
});
