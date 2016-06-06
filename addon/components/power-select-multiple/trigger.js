import Ember from 'ember';
import layout from '../../templates/components/power-select-multiple/trigger';

const { computed, get, isBlank, run, inject: { service } } = Ember;
const { htmlSafe } = Ember.String;
const ua = self.window ? self.window.navigator.userAgent : '';
const isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
const isTouchDevice = (Ember.testing || !!self.window && 'ontouchstart' in self.window);

export default Ember.Component.extend({
  tagName: '',
  layout,
  textMeasurer: service(),

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    this.input = document.querySelector(`.${this.elementId}-input`);
    this.inputFont = this.input ? window.getComputedStyle(this.input).font : null;
    let optionsList = document.getElementById(`${this.elementId}-ember-power-select-multiple-options`);
    let chooseOption = e => {
      let selectedIndex = e.target.getAttribute('data-selected-index');
      if (selectedIndex) {
        e.stopPropagation();
        e.preventDefault();

        let select = this.getAttr('select');
        let object = this.selectedObject(select.selected, selectedIndex);
        select.actions.choose(object);
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
  },

  // CPs
  triggerMultipleInputStyle: computed('select.searchText.length', 'select.selected.length', function() {
    let select = this.getAttr('select');
    select.actions.reposition();
    if (!this.get('selected.length')) {
      return htmlSafe('width: 100%;');
    } else {
      let textWidth = 0;
      if (this.inputFont) {
        textWidth = this.get('textMeasurer').width(select.searchText, this.inputFont);
      }
      return htmlSafe(`width: ${textWidth + 25}px`);
    }
  }),

  maybePlaceholder: computed('placeholder', 'select.selected.length', function() {
    if (isIE) { return null; }
    let select = this.getAttr('select');
    return (!select.selected || get(select.selected, 'length') === 0) ? (this.get('placeholder') || '') : '';
  }),

  // Actions
  actions: {
    onInput(e) {
      let action = this.get('onInput');
      if (action &&  action(e) === false) { return; }
      this.getAttr('select').actions.open(e);
    },

    onKeydown(e) {
      let { onkeydown, select } = this.getProperties('onkeydown', 'select');
      if (onkeydown && onkeydown(select, e) === false) { return false; }
      if (e.keyCode === 8 && isBlank(e.target.value)) {
        let lastSelection = get(select.selected, 'lastObject');
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
      }
    }
  },

  // Methods
  handleClose() {
    run.scheduleOnce('actions', null, this.get('select.actions.search'), '');
  },

  selectedObject(list, index) {
    if (list.objectAt) {
      return list.objectAt(index);
    } else {
      return get(list, index);
    }
  }
});
