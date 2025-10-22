import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

export default class extends Component {
  @tracked selected: unknown;

  emptyList = [];

  <template>
    <PowerSelect
      @options={{this.emptyList}}
      @noMatchesMessage="404 bro"
      @selected={{this.selected}}
      @labelText="Matches message"
      @onChange={{fn (mut this.selected)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
