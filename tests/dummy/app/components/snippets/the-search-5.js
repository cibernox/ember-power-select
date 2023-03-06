import Component from '@glimmer/component';

export default class extends Component {
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
