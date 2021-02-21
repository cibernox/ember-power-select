import Component from '@glimmer/component';
import { action } from '@ember/object';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';
import { assert } from '@ember/debug';
import { isBlank } from '@ember/utils';
import { htmlSafe } from '@ember/template';
import { Select } from '../power-select';

interface Args {
  select: Select
  placeholder?: string
  searchField: string
  onInput?: (e: InputEvent) => boolean
  onKeydown?: (e: KeyboardEvent) => boolean
  buildSelection: (lastSelection: any, select: Select) => any[]
}
interface IndexAccesible<T> {
  objectAt(index: number): T;
}
const isIndexAccesible = <T>(target: any): target is IndexAccesible<T> => {
  return typeof target.objectAt === 'function';
}

const ua = window && window.navigator ? window.navigator.userAgent : '';
const isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;

export default class Trigger extends Component<Args> {
  private inputFont?: string
  private _lastIsOpen: boolean = this.args.select.isOpen
  @service textMeasurer: any

  // Properties
  get triggerMultipleInputStyle() {
    scheduleOnce('actions', null, this.args.select.actions.reposition);
    if (!this.args.select.selected || get(this.args.select.selected, 'length') === 0) {
      return htmlSafe('width: 100%;');
    } else {
      let textWidth = 0;
      if (this.inputFont) {
        textWidth = this.textMeasurer.width(this.args.select.searchText, this.inputFont);
      }
      return htmlSafe(`width: ${textWidth + 25}px`);
    }
  }

  get maybePlaceholder() {
    if (isIE) {
      return undefined;
    }
    return (!this.args.select.selected || get(this.args.select.selected, 'length') === 0) ? (this.args.placeholder || '') : '';
  }

  // Actions
  @action
  openChanged(_el: Element, [isOpen]: [boolean]) {
    if (isOpen === false && this._lastIsOpen === true) {
      scheduleOnce('actions', null, this.args.select.actions.search, '');
    }
    this._lastIsOpen = isOpen;
  }

  @action
  storeInputStyles(input: Element) {
    let { fontStyle, fontVariant, fontWeight, fontSize, lineHeight, fontFamily } = window.getComputedStyle(input);
    this.inputFont = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`;
  }

  @action
  chooseOption(e: Event) {
    if (e.target === null) return;
    let selectedIndex = (e.target as Element).getAttribute('data-selected-index');
    if (selectedIndex) {
      let numericIndex = parseInt(selectedIndex, 10);
      e.stopPropagation();
      e.preventDefault();
      let object = this.selectedObject(this.args.select.selected, numericIndex);
      this.args.select.actions.choose(object);
    }
  }

  @action
  handleInput(e: InputEvent): void {
    if (this.args.onInput && this.args.onInput(e) === false) {
      return;
    }
    this.args.select.actions.open(e);
  }

  @action
  handleKeydown(e: KeyboardEvent): false | void {
    if (e.target === null) return;
    if (this.args.onKeydown && this.args.onKeydown(e) === false) {
      e.stopPropagation();
      return false;
    }
    if (e.keyCode === 8) {
      e.stopPropagation();
      if (isBlank((e.target as HTMLInputElement).value)) {
        let lastSelection = this.args.select.selected[this.args.select.selected.length - 1];
        if (lastSelection) {
          this.args.select.actions.select(this.args.buildSelection(lastSelection, this.args.select), e);
          if (typeof lastSelection === 'string') {
            this.args.select.actions.search(lastSelection);
          } else {
            assert('`<PowerSelectMultiple>` requires a `@searchField` when the options are not strings to remove options using backspace', this.args.searchField);
            this.args.select.actions.search(get(lastSelection, this.args.searchField));
          }
          this.args.select.actions.open(e);
        }
      }
    } else if (e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32) { // Keys 0-9, a-z or SPACE
      e.stopPropagation();
    }
  }

  selectedObject<T>(list: IndexAccesible<T> | T[], index: number): T {
    if (isIndexAccesible(list)) {
      return list.objectAt(index);
    } else {
      return get(list, index) as T;
    }
  }
}
