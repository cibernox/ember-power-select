import Controller from '@ember/controller';
import { action } from '@ember/object';
import { A } from '@ember/array';

export default class extends Controller {
  cities = ['Barcelona', 'London', 'New York', 'Porto']
  selectedCities = A()

  @action
  handleKeydown(dropdown, e) {
    if (e.keyCode !== 13) { return; }
    let text = e.target.value;
    if (text.length > 0 && this.cities.indexOf(text) === -1) {
      this.set('selectedCities', this.selectedCities.concat([text]));
    }
  }
}
