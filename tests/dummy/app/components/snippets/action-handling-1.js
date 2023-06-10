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

  @tracked destination = 'London';

  @action
  chooseDestination(city) {
    this.destination = city;
  }
}
