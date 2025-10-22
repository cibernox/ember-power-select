import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { htmlSafe } from '@ember/template';

export default class extends Component {
  @tracked selectedPersonName: string | undefined;

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

  highlightSubstr(text: string, termToHighlight: string) {
    return htmlSafe(
      text.replace(new RegExp(termToHighlight, 'i'), '<b>$&</b>'),
    ); // Warning. This is not XSS safe!
  }

  <template>
    <PowerSelect
      @searchEnabled={{true}}
      @options={{this.names}}
      @selected={{this.selectedPersonName}}
      @labelText="Name"
      @onChange={{fn (mut this.selectedPersonName)}}
      as |name select|
    >
      {{this.highlightSubstr name select.lastSearchedText}}
    </PowerSelect>
  </template>
}
