import Ember from 'ember';
import layout from '../../templates/components/power-select-multiple/trigger';
import { emberPowerSelectBuildSelection as buildNewSelection } from '../../helpers/ember-power-select-build-selection';

const { computed, get, isBlank, run } = Ember;
const { htmlSafe } = Ember.String;

export default Ember.Component.extend({
  tagName: '',
  layout,

  // Lifecycle hooks
  didUpdateAttrs({ oldAttrs, newAttrs }) {
    this._super(...arguments);
    if (oldAttrs.select.isOpen && !newAttrs.select.isOpen) {
      this.handleClose();
    }
  },

  // CPs
  triggerMultipleInputStyle: computed('searchText.length', 'selected.length', function() {
    run.scheduleOnce('afterRender', this.get('select.actions.reposition'));
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
      let { highlighted, onkeydown, select } = this.getProperties('highlighted', 'onkeydown', 'select');
      if (onkeydown) { onkeydown(select, e); }
      if (e.defaultPrevented) { return; }

      let selected = Ember.A((this.get('selected') || []));
      if (e.keyCode === 13 && select.isOpen && highlighted !== undefined) {
        if (selected.indexOf(highlighted) === -1) {
          select.actions.choose(buildNewSelection([highlighted, selected], { multiple: true }), e);
        }
      } else if (e.keyCode === 8 && isBlank(e.target.value)) {
        let lastSelection = get(selected, 'lastObject');
        if (lastSelection) {
          select.actions.select(buildNewSelection([lastSelection, selected], { multiple: true }), e);
          if (typeof lastSelection === 'string') {
            select.actions.search(lastSelection);
          } else {
            let searchField = this.get('searchField');
            Ember.assert('`{{power-select-multiple}}` requires a `searchField` when the options are not strings', searchField);
            select.actions.search(get(lastSelection, searchField));
          }
        }
      } else {
        select.actions.handleKeydown(e);
      }
    }
  },

  // Methods
  handleClose() {
    this.set('searchText', ''); // This line shouldn't be necessary. Why is it?
    this.get('select.actions.search')('');
  }
});
