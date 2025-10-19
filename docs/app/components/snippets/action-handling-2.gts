import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { tracked } from '@glimmer/tracking';
import PowerSelect from 'ember-power-select/components/power-select';

export default class extends Component {
  cities: string[] = [
    'Barcelona',
    'London',
    'New York',
    'Porto',
    'Coruña',
    'Kracow',
    'Siena',
    'Portland',
    'Springfield',
    'Tokio',
  ];

  @tracked destination: string = 'London';

  <template>
    <PowerSelect
      @selected={{this.destination}}
      @options={{this.cities}}
      @onChange={{fn (mut this.destination)}}
      @labelText="Country"
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
