import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

export default class extends Component {
  @tracked selectedDiacritic: string | undefined;

  diacritics = ['María', 'Søren Larsen', 'João', 'Saša Jurić', 'Íñigo'];

  <template>
    <PowerSelect
      @multiple={{true}}
      @searchEnabled={{true}}
      @searchFieldPosition="before-options"
      @options={{this.diacritics}}
      @selected={{this.selectedDiacritic}}
      @labelText="Name"
      @onChange={{fn (mut this.selectedDiacritic)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
