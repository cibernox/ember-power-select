import Component from '@glimmer/component';
import { action } from '@ember/object';
import { lte } from '@ember/object/computed';
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
  @lte('counter', 0) destroyed;

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
