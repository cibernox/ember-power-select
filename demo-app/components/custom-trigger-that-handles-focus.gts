import PowerSelectTriggerComponent from 'ember-power-select/components/power-select/trigger';
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
