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
  ],
  people: [
    { name: 'María',  surname: 'Murray' },
    { name: 'Søren',  surname: 'Williams' },
    { name: 'João',   surname: 'Jin' },
    { name: 'Miguel', surname: 'Camba' },
    { name: 'Marta',  surname: 'Stinson' },
    { name: 'Lisa',   surname: 'Simpson' },
  ],

  myMatcher(person, term) {
    return term === '' || person.name.indexOf(term) > -1 || person.surname.indexOf(term) > -1;
  }
});