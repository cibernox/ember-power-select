import Ember from 'ember';

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

export default Ember.Controller.extend({
  numbers,

  // Actions
  actions: {
    searchAsync(term) {
      return new Ember.RSVP.Promise(function(resolve) {
        Ember.run.later(function() {
          resolve(numbers.filter(n => n.indexOf(term) > -1));
        }, 100);
      });
    }
  }
});
