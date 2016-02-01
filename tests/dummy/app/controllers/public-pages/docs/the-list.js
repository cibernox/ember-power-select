import Ember from 'ember';

function generatePromise() {
  return new Ember.RSVP.Promise((resolve) => {
    setTimeout(() => resolve(['one', 'two', 'three']), 5000);
  });
}

const countries = [
  { name: 'United States',  code: 'US', population: 321853000 },
  { name: 'Spain',          code: 'ES', population: 46439864 },
  { name: 'Portugal',       code: 'PT', population: 10374822, disabled: true },
  { name: 'Russia',         code: 'RU', population: 146588880, disabled: true },
  { name: 'Latvia',         code: 'LV', population: 1978300 },
  { name: 'Brazil',         code: 'BR', population: 204921000, disabled: true },
  { name: 'United Kingdom', code: 'GB', population: 64596752 },
];

export default Ember.Controller.extend({
  names: ['Stefan', 'Miguel', 'Tomster', 'Pluto'],
  emptyList: [],
  promise: null,
  countries,

  actions: {
    refreshCollection() {
      this.set('promise', generatePromise());
    }
  }
});