import PowerSelectBeforeOptions from '#src/components/power-select/before-options.gts';
import type { SelectedCountryExtra } from '../utils/constants';
import { on } from '@ember/modifier';

export default class CustomBeforeOptionsTwo<T> extends PowerSelectBeforeOptions<
  T,
  SelectedCountryExtra
> {
  <template>
    {{#if @extra.passedAction}}
      <button
        class="custom-before-options2-button"
        type="button"
        {{on "click" @extra.passedAction}}
      >Do something</button>
    {{/if}}
  </template>
}
