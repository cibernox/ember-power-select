import templateOnly from '@ember/component/template-only';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{#if @noMatchesMessage}}\n  <ul class=\"ember-power-select-options\" role=\"listbox\" ...attributes>\n    <li\n      class=\"ember-power-select-option ember-power-select-option--no-matches-message\"\n      role=\"option\"\n      aria-selected={{false}}\n    >\n      {{@noMatchesMessage}}\n    </li>\n  </ul>\n{{/if}}");

var noMatchesMessage = setComponentTemplate(TEMPLATE, templateOnly());

export { noMatchesMessage as default };
//# sourceMappingURL=no-matches-message.js.map
