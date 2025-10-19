import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

interface Person {
  name: string;
  surname: string;
}

export default class extends Component {
  @tracked selectedPerson: Person | undefined;
  people: Person[] = [
    { name: 'María', surname: 'Murray' },
    { name: 'Søren', surname: 'Williams' },
    { name: 'João', surname: 'Jin' },
    { name: 'Miguel', surname: 'Camba' },
    { name: 'Marta', surname: 'Stinson' },
    { name: 'Lisa', surname: 'Simpson' },
  ];

  myMatcher(person: Person, term: string) {
    return `${person.name} ${person.surname}`.indexOf(term);
  }

  <template>
    <PowerSelect
      @searchEnabled={{true}}
      @options={{this.people}}
      @matcher={{this.myMatcher}}
      @selected={{this.selectedPerson}}
      @labelText="Person"
      @onChange={{fn (mut this.selectedPerson)}}
      as |person|
    >
      {{person.name}}
      {{person.surname}}
    </PowerSelect>
  </template>
}
