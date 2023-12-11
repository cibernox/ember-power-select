import Controller from '@ember/controller';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import RSVP from 'rsvp';
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
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
];

export default class HelpersTesting extends Controller {
  numbers = numbers;
  selectedList = [];
  asyncSelectedList = [];
  optionz = [];

  @action
  searchAsync(term) {
    return new RSVP.Promise(function (resolve) {
      later(function () {
        resolve(numbers.filter((n) => n.indexOf(term) > -1));
      }, 100);
    });
  }

  @action
  onOpenHandle() {
    later(() => {
      this.set('optionz', numbers);
    }, 100);
  }

  @action
  onChangeAsync(key, selected) {
    later(() => {
      this.set(key, selected);
    }, 100);
  }
}
