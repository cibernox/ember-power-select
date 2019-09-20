import Controller from '@ember/controller';
import { action } from '@ember/object';

const numbers = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export default class extends Controller {
  numbers = numbers

  @action
  verifyPresence(select /*, e */) {
    if (this.mandatoryNumber) {
      this.set('selectClass', null);
    } else {
      this.set('selectClass', 'has-error');
      return false;
    }
  }
}
