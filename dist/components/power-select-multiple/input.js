import Component from '@glimmer/component';
import { action, get } from '@ember/object';
import { assert } from '@ember/debug';
import { isBlank } from '@ember/utils';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{!-- template-lint-disable require-aria-activedescendant-tabindex --}}\n{{!-- template-lint-disable no-positive-tabindex --}}\n<input\n  type=\"search\"\n  class=\"ember-power-select-trigger-multiple-input\"\n  aria-activedescendant={{if @select.isOpen @ariaActiveDescendant}}\n  aria-haspopup=\"listbox\"\n  aria-expanded={{if @select.isOpen \"true\" \"false\"}}\n  autocomplete=\"off\"\n  autocorrect=\"off\"\n  autocapitalize=\"off\"\n  spellcheck={{false}}\n  id=\"ember-power-select-trigger-multiple-input-{{@select.uniqueId}}\"\n  aria-labelledby={{@ariaLabelledBy}}\n  aria-describedby={{@ariaDescribedBy}}\n  aria-label={{@ariaLabel}}\n  value={{@select.searchText}}\n  role={{or @role \"combobox\"}}\n  aria-owns={{if @select.isOpen @listboxId}}\n  aria-controls={{if @select.isOpen @listboxId}}\n  aria-autocomplete=\"list\"\n  placeholder={{this.maybePlaceholder}}\n  disabled={{@select.disabled}}\n  tabindex={{@tabindex}}\n  form=\"power-select-fake-form\"\n  {{on \"focus\" @onFocus}}\n  {{on \"blur\" @onBlur}}\n  {{on \"input\" this.handleInput}}\n  {{on \"keydown\" this.handleKeydown}}\n  ...attributes\n/>");

const ua = window && window.navigator ? window.navigator.userAgent : '';
const isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
class PowerSelectMultipleInputComponent extends Component {
  get maybePlaceholder() {
    if (isIE || !this.args.isDefaultPlaceholder) {
      return undefined;
    }
    return !this.args.select.selected || this.args.select.selected.length === 0 ? this.args.placeholder || '' : '';
  }
  handleInput(event) {
    const e = event;
    if (this.args.onInput && this.args.onInput(e) === false) {
      return;
    }
    this.args.select.actions.open(e);
  }
  static {
    n(this.prototype, "handleInput", [action]);
  }
  handleKeydown(event) {
    const e = event;
    if (e.target === null) return;
    if (this.args.onKeydown && this.args.onKeydown(e) === false) {
      e.stopPropagation();
      return false;
    }
    if (e.keyCode === 8) {
      e.stopPropagation();
      if (isBlank(e.target.value)) {
        const lastSelection = this.args.select.selected && this.args.select.selected[this.args.select.selected.length - 1];
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
    } else if (e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32) {
      // Keys 0-9, a-z or SPACE
      e.stopPropagation();
    }
  }
  static {
    n(this.prototype, "handleKeydown", [action]);
  }
}
setComponentTemplate(TEMPLATE, PowerSelectMultipleInputComponent);

export { PowerSelectMultipleInputComponent as default };
//# sourceMappingURL=input.js.map
