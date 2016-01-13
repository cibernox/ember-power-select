import Ember from 'ember';
import layout from '../../templates/components/power-select-multiple/trigger';
import { emberPowerSelectBuildSelection as buildNewSelection } from '../../helpers/ember-power-select-build-selection';

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
      const { search, open } = this.get('select.actions');
      search(term, e);
      open(e);
    },

    handleKeydown(e) {
      const { highlighted, onkeydown, select, searchText} = this.getProperties('highlighted', 'onkeydown', 'select', 'searchText');
      const selected = Ember.A((this.get('selected') || []));
      if (onkeydown) { onkeydown(select, e); }
      if (e.defaultPrevented) { return; }
      if (e.keyCode === 13 && select.isOpen) {
        if (selected.indexOf(highlighted) === -1) {
          select.actions.choose(buildNewSelection([highlighted, selected], { multiple: true }), e);
        }
      } else if (e.keyCode === 8 && isBlank(searchText)) {
        const lastSelection = get(selected, 'lastObject');
        if (lastSelection) {
          select.actions.select(buildNewSelection([lastSelection, selected], { multiple: true }), e);
          select.actions.search(lastSelection);
        }
      } else {
        select.actions.handleKeydown(e);
      }
    }
  }
});
