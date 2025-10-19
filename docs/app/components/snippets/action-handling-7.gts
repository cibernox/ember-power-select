import Component from '@glimmer/component';
import { action } from '@ember/object';
import PowerSelect from 'ember-power-select/components/power-select';
import { fn } from '@ember/helper';
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
  @tracked mandatoryNumber: string | undefined;
  @tracked selectClass: string = '';

  numbers = numbers;

  @action
  verifyPresence(/*select: Select, e: Event */) {
    if (this.mandatoryNumber) {
      this.selectClass = '';
    } else {
      this.selectClass = 'has-error';
      return false;
    }
  }

  <template>
    <PowerSelect
      @selected={{this.mandatoryNumber}}
      @options={{this.numbers}}
      @dropdownClass={{this.selectClass}}
      @onChange={{fn (mut this.mandatoryNumber)}}
      @onClose={{this.verifyPresence}}
      @labelText="Country"
      @placeholder="I really NEED this info"
      as |number|
    >
      {{number}}
    </PowerSelect>
  </template>
}
