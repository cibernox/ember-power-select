import PowerSelectTriggerComponent from '#src/components/power-select/trigger.gts';
import type { Country, SelectedCountryExtra } from '../utils/constants';
import emberPowerSelectIsArray from '#src/helpers/ember-power-select-is-array.ts';

export default class SelectedCountry<
  T extends boolean = false,
> extends PowerSelectTriggerComponent<Country, SelectedCountryExtra, T> {
  <template>
    {{#if (emberPowerSelectIsArray @select.selected)}}
      {{#each @select.selected as |option|}}
        <img
          src={{option.flagUrl}}
          class="icon-flag {{if @extra.coolFlagIcon 'cool-flag-icon'}}"
          alt="Flag of {{option.name}}"
        />
        {{option.name}}
      {{/each}}
    {{else}}
      <img
        src={{@select.selected.flagUrl}}
        class="icon-flag {{if @extra.coolFlagIcon 'cool-flag-icon'}}"
        alt="Flag of {{@select.selected.name}}"
      />
      {{@select.selected.name}}
    {{/if}}
  </template>
}
