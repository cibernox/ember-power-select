import Ember from 'ember';

const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export default Ember.Controller.extend({
  cities: ['Barcelona', 'London', 'New York', 'Porto'],
  destination: 'London',
  selectedCities: [],
  numbers,
  counter: 8,
  destroyed: Ember.computed.lte('counter', 0),

  actions: {
    chooseDestination(city) {
      this.set('destination', city);
    },

    handleKeydown(dropdown, e) {
      if (e.keyCode !== 13) { return; }
      let text = e.target.value;
      if (text.length > 0 && this.get('cities').indexOf(text) === -1) {
        this.get('selectedCities').pushObject(text);
      }
    },

    handleFocus(select) {
      select.actions.open();
    },

    startSelfDestroyCountdown() {
      let tick = () => {
        this.decrementProperty('counter');
        if (!this.get('destroyed')) { Ember.run.later(tick, 1000); }
      };
      this.set('countdown', Ember.run.later(tick, 1000));
    }
  }
});