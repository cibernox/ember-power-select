import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
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
    this.countdownLaterTask.perform();
  }

  tick = () => {
    this.counter--;
    if (!this.destroyed) {
      this.countdownLaterTask.perform();
    }
  };

  countdownLaterTask = task(async () => {
    await timeout(1000);
    this.tick();
  });
}
