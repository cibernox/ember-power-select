import Controller from '@ember/controller';
import RSVP from 'rsvp';

function generatePromise() {
  return new RSVP.Promise((resolve) => {
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
  { name: 'United Kingdom', code: 'GB', population: 64596752 }
];

const groupedNumbers = [
  { groupName: 'Smalls', disabled: true, options: ['one', 'two', 'three'] },
  { groupName: 'Mediums', options: ['four', 'five', 'six'] },
  {
    groupName: 'Bigs',
    disabled: true,
    options: [
      { groupName: 'Fairly big', options: ['seven', 'eight', 'nine'] },
      { groupName: 'Really big', options: ['ten', 'eleven', 'twelve'] },
      'thirteen'
    ]
  },
  'one hundred',
  'one thousand'
];

export default Controller.extend({
  names: ['Stefan', 'Miguel', 'Tomster', 'Pluto'],
  emptyList: [],
  promise: null,
  countries,
  groupedNumbers,

  actions: {
    refreshCollection() {
      this.set('promise', generatePromise());
    },
    stopPropagation(e) {
      e.stopPropagation();
    },
    removeName(name) {
      alert(`remove name: ${name}`);
    }
  }
});
