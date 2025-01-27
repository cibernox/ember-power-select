import templateOnly from '@ember/component/template-only';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("<ul class=\"ember-power-select-options\" role=\"listbox\" ...attributes>\n  <li\n    class=\"ember-power-select-option ember-power-select-option--search-message\"\n    role=\"option\"\n    aria-selected={{false}}\n  >\n    {{@searchMessage}}\n  </li>\n</ul>");

var searchMessage = setComponentTemplate(TEMPLATE, templateOnly());

export { searchMessage as default };
//# sourceMappingURL=search-message.js.map
