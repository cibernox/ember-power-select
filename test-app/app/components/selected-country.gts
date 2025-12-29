import PowerSelectTriggerComponent from 'ember-power-select/components/power-select/trigger';
import type { Country, SelectedCountryExtra } from 'test-app/utils/constants';
import emberPowerSelectIsArray from 'ember-power-select/helpers/ember-power-select-is-array';

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
