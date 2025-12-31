import type { PowerSelectAfterOptionsSignature } from 'ember-power-select/types';
import type { Country, SelectedCountryExtra } from '../utils/constants';
import { on } from '@ember/modifier';
import type { TemplateOnlyComponent } from '@ember/component/template-only';

export default <template>
  {{#if @extra.passedAction}}
    <button
      class="custom-after-options2-button"
      type="button"
      {{on "click" @extra.passedAction}}
    >Do something</button>
  {{/if}}
</template> satisfies TemplateOnlyComponent<
  PowerSelectAfterOptionsSignature<Country, SelectedCountryExtra>
>;
