import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import PowerSelect, { type Select } from 'ember-power-select/components/power-select';
import { fn } from '@ember/helper';

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
  @tracked selectedCities: string[] = [];

  @action
  handleKeydown(_dropdown: Select, e: KeyboardEvent) {
    if (e.keyCode !== 13) {
      return;
    }
    const text = (e.target as HTMLInputElement).value;
    if (text.length > 0 && this.cities.indexOf(text) === -1) {
      this.selectedCities = this.selectedCities.concat([text]);
    }
  }

  <template>
    <PowerSelect
      @multiple={{true}}
      @selected={{this.selectedCities}}
      @options={{this.cities}}
      @onChange={{fn (mut this.selectedCities)}}
      @searchEnabled={{true}}
      @labelText="Country"
      @onKeydown={{this.handleKeydown}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
