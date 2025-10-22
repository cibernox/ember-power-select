import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

interface Country {
  name: string;
  flagUrl: string;
}

export default class extends Component {
  @tracked selected: Country | undefined;

  countries: Country[] = [
    { name: 'United States', flagUrl: '/flags/us.svg' },
    { name: 'Spain', flagUrl: '/flags/es.svg' },
    { name: 'Portugal', flagUrl: '/flags/pt.svg' },
    { name: 'Russia', flagUrl: '/flags/ru.svg' },
    { name: 'Latvia', flagUrl: '/flags/lv.svg' },
    { name: 'Brazil', flagUrl: '/flags/br.svg' },
    { name: 'United Kingdom', flagUrl: '/flags/gb.svg' },
  ];

  <template>
    <PowerSelect
      @searchEnabled={{true}}
      @options={{this.countries}}
      @placeholder="Please, select one destination"
      @selected={{this.selected}}
      @searchField="name"
      @labelText="Destination"
      @onChange={{fn (mut this.selected)}}
      as |country|
    >
      {{country.name}}
    </PowerSelect>
  </template>
}
