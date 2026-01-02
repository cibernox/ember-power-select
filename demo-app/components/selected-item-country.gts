import Component from '@glimmer/component';
import type { PowerSelectSelectedItemSignature } from '#src/types.ts';
import type { Country, SelectedCountryExtra } from '../utils/constants';
import emberPowerSelectIsArray from '#src/helpers/ember-power-select-is-array.ts';

type SelectedItemCountrySignature<IsMultiple extends boolean = false> =
  PowerSelectSelectedItemSignature<Country, SelectedCountryExtra, IsMultiple>;

export default class SelectedItemCountry<
  IsMultiple extends boolean = false,
> extends Component<SelectedItemCountrySignature<IsMultiple>> {
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
