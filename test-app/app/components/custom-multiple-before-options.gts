import type { PowerSelectBeforeOptionsSignature } from 'ember-power-select/components/power-select/before-options';
import type { Country, SelectedCountryExtra } from 'test-app/utils/constants';
import and from "ember-truth-helpers/helpers/and";
import eq from "ember-truth-helpers/helpers/eq";
import ensureSafeComponent from "@embroider/util/_app_/helpers/ensure-safe-component.js";import type { TemplateOnlyComponent } from '@ember/component/template-only';

export type CustomMultipleBeforeOptionsSignature =
  PowerSelectBeforeOptionsSignature<Country, SelectedCountryExtra, true>;

export default <template><p id="custom-before-options-p-tag">
  {{@placeholder}}
</p>

{{#if (and @searchEnabled (eq @searchFieldPosition "before-options"))}}
  <div id="custom-before-options-search-field">
    <input type="search" value />
  </div>
{{/if}}

{{#if @placeholderComponent}}
  {{#let (component (ensureSafeComponent @placeholderComponent)) as |ComponentName|}}
    <ComponentName @placeholder={{@placeholder}} @select={{@select}} />
  {{/let}}
{{/if}}</template> satisfies TemplateOnlyComponent<CustomMultipleBeforeOptionsSignature>;
