import Controller from '@ember/controller';
export default Controller.extend({
  cities: ['Barcelona', 'London', 'New York', 'Porto'],
  destination: 'London',

  actions: {
    chooseDestination(city) {
      this.set('destination', city);
      // this.calculateRoute();
      // this.updatePrice();
    }
  }
});
