import Component from '@glimmer/component';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

class PowerSelectPlaceholder extends Component {
  static {
    setComponentTemplate(precompileTemplate("\n    {{#if @isMultipleWithSearch}}\n      {{#let @inputComponent as |InputComponent|}}\n        <InputComponent @isDefaultPlaceholder={{true}} @select={{@select}} />\n      {{/let}}\n    {{else if @placeholder}}\n      <span class=\"ember-power-select-placeholder\" ...attributes>{{@placeholder}}</span>\n    {{/if}}\n  ", {
      strictMode: true
    }), this);
  }
}

export { PowerSelectPlaceholder as default };
//# sourceMappingURL=placeholder.js.map
