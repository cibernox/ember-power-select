import Ember from 'ember';

const countries = [
  { name: 'United States',  flagUrl: '/flags/us.svg' },
  { name: 'Spain',          flagUrl: '/flags/es.svg' },
  { name: 'Portugal',       flagUrl: '/flags/pt.svg' },
  { name: 'Russia',         flagUrl: '/flags/ru.svg' },
  { name: 'Latvia',         flagUrl: '/flags/lv.svg' },
  { name: 'Brazil',         flagUrl: '/flags/br.svg' },
  { name: 'United Kingdom', flagUrl: '/flags/gb.svg' }
];

const cities = ['Barcelona', 'London', 'New York', 'Porto', 'Coruña', 'Kracow', 'Siena', 'Portland', 'Springfield', 'Tokio'];

const groupedNumbers = [
  { groupName: 'Smalls', options: ['one', 'two', 'three'] },
  { groupName: 'Mediums', options: ['four', 'five', 'six'] },
  {
    groupName: 'Bigs',
    options: [
      { groupName: 'Fairly big', options: ['seven', 'eight', 'nine'] },
      { groupName: 'Really big', options: ['ten', 'eleven', 'twelve'] },
      'thirteen'
    ]
  },
  'one hundred',
  'one thousand'
];

export default Ember.Controller.extend({
  cities,
  countries,
  groupedNumbers,
  city: null,
  country: null
});
