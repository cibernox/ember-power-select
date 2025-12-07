import { buildTask } from 'ember-concurrency/async-arrow-runtime';
import Component from '@glimmer/component';
import { get, action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { deprecate, assert } from '@ember/debug';
import { isBlank } from '@ember/utils';
import { timeout } from 'ember-concurrency';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<div class=\"ember-power-select-input\">\n  {{! template-lint-disable require-input-label }}\n  {{! template-lint-disable no-positive-tabindex }}\n  {{! template-lint-disable require-aria-activedescendant-tabindex }}\n  <input\n    type=\"search\"\n    autocomplete=\"off\"\n    autocorrect=\"off\"\n    autocapitalize=\"off\"\n    spellcheck={{false}}\n    class={{if\n      @select.multiple\n      \"ember-power-select-trigger-multiple-input\"\n      \"ember-power-select-search-input-field\"\n    }}\n    value={{@select.searchText}}\n    role={{or @role \"combobox\"}}\n    aria-activedescendant={{if @select.isOpen @ariaActiveDescendant}}\n    aria-controls={{if @select.isOpen @listboxId}}\n    aria-owns={{if @select.isOpen @listboxId}}\n    aria-autocomplete=\"list\"\n    aria-haspopup=\"listbox\"\n    aria-expanded={{if @select.isOpen \"true\" \"false\"}}\n    placeholder={{this.placeholder}}\n    aria-label={{@ariaLabel}}\n    aria-labelledby={{@ariaLabelledBy}}\n    aria-describedby={{@ariaDescribedBy}}\n    disabled={{@select.disabled}}\n    tabindex={{@tabindex}}\n    form=\"power-select-fake-form\"\n    id=\"ember-power-select-trigger-input-{{@select.uniqueId}}\"\n    {{on \"input\" this.handleInput}}\n    {{on \"focus\" this.handleFocus}}\n    {{on \"blur\" this.handleBlur}}\n    {{on \"keydown\" this.handleKeydown}}\n    {{this.setupInput}}\n    {{this.openChange @select.isOpen}}\n    ...attributes\n  />\n</div>");

class PowerSelectInput extends Component {
  didSetup = false;
  _lastIsOpen = this.args.select.isOpen;
  get placeholder() {
    if (this.args.placeholder !== undefined) {
      deprecate('You are using `power-select/input-field` with parameter @placeholder. Replace @placeholder with @searchPlaceholder', false, {
        for: 'ember-power-select',
        id: 'ember-power-select.deprecate-input-field-placeholder-argument',
        since: {
          enabled: '8.11',
          available: '8.11'
        },
        until: '9.0.0'
      });
    }
    if (!this.args.isDefaultPlaceholder) {
      return undefined;
    }
    if (this.args.select.multiple) {
      return !this.args.select.selected || Array.isArray(this.args.select.selected) && this.args.select.selected.length === 0 ? this.args.placeholder || this.args.searchPlaceholder || '' : '';
    }
    return this.args.placeholder || this.args.searchPlaceholder;
  }
  handleKeydown(e) {
    if (e.target === null) return;
    if (this.args.onKeydown && this.args.onKeydown(e) === false) {
      e.stopPropagation();
      return false;
    }
    if (this.args.select.multiple) {
      if (e.keyCode === 8) {
        e.stopPropagation();
        if (isBlank(e.target.value) && this.args.buildSelection) {
          const lastSelection = Array.isArray(this.args.select.selected) && this.args.select.selected[this.args.select.selected.length - 1];
          if (lastSelection) {
            this.args.select.actions.select(this.args.buildSelection(lastSelection, this.args.select), e);
            if (typeof lastSelection === 'string') {
              this.args.select.actions.search(lastSelection);
            } else {
              assert('`<PowerSelect>` requires a `@searchField` when the options are not strings to remove options using backspace', this.args.searchField);
              this.args.select.actions.search(get(lastSelection, this.args.searchField) || '');
            }
            this.args.select.actions.open(e);
          }
        }
      } else if (e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32) {
        // Keys 0-9, a-z or SPACE
        e.stopPropagation();
      }
    } else if (e.keyCode === 13) {
      this.args.select.actions.close(e);
    }
  }
  static {
    n(this.prototype, "handleKeydown", [action]);
  }
  handleInput(event) {
    const e = event;
    if (this.args.onInput && this.args.onInput(e) === false) {
      return false;
    }
    this.args.select.actions.open(e);
  }
  static {
    n(this.prototype, "handleInput", [action]);
  }
  handleBlur(event) {
    if (!this._lastIsOpen && this.args.searchFieldPosition === 'trigger') {
      this.args.select.actions?.search('');
    }
    if (this.args.onBlur) {
      this.args.onBlur(event);
    }
  }
  static {
    n(this.prototype, "handleBlur", [action]);
  }
  handleFocus(event) {
    if (this.args.onFocus) {
      this.args.onFocus(event);
    }
  }
  static {
    n(this.prototype, "handleFocus", [action]);
  }
  setupInput = modifier(el => {
    if (this.didSetup) {
      return;
    }
    this.didSetup = true;
    if (this.args.searchFieldPosition === undefined || this.args.searchFieldPosition === 'before-options') {
      this._focusInput(el);
    }
    return () => {
      // We don't need to reset search value, when searchFieldPosition is trigger, because complete power select will be destroyed
      if (this.args.searchFieldPosition === 'trigger') {
        return;
      }
      this.args.select.actions?.search('');
    };
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    eager: false
  });
  openChange = modifier((element, [isOpen]) => {
    this._openChanged(element, [isOpen]);
  });
  _openChanged(element, [isOpen]) {
    if (isOpen === false && this._lastIsOpen === true && document.activeElement !== element) {
      Promise.resolve().then(() => {
        this.args.select.actions?.search('');
      });
    }
    this._lastIsOpen = isOpen;
  }
  _focusInput(el) {
    this.focusLaterTask.perform(el);
  }
  focusLaterTask = buildTask(() => ({
    context: this,
    generator: function* (el) {
      yield timeout(0);
      if (this.args.autofocus !== false) {
        el.focus();
      }
    }
  }), null, "focusLaterTask", null);
}
setComponentTemplate(TEMPLATE, PowerSelectInput);

export { PowerSelectInput as default };
//# sourceMappingURL=input.js.map
