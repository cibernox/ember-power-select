import Controller from '@ember/controller';
import TheSearch1 from '../../../components/snippets/the-search-1';
import TheSearch2 from '../../../components/snippets/the-search-2';
import TheSearch3 from '../../../components/snippets/the-search-3';
import TheSearch4 from '../../../components/snippets/the-search-4';
import TheSearch5 from '../../../components/snippets/the-search-5';
import TheSearch6 from '../../../components/snippets/the-search-6';
import TheSearch7 from '../../../components/snippets/the-search-7';
import TheSearch8 from '../../../components/snippets/the-search-8';
import TheSearch9 from '../../../components/snippets/the-search-9';

export default class TheSearch extends Controller {
  theSearch1 = TheSearch1;
  theSearch2 = TheSearch2;
  theSearch3 = TheSearch3;
  theSearch4 = TheSearch4;
  theSearch5 = TheSearch5;
  theSearch6 = TheSearch6;
  theSearch7 = TheSearch7;
  theSearch8 = TheSearch8;
  theSearch9 = TheSearch9;
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
