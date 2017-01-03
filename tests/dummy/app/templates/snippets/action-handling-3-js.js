import Ember from 'ember';
export default Ember.Controller.extend({
  cities: ['Barcelona', 'London', 'New York', 'Porto'],
  selectedCities: Ember.A(),
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