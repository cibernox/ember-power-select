import { layout, tagName } from "@ember-decorators/component";
import Component from '@ember/component';
import { action } from '@ember/object';
import { get } from '@ember/object';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { assert } from '@ember/debug';
import { isBlank } from '@ember/utils';
import { htmlSafe } from '@ember/string';
import templateLayout from '../../templates/components/power-select-multiple/trigger';

const ua = window && window.navigator ? window.navigator.userAgent : '';
const isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;

export default @tagName('') @layout(templateLayout) class Trigger extends Component {
  @service textMeasurer
  _lastIsOpen = false

  // CPs
  @computed('select.{searchText.length,selected.length}')
  get triggerMultipleInputStyle() {
    scheduleOnce('actions', this.select.actions.reposition);
    if (!this.select.selected || get(this.select.selected, 'length') === 0) {
      return htmlSafe('width: 100%;');
    } else {
      let textWidth = 0;
      if (this.inputFont) {
        textWidth = this.textMeasurer.width(this.select.searchText, this.inputFont);
      }
      return htmlSafe(`width: ${textWidth + 25}px`);
    }
  }

  @computed('placeholder', 'select.selected.length')
  get maybePlaceholder() {
    if (isIE) {
      return undefined;
    }
    return (!this.select.selected || get(this.select.selected, 'length') === 0) ? (this.placeholder || '') : '';
  }

  // Lifecycle hooks
  didReceiveAttrs() {
    let oldSelect = this.oldSelect || {};
    this.set('oldSelect', this.select);
    if (oldSelect.isOpen && !this.select.isOpen) {
      scheduleOnce('actions', null, this.select.actions.search, '');
    }
  }

  // Actions
  @action
  storeInputStyles(input) {
    let { fontStyle, fontVariant, fontWeight, fontSize, lineHeight, fontFamily } = window.getComputedStyle(input);
    this.inputFont = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`;
  }

  @action
  chooseOption(e) {
    let selectedIndex = e.target.getAttribute('data-selected-index');
    if (selectedIndex) {
      e.stopPropagation();
      e.preventDefault();
      let object = this.selectedObject(this.select.selected, selectedIndex);
      this.select.actions.choose(object);
    }
  }

  @action
  handleInput(e) {
    if (this.onInput && this.onInput(e) === false) {
      return;
    }
    this.select.actions.open(e);
  }

  @action
  handleKeydown(e) {
    if (this.onKeydown && this.onKeydown(e) === false) {
      e.stopPropagation();
      return false;
    }
    if (e.keyCode === 8) {
      e.stopPropagation();
      if (isBlank(e.target.value)) {
        let lastSelection = this.select.selected[this.select.selected.length - 1];
        if (lastSelection) {
          this.select.actions.select(this.buildSelection(lastSelection, this.select), e);
          if (typeof lastSelection === 'string') {
            this.select.actions.search(lastSelection);
          } else {
            assert('`<PowerSelectMultiple>` requires a `@searchField` when the options are not strings to remove options using backspace', this.searchField);
            this.select.actions.search(get(lastSelection, this.searchField));
          }
          this.select.actions.open(e);
        }
      }
    } else if (e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32) { // Keys 0-9, a-z or SPACE
      e.stopPropagation();
    }
  }

  selectedObject(list, index) {
    if (list.objectAt) {
      return list.objectAt(index);
    } else {
      return get(list, index);
    }
  }
}
