import Component from '@glimmer/component';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import PowerSelect from 'ember-power-select/components/power-select';
import { fn } from '@ember/helper';

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
  @tracked counter = 8;
  @tracked number: number | undefined;
  @tracked countdown: boolean = false;

  numbers = numbers;

  get destroyed() {
    return this.counter <= 0;
  }

  @action
  startSelfDestroyCountdown() {
    void this.countdownLaterTask.perform();
  }

  tick = async () => {
    this.counter--;
    if (!this.destroyed) {
      await this.countdownLaterTask.perform();
    }
  };

  countdownLaterTask = task(async () => {
    this.countdown = true;
    await timeout(1000);
    await this.tick();
  });

  <template>
    {{#if this.destroyed}}
      The bomb has exploded! Reload to try again :)
    {{else}}
      <PowerSelect
        @selected={{this.number}}
        @options={{this.numbers}}
        @onChange={{fn (mut this.number)}}
        @onOpen={{this.startSelfDestroyCountdown}}
        @labelText="Country"
        @placeholder="Once opened this component will destroy itself in 8 seconds"
        as |number|
      >
        {{number}}
      </PowerSelect>
      {{#if this.countdown}}
        <p>This component will be destroyed in {{this.counter}} seconds</p>
      {{/if}}
    {{/if}}
    <p>Selected number: {{this.number}}</p>
  </template>
}
