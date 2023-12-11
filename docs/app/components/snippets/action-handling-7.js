import Component from '@glimmer/component';
import { action } from '@ember/object';

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

  @action
  verifyPresence(/*select, e */) {
    if (this.mandatoryNumber) {
      this.selectClass = null;
    } else {
      this.selectClass = 'has-error';
      return false;
    }
  }
}
