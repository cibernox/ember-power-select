import type { PowerSelectBeforeOptionsSignature } from '#src/components/power-select/before-options.gts';
import type { Country, SelectedCountryExtra } from '../utils/constants';
import and from 'ember-truth-helpers/helpers/and';
import eq from 'ember-truth-helpers/helpers/eq';
import type { TemplateOnlyComponent } from '@ember/component/template-only';

export type CustomMultipleBeforeOptionsSignature =
  PowerSelectBeforeOptionsSignature<Country, SelectedCountryExtra, true>;

export default <template>
  <p id="custom-before-options-p-tag">
    {{@placeholder}}
  </p>

  {{#if (and @searchEnabled (eq @searchFieldPosition "before-options"))}}
    <div id="custom-before-options-search-field">
      {{! template-lint-disable require-input-label }}
      <input type="search" value />
    </div>
  {{/if}}

  {{#if @placeholderComponent}}
    <@placeholderComponent @placeholder={{@placeholder}} @select={{@select}} />
  {{/if}}
</template> satisfies TemplateOnlyComponent<CustomMultipleBeforeOptionsSignature>;
