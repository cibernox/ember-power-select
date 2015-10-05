import Ember from 'ember';

export default Ember.Controller.extend({
  names: ['Stefan', 'Miguel', 'Tomster', 'Pluto'],
  diacritics: [
    "María",
    "Søren Larsen",
    "João",
    "Saša Jurić",
    "Íñigo"
  ],
  countries: [
    { name: 'United States' },
    { name: 'Spain', },
    { name: 'Portugal' },
    { name: 'Russia' },
    { name: 'Latvia' },
    { name: 'Brazil' },
    { name: 'United Kingdom' },
  ]
});