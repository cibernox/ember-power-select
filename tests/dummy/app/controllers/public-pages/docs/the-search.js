import Controller from '@ember/controller';

export default class TheSearch extends Controller {
  names = [
    'Stefan',
    'Miguel',
    'Tomster',
    'Pluto',
    'Robert',
    'Alex',
    'Lauren',
    'Geoffrey',
    'Ricardo',
    'Jamie',
  ];

  diacritics = ['María', 'Søren Larsen', 'João', 'Saša Jurić', 'Íñigo'];

  countries = [
    { name: 'United States' },
    { name: 'Spain' },
    { name: 'Portugal' },
    { name: 'Russia' },
    { name: 'Latvia' },
    { name: 'Brazil' },
    { name: 'United Kingdom' },
  ];

  people = [
    { name: 'María', surname: 'Murray' },
    { name: 'Søren', surname: 'Williams' },
    { name: 'João', surname: 'Jin' },
    { name: 'Miguel', surname: 'Camba' },
    { name: 'Marta', surname: 'Stinson' },
    { name: 'Lisa', surname: 'Simpson' },
  ];

  myMatcher(person, term) {
    return `${person.name} ${person.surname}`.indexOf(term);
  }
}
