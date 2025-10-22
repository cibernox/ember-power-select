import { buildTask } from 'ember-concurrency/async-arrow-runtime';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { deprecate } from '@ember/debug';
import { timeout } from 'ember-concurrency';
import { precompileTemplate } from '@ember/template-compilation';
import { n } from 'decorator-transforms/runtime';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{#if\n  (and\n    @searchEnabled\n    (or\n      (eq @searchFieldPosition \"before-options\")\n      (eq @searchFieldPosition undefined)\n    )\n  )\n}}\n  <div class=\"ember-power-select-search\">\n    {{! template-lint-disable require-input-label }}\n    <input\n      type=\"search\"\n      autocomplete=\"off\"\n      autocorrect=\"off\"\n      autocapitalize=\"off\"\n      spellcheck={{false}}\n      class=\"ember-power-select-search-input\"\n      value={{@select.searchText}}\n      role={{or @role \"combobox\"}}\n      aria-activedescendant={{@ariaActiveDescendant}}\n      aria-controls={{@listboxId}}\n      aria-owns={{@listboxId}}\n      aria-autocomplete=\"list\"\n      aria-haspopup=\"listbox\"\n      aria-expanded={{if @select.isOpen \"true\" \"false\"}}\n      placeholder={{@searchPlaceholder}}\n      aria-label={{@ariaLabel}}\n      aria-labelledby={{@ariaLabelledBy}}\n      aria-describedby={{@ariaDescribedBy}}\n      {{on \"input\" this.handleInput}}\n      {{on \"focus\" @onFocus}}\n      {{on \"blur\" @onBlur}}\n      {{on \"keydown\" this.handleKeydown}}\n      {{this.setupInput}}\n    />\n  </div>\n{{/if}}");

class PowerSelectBeforeOptionsComponent extends Component {
  didSetup = false;
  clearSearch() {
    deprecate('You are using power-select before-option component with ember/render-modifier. Replace {{will-destroy this.clearSearch}} with {{this.setupInput}}.', false, {
      for: 'ember-power-select',
      id: 'ember-power-select.no-at-ember-render-modifiers',
      since: {
        enabled: '8.1',
        available: '8.1'
      },
      until: '9.0.0'
    });
    this.args.select.actions?.search('');
  }
  static {
    n(this.prototype, "clearSearch", [action]);
  }
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
  focusInput(el) {
    deprecate('You are using power-select before-option component with ember/render-modifier. Replace {{did-insert this.focusInput}} with {{this.setupInput}}.', false, {
      for: 'ember-power-select',
      id: 'ember-power-select.no-at-ember-render-modifiers',
      since: {
        enabled: '8.1',
        available: '8.1'
      },
      until: '9.0.0'
    });
    this._focusInput(el);
  }
  static {
    n(this.prototype, "focusInput", [action]);
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
setComponentTemplate(TEMPLATE, PowerSelectBeforeOptionsComponent);

export { PowerSelectBeforeOptionsComponent as default };
//# sourceMappingURL=before-options.js.map
