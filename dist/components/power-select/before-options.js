import { buildTask } from 'ember-concurrency/async-arrow-runtime';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { modifier } from 'ember-modifier';
import { deprecate } from '@ember/debug';
import { timeout } from 'ember-concurrency';
import { on } from '@ember/modifier';
import { eq, or, and } from 'ember-truth-helpers';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';
import { n } from 'decorator-transforms/runtime';

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
  static {
    setComponentTemplate(precompileTemplate("\n    {{#if (and @searchEnabled (or (eq @searchFieldPosition \"before-options\") (eq @searchFieldPosition undefined)))}}\n      <div class=\"ember-power-select-search\">\n        {{!-- template-lint-disable require-input-label --}}\n        <input type=\"search\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck={{false}} class=\"ember-power-select-search-input\" value={{@select.searchText}} role={{or @role \"combobox\"}} aria-activedescendant={{@ariaActiveDescendant}} aria-controls={{@listboxId}} aria-owns={{@listboxId}} aria-autocomplete=\"list\" aria-haspopup=\"listbox\" aria-expanded={{if @select.isOpen \"true\" \"false\"}} placeholder={{@searchPlaceholder}} aria-label={{@ariaLabel}} aria-labelledby={{@ariaLabelledBy}} aria-describedby={{@ariaDescribedBy}} {{on \"input\" this.handleInput}} {{on \"focus\" @onFocus}} {{on \"blur\" @onBlur}} {{on \"keydown\" this.handleKeydown}} {{this.setupInput}} />\n      </div>\n    {{/if}}\n  ", {
      strictMode: true,
      scope: () => ({
        and,
        or,
        eq,
        on
      })
    }), this);
  }
}

export { PowerSelectBeforeOptionsComponent as default };
//# sourceMappingURL=before-options.js.map
