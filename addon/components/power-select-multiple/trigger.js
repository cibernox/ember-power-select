import Ember from 'ember';
import layout from '../../templates/components/power-select-multiple/trigger';
import { emberPowerSelectBuildSelection as buildNewSelection } from '../../helpers/ember-power-select-build-selection';
import updateInput from '../../utils/update-input-value';

const { computed, get, isBlank, run } = Ember;
const { htmlSafe } = Ember.String;
const ua = window.navigator.userAgent;
const isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
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
    if (newAttrs.searchText !== undefined && newAttrs.searchText !== null) {
      run.scheduleOnce('afterRender', this, this.updateInput, newAttrs.searchText);
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
    if (isIE) { return null; }
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
      let { onkeydown, select } = this.getProperties('onkeydown', 'select');
      if (onkeydown) { onkeydown(select, e); }
      if (e.defaultPrevented) { return; }

      let selected = Ember.A((this.get('selected') || []));
      if (e.keyCode === 8 && isBlank(e.target.value)) {
        let lastSelection = get(selected, 'lastObject');
        if (lastSelection) {
          select.actions.select(buildNewSelection([lastSelection, selected], { multiple: true }), e);
          if (typeof lastSelection === 'string') {
            select.actions.search(lastSelection);
          } else {
            let searchField = this.get('searchField');
            Ember.assert('`{{power-select-multiple}}` requires a `searchField` when the options are not strings to remove options using backspace', searchField);
            select.actions.search(get(lastSelection, searchField));
          }
        }
      } else if (e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32) { // Keys 0-9, a-z or SPACE
        e.stopPropagation();
      }
    }
  },

  // Methods
  handleClose() {
    run.scheduleOnce('actions', null, this.get('select.actions.search'), '');
  },

  updateInput(value) {
    updateInput(this.input, value);
  }
});
