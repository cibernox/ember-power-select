import Component from '@ember/component';
import { get } from '@ember/object';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { assert } from '@ember/debug';
import { isBlank } from '@ember/utils';
import { htmlSafe } from '@ember/string';
import layout from '../../templates/components/power-select-multiple/trigger';

const ua = self.window && self.window.navigator ? self.window.navigator.userAgent : '';
const isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
const isTouchDevice = !!self.window && 'ontouchstart' in self.window;

export default Component.extend({
  tagName: '',
  layout,
  textMeasurer: inject(),
  _lastIsOpen: false,

  // Lifecycle hooks
  didInsertElement() {
    this._super(...arguments);
    let select = this.get('select');
    this.input = document.getElementById(`ember-power-select-trigger-multiple-input-${select.uniqueId}`);
    let inputStyle = this.input ? window.getComputedStyle(this.input) : null;
    this.inputFont = inputStyle ? `${ inputStyle.fontStyle } ${  inputStyle.fontVariant} ${ inputStyle.fontWeight } ${ inputStyle.fontSize}/${ inputStyle.lineHeight } ${ inputStyle.fontFamily }` : null;
    let optionsList = document.getElementById(`ember-power-select-multiple-options-${select.uniqueId}`);
    let chooseOption = (e) => {
      let selectedIndex = e.target.getAttribute('data-selected-index');
      if (selectedIndex) {
        e.stopPropagation();
        e.preventDefault();

        let select = this.get('select');
        let object = this.selectedObject(select.selected, selectedIndex);
        select.actions.choose(object);
      }
    };
    if (isTouchDevice) {
      optionsList.addEventListener('touchstart', chooseOption);
    }
    optionsList.addEventListener('mousedown', chooseOption);
  },

  didReceiveAttrs() {
    let oldSelect = this.get('oldSelect') || {};
    let select = this.set('oldSelect', this.get('select'));
    if (oldSelect.isOpen && !select.isOpen) {
      scheduleOnce('actions', null, select.actions.search, '');
    }
  },

  // CPs
  triggerMultipleInputStyle: computed('select.searchText.length', 'select.selected.length', function() {
    let select = this.get('select');
    scheduleOnce('actions', select.actions.reposition);
    if (!select.selected || select.selected.length === 0) {
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
    if (isIE) {
      return null;
    }
    let select = this.get('select');
    return (!select.selected || get(select.selected, 'length') === 0) ? (this.get('placeholder') || '') : '';
  }),

  // Actions
  actions: {
    onInput(e) {
      let action = this.get('onInput');
      if (action &&  action(e) === false) {
        return;
      }
      this.get('select').actions.open(e);
    },

    onKeydown(e) {
      let { onKeydown, select } = this.getProperties('onKeydown', 'select');
      if (onKeydown && onKeydown(e) === false) {
        e.stopPropagation();
        return false;
      }
      if (e.keyCode === 8) {
        e.stopPropagation();
        if (isBlank(e.target.value)) {
          let lastSelection = select.selected[select.selected.length - 1];
          if (lastSelection) {
            select.actions.select(this.get('buildSelection')(lastSelection, select), e);
            if (typeof lastSelection === 'string') {
              select.actions.search(lastSelection);
            } else {
              let searchField = this.get('searchField');
              assert('`{{power-select-multiple}}` requires a `searchField` when the options are not strings to remove options using backspace', searchField);
              select.actions.search(get(lastSelection, searchField));
            }
            select.actions.open(e);
          }
        }
      } else if (e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32) { // Keys 0-9, a-z or SPACE
        e.stopPropagation();
      }
    }
  },

  // Methods
  selectedObject(list, index) {
    if (list.objectAt) {
      return list.objectAt(index);
    } else {
      return get(list, index);
    }
  }
});
