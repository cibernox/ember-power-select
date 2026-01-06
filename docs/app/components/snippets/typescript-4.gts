import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import PowerSelect from 'ember-power-select/components/power-select';
import type { TOC } from '@ember/component/template-only';
import type {
  PowerSelectSelectedItemSignature,
  Select,
  Selected,
} from 'ember-power-select/types';

interface Country {
  name: string;
  flagUrl: string;
  population: number;
}

type TExtra = {
  customStringProperty: string;
  customBooleanProperty: boolean;
};

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
  The custom component:<br />
  <img
    src={{@select.selected.flagUrl}}
    class="icon-flag"
    alt="Flag of {{@select.selected.name}}"
  />
  {{@select.selected.name}}
  <br />
  I'm a custom string property (@extra.customStringProperty):
  {{@extra.customStringProperty}}
  <br />
  I'm a custom bool property (@extra.customBooleanProperty):
  {{@extra.customBooleanProperty}}
</template> satisfies TOC<PowerSelectSelectedItemSignature<Country, TExtra>>;

export default class extends Component {
  @tracked country: Country | undefined = countries[2];

  countries = countries;
  api: Select<Country> | undefined;

  extra: TExtra = {
    customStringProperty: 'test',
    customBooleanProperty: true,
  };

  registerPublicAPI = (select: Select<Country>) => {
    this.api = select;
  };

  onChange = (
    selection: Selected<Country>,
    select: Select<Country>,
    event?: Event
  ) => {
    this.country = selection;

    console.log(select);
    console.log(event);
  };

  customMatcher(country: Country | undefined, term: string) {
    return `${country?.name}${country?.population}`.indexOf(term);
  }

  <template>
    <PowerSelect
      @searchEnabled={{true}}
      @options={{this.countries}}
      @selected={{this.country}}
      @selectedItemComponent={{selectedItemCountry}}
      @extra={{this.extra}}
      @matcher={{this.customMatcher}}
      @registerAPI={{this.registerPublicAPI}}
      @searchField="name"
      @labelText="Country"
      @onChange={{this.onChange}}
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
