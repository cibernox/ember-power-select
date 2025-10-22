import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import PowerSelect from 'ember-power-select/components/power-select';

const countries = [
  { id: 1, name: 'United States', flagUrl: '/flags/us.svg' },
  { id: 2, name: 'Spain', flagUrl: '/flags/es.svg' },
  { id: 3, name: 'Portugal', flagUrl: '/flags/pt.svg' },
  { id: 4, name: 'Russia', flagUrl: '/flags/ru.svg' },
  { id: 5, name: 'Latvia', flagUrl: '/flags/lv.svg' },
  { id: 6, name: 'Brazil', flagUrl: '/flags/br.svg' },
  { id: 7, name: 'United Kingdom', flagUrl: '/flags/gb.svg' },
];

export default class extends Component {
  countries = countries;

  @tracked destinationId = 3;

  get destination() {
    const countries = this.countries;
    if (!countries) {
      return null;
    }
    return countries.find((x) => x.id === this.destinationId);
  }

  @action
  foo() {}

  <template>
    <PowerSelect
      @options={{this.countries}}
      @selected={{this.destination}}
      @labelText="Country"
      @onChange={{this.foo}}
      as |country|
    >
      <img
        src={{country.flagUrl}}
        class="icon-flag"
        alt="Flag of {{country.name}}"
      />
      <strong>{{country.name}}</strong>
    </PowerSelect>
  </template>
}
