import Controller from '@ember/controller';
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
  'twenty'
];

export default Controller.extend({
  numbers,
  selectedList: [],
  asyncSelectedList: [],
  optionz: [],
  // Actions
  actions: {
    searchAsync(term) {
      return new RSVP.Promise(function(resolve) {
        later(function() {
          resolve(numbers.filter((n) => n.indexOf(term) > -1));
        }, 100);
      });
    },

    onOpenHandle() {
      later(() => {
        this.set('optionz', numbers);
      }, 100);
    },

    onChangeAsync(key, selected) {
      later(() => {
        this.set(key, selected);
      }, 100);
    }
  }
});
