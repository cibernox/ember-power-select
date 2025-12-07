import Component from '@glimmer/component';
import { action } from '@ember/object';
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

  @tracked destination: string | undefined = 'London';

  @action
  chooseDestination(city: string | undefined) {
    this.destination = city;
  }

  <template>
    <PowerSelect
      @selected={{this.destination}}
      @options={{this.cities}}
      @onChange={{this.chooseDestination}}
      @labelText="Country"
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
