import Ember from 'ember';

const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export default Ember.Controller.extend({
  numbers,
  counter: 8,
  destroyed: Ember.computed.lte('counter', 0),
  startSelfDestroyCountdown() {
    let tick = () => {
      this.decrementProperty('counter');
      if (!this.get('destroyed')) { Ember.run.later(tick, 1000); }
    };
    this.set('countdown', Ember.run.later(tick, 1000));
  }
});