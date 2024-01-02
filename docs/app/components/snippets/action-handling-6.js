import Component from '@glimmer/component';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';

const numbers = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
];

export default class extends Component {
  numbers = numbers;
  @tracked counter = 8;

  get destroyed() {
    return this.counter <= 0;
  }

  @action
  startSelfDestroyCountdown() {
    let tick = () => {
      this.counter--;
      if (!this.destroyed) {
        later(tick, 1000);
      }
    };
    this.countdown = later(tick, 1000);
  }
}
