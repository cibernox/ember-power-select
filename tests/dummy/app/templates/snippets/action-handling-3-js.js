import Controller from '@ember/controller';
import { A } from '@ember/array';
export default Controller.extend({
  cities: ['Barcelona', 'London', 'New York', 'Porto'],
  selectedCities: A(),
  actions: {
    handleKeydown(dropdown, e) {
      if (e.keyCode !== 13) { return; }
      let text = e.target.value;
      if (text.length > 0 && this.get('cities').indexOf(text) === -1) {
        let cities = this.get('selectedCities');
        this.set('selectedCities', cities.concat([text]));
      }
    }
  }
});
