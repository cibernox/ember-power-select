import Controller from '@ember/controller';
import { lte } from '@ember/object/computed';
import { later } from '@ember/runloop';
const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export default Controller.extend({
  numbers,
  counter: 8,
  destroyed: lte('counter', 0),
  startSelfDestroyCountdown() {
    let tick = () => {
      this.decrementProperty('counter');
      if (!this.get('destroyed')) { later(tick, 1000); }
    };
    this.set('countdown', later(tick, 1000));
  }
});
