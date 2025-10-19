import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import PowerSelectBeforeOptions from 'ember-power-select/components/power-select/before-options';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

interface Country {
  name: string;
}

export default class extends Component {
  @tracked selected: Country | undefined;

  countries: Country[] = [
    { name: 'United States' },
    { name: 'Spain' },
    { name: 'Portugal' },
    { name: 'Russia' },
    { name: 'Latvia' },
    { name: 'Brazil' },
    { name: 'United Kingdom' },
  ];

  <template>
    <PowerSelect
      @searchEnabled={{true}}
      @options={{this.countries}}
      @searchField="name"
      @selected={{this.selected}}
      @onChange={{fn (mut this.selected)}}
      @labelText="Country"
      @beforeOptionsComponent={{component
        PowerSelectBeforeOptions
        autofocus=false
      }}
      as |country|
    >
      {{country.name}}
    </PowerSelect>
  </template>
}
