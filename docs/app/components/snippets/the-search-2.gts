import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

export default class extends Component {
  @tracked fellow: string | undefined;

  diacritics = ['María', 'Søren Larsen', 'João', 'Saša Jurić', 'Íñigo'];

  <template>
    {{! template-lint-disable no-inline-styles require-input-label }}
    <input
      type="text"
      placeholder="Focus me and press TAB to focus the select"
      style="line-height: 2; width: 100%"
    />
    <br />
    <br />
    <PowerSelect
      @searchEnabled={{true}}
      @options={{this.diacritics}}
      @selected={{this.fellow}}
      @labelText="Name"
      @onChange={{fn (mut this.fellow)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
