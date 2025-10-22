import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

export default class extends Component {
  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];
  @tracked name = this.names[3];

  <template>
    <PowerSelect
      @options={{this.names}}
      @selected={{this.name}}
      @allowClear={{true}}
      @labelText="Name"
      @onChange={{fn (mut this.name)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
