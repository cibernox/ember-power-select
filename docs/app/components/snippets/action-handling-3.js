import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  cities = [
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
  @tracked selectedCities = [];

  @action
  handleKeydown(_dropdown, e) {
    if (e.keyCode !== 13) {
      return;
    }
    let text = e.target.value;
    if (text.length > 0 && this.cities.indexOf(text) === -1) {
      this.selectedCities = this.selectedCities.concat([text]);
    }
  }
}
