import Ember from 'ember';
import layout from '../../templates/components/power-select-multiple/trigger';
import { emberPowerSelectBuildSelection as buildNewSelection } from '../../helpers/ember-power-select-build-selection';
import updateInput from '../../utils/update-input-value';

const { computed, get, isBlank, run } = Ember;
const { htmlSafe } = Ember.String;

export default Ember.Component.extend({
  tagName: '',
  layout,

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    this.input = document.querySelector(`.${this.elementId}-input`);
  },

  didUpdateAttrs({ oldAttrs, newAttrs }) {
    this._super(...arguments);
    if (oldAttrs.select.isOpen && !newAttrs.select.isOpen) {
      this.handleClose();
    }
    if (newAttrs.searchText !== oldAttrs.searchText) {
      run.scheduleOnce('afterRender', this, this.updateInput, oldAttrs.searchText, newAttrs.searchText);
    }
  },

  // CPs
  triggerMultipleInputStyle: computed('searchText.length', 'selected.length', function() {
    run.scheduleOnce('afterRender', this.get('select.actions.reposition'));
    if (this.get('selected.length') === 0) {
      return htmlSafe('min-width: 100%;');
    } else {
      return htmlSafe(`min-width: ${(this.get('searchText.length') || 0) * 0.5 + 0.5}em`);
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
    run.scheduleOnce('actions', null, this.get('select.actions.search'), '');
  },

  updateInput(oldText, newText) {
    updateInput(this.input, oldText, newText);
  }
});
