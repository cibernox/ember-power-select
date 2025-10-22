import templateOnly from '@ember/component/template-only';
import { precompileTemplate } from '@ember/template-compilation';
import { setComponentTemplate } from '@ember/component';

var TEMPLATE = precompileTemplate("{{#if @isMultipleWithSearch}}\n  <@inputComponent @isDefaultPlaceholder={{true}} />\n{{else if @placeholder}}\n  <span\n    class=\"ember-power-select-placeholder\"\n    ...attributes\n  >{{@placeholder}}</span>\n{{/if}}");

var placeholder = setComponentTemplate(TEMPLATE, templateOnly());

export { placeholder as default };
//# sourceMappingURL=placeholder.js.map
