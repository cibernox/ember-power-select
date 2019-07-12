import Controller from '@ember/controller';
import { action } from '@ember/object';
export default class extends Controller {
  cities = ['Barcelona', 'London', 'New York', 'Porto']
  destination = 'London'

  @action
  chooseDestination(city) {
    this.set('destination', city);
  }
}
