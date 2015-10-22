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

const countries = [
  { name: 'United States',  code: 'US', population: 321853000 },
  { name: 'Spain',          code: 'ES', population: 46439864 },
  { name: 'Portugal',       code: 'PT', population: 10374822 },
  { name: 'Russia',         code: 'RU', population: 146588880 },
  { name: 'Latvia',         code: 'LV', population: 1978300 },
  { name: 'Brazil',         code: 'BR', population: 204921000 },
  { name: 'United Kingdom', code: 'GB', population: 64596752 },
];

const contriesWithDisabled = [
  { name: 'United States',  code: 'US', population: 321853000 },
  { name: 'Spain',          code: 'ES', population: 46439864 },
  { name: 'Portugal',       code: 'PT', population: 10374822, disabled: true },
  { name: 'Russia',         code: 'RU', population: 146588880, disabled: true },
  { name: 'Latvia',         code: 'LV', population: 1978300 },
  { name: 'Brazil',         code: 'BR', population: 204921000, disabled: true },
  { name: 'United Kingdom', code: 'GB', population: 64596752 },
];

const names = [
  "María",
  "Søren Larsen",
  "João",
  "Miguel",
  "Marta",
  "Lisa"
];

export default Ember.Controller.extend({
  names: names,
  simpleOptions: numbers,
  simpleSelected: 'six',

  complexOptions: countries,
  complexSelected: countries[1],

  prefilledSelection: 'seven',

  complexOptionsWithDisabled: contriesWithDisabled,

  multipleSelection: ['one','two','three','four','five','six','seven','eight','nine','ten','eleven'],

  groupedOptions: [
    { groupName: "Smalls", options: ["one", "two", "three"] },
    { groupName: "Mediums", options: ["four", "five", "six"] },
    { groupName: "Bigs", options: [
        { groupName: "Fairly big", options: ["seven", "eight", "nine"] },
        { groupName: "Really big", options: [ "ten", "eleven", "twelve" ] },
        "thirteen"
      ]
    },
    "one hundred",
    "one thousand"
  ],

  actions: {
    debugSelection(option) {
      console.debug("I've selected", option);
    },

    search(term) {
      var length = term.length;
      return numbers.filter(str => str.length === length); // returns the numbers with the same length than the current
    },

    asyncSearch(term) {
      return new Ember.RSVP.Promise(function(resolve) {
        Ember.run.later(function() {
          var length = term.length;
          resolve(numbers.filter(str => str.length === length)); // returns the numbers with the same length than the current
        }, 1500);
      });
    }
  },

  promiseOptions: Ember.computed(function() {
    return new Ember.RSVP.Promise(function(resolve) {
      setTimeout(function() {
        console.debug('PromiseOptions resolved!');
        resolve(numbers);
      }, 5000);
    });
  }),

  endsWithMatcher(value, text) {
    return text === '' || value.slice(text.length * -1) === text;
  }
});
