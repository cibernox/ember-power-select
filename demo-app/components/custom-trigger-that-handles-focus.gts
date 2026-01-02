import PowerSelectTriggerComponent from '#src/components/power-select/trigger.gts';
import type { Country, SelectedCountryExtra } from '../utils/constants';
import { on } from '@ember/modifier';

export default class CustomTriggerThatHandlesFocus extends PowerSelectTriggerComponent<
  Country,
  SelectedCountryExtra
> {
  <template>
    {{#if @onFocus}}
      <input type="text" id="focusable-input" {{on "focus" @onFocus}} />
    {{/if}}
  </template>
}
