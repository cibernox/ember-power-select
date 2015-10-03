import Ember from 'ember';

export default Ember.Controller.extend({
  cities: ['Barcelona', 'London', 'New York', 'Porto'],
  destination: 'London',

  actions: {
    chooseDestination(city) {
      this.set('destination', city);
    }
  }
});