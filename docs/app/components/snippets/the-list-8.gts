import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

interface Country {
  name: string;
  code: string;
  disabled?: boolean;
}

export default class extends Component {
  @tracked country: Country | undefined;

  countries: Country[] = [
    { name: 'United States', code: 'US' },
    { name: 'Spain', code: 'ES' },
    { name: 'Portugal', code: 'PT', disabled: true },
    { name: 'Russia', code: 'RU', disabled: true },
    { name: 'Latvia', code: 'LV' },
    { name: 'Brazil', code: 'BR', disabled: true },
    { name: 'United Kingdom', code: 'GB' },
  ];

  <template>
    <PowerSelect
      @searchEnabled={{false}}
      @options={{this.countries}}
      @selected={{this.country}}
      @searchField="name"
      @labelText="Country"
      @onChange={{fn (mut this.country)}}
      as |country|
    >
      {{country.name}}
    </PowerSelect>
  </template>
}
