import Controller from '@ember/controller';
import { action } from '@ember/object';
import { lte } from '@ember/object/computed';
import { later } from '@ember/runloop';
const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export default class extends Controller {
  numbers = numbers
  counter = 8
  @lte('counter', 0) destroyed

  @action
  startSelfDestroyCountdown() {
    let tick = () => {
      this.decrementProperty('counter');
      if (!this.destroyed) { later(tick, 1000); }
    };
    this.set('countdown', later(tick, 1000));
  }
}
