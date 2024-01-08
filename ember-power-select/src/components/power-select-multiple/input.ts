import Component from '@glimmer/component';
import { action } from '@ember/object';
import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import { assert } from '@ember/debug';
import { isBlank } from '@ember/utils';
import { htmlSafe } from '@ember/template';
import type { Select } from '../power-select';

interface PowerSelectMultipleInputSignature {
  Element: HTMLElement;
  Args: {
    select: Select;
    placeholder?: string;
    searchField: string;
    tabindex?: string;
    listboxId?: string;
    ariaLabel?: string;
    ariaActiveDescendant?: string;
    ariaLabelledBy?: string;
    placeholderComponent?: string;
    isDefaultPlaceholder?: boolean;
    onInput?: (e: InputEvent) => boolean;
    onKeydown?: (e: KeyboardEvent) => boolean;
    onFocus: (e: FocusEvent) => void;
    onBlur: (e: FocusEvent) => void;
    buildSelection: (lastSelection: any, select: Select) => any[];
  };
}

const ua = window && window.navigator ? window.navigator.userAgent : '';
const isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;

export default class PowerSelectMultipleInputComponent extends Component<PowerSelectMultipleInputSignature> {
  private inputFont?: string;

  // Properties
  get triggerMultipleInputStyle() {
    scheduleOnce('actions', null, this.args.select.actions.reposition);
    if (!this.args.select.selected || this.args.select.selected.length === 0) {
      return htmlSafe('width: 100%;');
    } else {
      let textWidth = 0;
      if (this.inputFont) {
        textWidth = this.measureWidth(
          this.args.select.searchText,
          this.inputFont,
        );
      }
      return htmlSafe(`width: ${textWidth + 25}px`);
    }
  }

  get maybePlaceholder() {
    if (isIE || !this.args.isDefaultPlaceholder) {
      return undefined;
    }
    return !this.args.select.selected || this.args.select.selected.length === 0
      ? this.args.placeholder || ''
      : '';
  }

  // Actions
  @action
  storeInputStyles(input: Element) {
    const {
      fontStyle,
      fontVariant,
      fontWeight,
      fontSize,
      lineHeight,
      fontFamily,
    } = window.getComputedStyle(input);
    this.inputFont = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`;
  }

  @action
  handleInput(event: Event): void {
    const e = event as InputEvent;
    if (this.args.onInput && this.args.onInput(e) === false) {
      return;
    }
    this.args.select.actions.open(e);
  }

  @action
  handleKeydown(event: Event): false | void {
    const e = event as KeyboardEvent;
    if (e.target === null) return;
    if (this.args.onKeydown && this.args.onKeydown(e) === false) {
      e.stopPropagation();
      return false;
    }
    if (e.keyCode === 8) {
      e.stopPropagation();
      if (isBlank((e.target as HTMLInputElement).value)) {
        const lastSelection =
          this.args.select.selected &&
          this.args.select.selected[this.args.select.selected.length - 1];
        if (lastSelection) {
          this.args.select.actions.select(
            this.args.buildSelection(lastSelection, this.args.select),
            e,
          );
          if (typeof lastSelection === 'string') {
            this.args.select.actions.search(lastSelection);
          } else {
            assert(
              '`<PowerSelectMultiple>` requires a `@searchField` when the options are not strings to remove options using backspace',
              this.args.searchField,
            );
            this.args.select.actions.search(
              get(lastSelection, this.args.searchField),
            );
          }
          this.args.select.actions.open(e);
        }
      }
    } else if ((e.keyCode >= 48 && e.keyCode <= 90) || e.keyCode === 32) {
      // Keys 0-9, a-z or SPACE
      e.stopPropagation();
    }
  }

  measureWidth(string: string, font?: string) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return 0;
    }

    if (font) {
      ctx.font = font;
    }
    return ctx.measureText(string).width;
  }
}
