import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import PowerSelect from 'ember-power-select/components/power-select';
import emberPowerSelectIsArray from 'ember-power-select/helpers/ember-power-select-is-array';
import { fn } from '@ember/helper';
import type { TOC } from '@ember/component/template-only';
import type { PowerSelectSelectedItemSignature } from 'ember-power-select/types';

interface Country {
  name: string;
  flagUrl: string;
  population: number;
}

const countries: Country[] = [
  { name: 'United States', flagUrl: '/flags/us.svg', population: 321853000 },
  { name: 'Spain', flagUrl: '/flags/es.svg', population: 46439864 },
  { name: 'Portugal', flagUrl: '/flags/pt.svg', population: 10374822 },
  { name: 'Russia', flagUrl: '/flags/ru.svg', population: 146588880 },
  { name: 'Latvia', flagUrl: '/flags/lv.svg', population: 1978300 },
  { name: 'Brazil', flagUrl: '/flags/br.svg', population: 204921000 },
  { name: 'United Kingdom', flagUrl: '/flags/gb.svg', population: 64596752 },
];

const selectedItemCountry = <template>
  {{#if (emberPowerSelectIsArray @select.selected)}}
    {{#each @select.selected as |option|}}
      <img
        src={{option.flagUrl}}
        class="icon-flag"
        alt="Flag of {{option.name}}"
      />
      {{option.name}}
    {{/each}}
  {{else}}
    <img
      src={{@select.selected.flagUrl}}
      class="icon-flag"
      alt="Flag of {{@select.selected.name}}"
    />
    {{@select.selected.name}}
  {{/if}}
</template> satisfies TOC<PowerSelectSelectedItemSignature<Country>>;

export default class extends Component {
  @tracked country: Country | undefined;

  countries = countries;
  destination = countries[2];

  <template>
    <PowerSelect
      @searchEnabled={{true}}
      @options={{this.countries}}
      @selected={{this.country}}
      @selectedItemComponent={{selectedItemCountry}}
      @searchField="name"
      @labelText="Country"
      @onChange={{fn (mut this.country)}}
      as |country|
    >
      <div class="country-detailed-info">
        <img
          src={{country.flagUrl}}
          class="country-flag"
          alt="Flag of {{country.name}}"
        />
        <div class="country-data-text">
          <strong>{{country.name}}</strong>
          <br />
          <small>Population in 2014: <i>{{country.population}}</i></small>
        </div>
      </div>
    </PowerSelect>
  </template>
}
