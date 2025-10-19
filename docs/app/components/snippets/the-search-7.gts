import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

export default class extends Component {
  @tracked person: string | undefined;

  diacritics = ['María', 'Søren Larsen', 'João', 'Saša Jurić', 'Íñigo'];

  <template>
    <PowerSelect
      @searchEnabled={{true}}
      @options={{this.diacritics}}
      @searchPlaceholder="Type to name..."
      @selected={{this.person}}
      @labelText="Name"
      @onChange={{fn (mut this.person)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
