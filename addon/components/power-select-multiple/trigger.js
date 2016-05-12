import Ember from 'ember';
import layout from '../../templates/components/power-select-multiple/trigger';
import updateInput from '../../utils/update-input-value';
import readInput from '../../utils/read-input-value';

const { computed, get, isBlank, run } = Ember;
const ua = self.window ? self.window.navigator.userAgent : '';
const isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
const isTouchDevice = (Ember.testing || !!self.window && 'ontouchstart' in self.window);

export default Ember.Component.extend({
  tagName: '',
  layout,

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    this.input = document.querySelector(`.${this.elementId}-input`);
    let optionsList = document.getElementById(`${this.elementId}-ember-power-select-multiple-options`);
    let chooseOption = e => {
      if (e.target.dataset.selectedIndex) {
        e.stopPropagation();
        e.preventDefault();

        let index = e.target.dataset.selectedIndex;
        let selected = this.get('selected');
        let object = this.selectedObject(selected, index);

        this.get('select.actions.choose')(object);
      }
    };
    if (isTouchDevice) {
      optionsList.addEventListener('touchstart', chooseOption);
    }
    optionsList.addEventListener('mousedown', chooseOption);
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
  maybePlaceholder: computed('placeholder', 'selected.length', function() {
    if (isIE) { return null; }
    const selected = this.get('selected');
    return (!selected || get(selected, 'length') === 0) ? (this.get('placeholder') || '') : '';
  }),

  // Actions
  actions: {
    handleInput(e) {
      let action = this.get('handleInput');
      if (action) { action(e); }
      if (e.defaultPrevented) { return; }
      this.get('select.actions.open')(e);
    },

    handleKeydown(e) {
      let { onkeydown, select } = this.getProperties('onkeydown', 'select');
      if (onkeydown && onkeydown(select, e) === false) { return false; }
      let selected = Ember.A((this.get('selected') || []));
      if (e.keyCode === 8 && isBlank(readInput(e.target))) {
        let lastSelection = get(selected, 'lastObject');
        if (lastSelection) {
          select.actions.select(this.get('buildSelection')(lastSelection), e);
          if (typeof lastSelection === 'string') {
            select.actions.search(lastSelection);
          } else {
            let searchField = this.get('searchField');
            Ember.assert('`{{power-select-multiple}}` requires a `searchField` when the options are not strings to remove options using backspace', searchField);
            select.actions.search(get(lastSelection, searchField));
          }
          select.actions.open(e);
        }
      } else if (e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32) { // Keys 0-9, a-z or SPACE
        e.stopPropagation();
      } else if (e.keyCode === 13) {
        e.preventDefault();
      }
    }
  },

  // Methods
  handleClose() {
    run.scheduleOnce('actions', null, this.get('select.actions.search'), '');
  },

  updateInput(value) {
    updateInput(this.input, value);
  },

  selectedObject(list, index) {
    if (list.objectAt) {
      return list.objectAt(index);
    } else {
      return get(list, index);
    }
  }
});
