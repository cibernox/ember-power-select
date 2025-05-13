import Component from '@glimmer/component';
import { runTask } from 'ember-lifeline';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<div class=\"ember-power-select-input\">\n  {{! template-lint-disable require-input-label }}\n  <input\n    type=\"search\"\n    autocomplete=\"off\"\n    autocorrect=\"off\"\n    autocapitalize=\"off\"\n    spellcheck={{false}}\n    class=\"ember-power-select-search-input-field\"\n    value={{@select.searchText}}\n    role={{or @role \"combobox\"}}\n    aria-activedescendant={{if @select.isOpen @ariaActiveDescendant}}\n    aria-controls={{if @select.isOpen @listboxId}}\n    aria-owns={{if @select.isOpen @listboxId}}\n    aria-autocomplete=\"list\"\n    aria-haspopup=\"listbox\"\n    aria-expanded={{if @select.isOpen \"true\" \"false\"}}\n    placeholder={{@searchPlaceholder}}\n    aria-label={{@ariaLabel}}\n    aria-labelledby={{@ariaLabelledBy}}\n    aria-describedby={{@ariaDescribedBy}}\n    {{on \"input\" this.handleInput}}\n    {{on \"focus\" @onFocus}}\n    {{on \"blur\" this.handleBlur}}\n    {{on \"keydown\" this.handleKeydown}}\n    {{this.setupInput}}\n  />\n</div>");

class PowerSelectInput extends Component {
  didSetup = false;
  handleKeydown(e) {
    if (this.args.onKeydown(e) === false) {
      return false;
    }
    if (e.keyCode === 13) {
      this.args.select.actions.close(e);
    }
  }
  static {
    n(this.prototype, "handleKeydown", [action]);
  }
  handleInput(event) {
    const e = event;
    if (this.args.onInput(e) === false) {
      return false;
    }
  }
  static {
    n(this.prototype, "handleInput", [action]);
  }
  handleBlur(event) {
    if (this.args.searchFieldPosition === 'trigger') {
      this.args.select.actions?.search('');
    }
    this.args.onBlur(event);
  }
  static {
    n(this.prototype, "handleBlur", [action]);
  }
  setupInput = modifier(el => {
    if (this.didSetup) {
      return;
    }
    this.didSetup = true;
    this._focusInput(el);
    return () => {
      this.args.select.actions?.search('');
    };
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  {
    eager: false
  });
  _focusInput(el) {
    runTask(this, () => {
      if (this.args.autofocus !== false) {
        el.focus();
      }
    }, 0);
  }
}
setComponentTemplate(TEMPLATE, PowerSelectInput);

export { PowerSelectInput as default };
//# sourceMappingURL=input.js.map
