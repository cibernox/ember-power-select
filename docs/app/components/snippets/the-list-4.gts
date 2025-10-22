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
      @selected={{this.selected}}
      @labelText="Name"
      @onChange={{fn (mut this.selected)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
