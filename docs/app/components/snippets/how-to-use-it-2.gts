import Component from '@glimmer/component';
import { action } from '@ember/object';
import PowerSelect from 'ember-power-select/components/power-select';

const countries = [
  { name: 'United States', flagUrl: '/flags/us.svg' },
  { name: 'Spain', flagUrl: '/flags/es.svg' },
  { name: 'Portugal', flagUrl: '/flags/pt.svg' },
  { name: 'Russia', flagUrl: '/flags/ru.svg' },
  { name: 'Latvia', flagUrl: '/flags/lv.svg' },
  { name: 'Brazil', flagUrl: '/flags/br.svg' },
  { name: 'United Kingdom', flagUrl: '/flags/gb.svg' },
];

export default class extends Component {
  countries = countries;
  destination = countries[2];

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
