import PowerSelectOptionsComponent from '#src/components/power-select/options.gts';
import type { Country, SelectedCountryExtra } from '../utils/constants';
import { get } from '@ember/helper';

export default class ListOfCountries<
  IsMultiple extends boolean = false,
> extends PowerSelectOptionsComponent<
  Country,
  SelectedCountryExtra,
  IsMultiple
> {
  <template>
    <div class="ember-power-select-options">
      <p>
        Countries:
      </p>
      <ul>
        {{#if @extra.field}}
          {{#each @options as |option index|}}
            <li>
              {{index}}.
              {{get option @extra.field}}
            </li>
          {{/each}}
        {{else}}
          {{#each @options as |option index|}}
            <li>
              {{index}}.
              {{option.name}}
            </li>
          {{/each}}
        {{/if}}
      </ul>
    </div>
  </template>
}
