import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { fn } from '@ember/helper';

export default class extends Component {
  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];
  name = this.names[3];

  <template>
    {{! template-lint-disable no-inline-styles }}
    <PowerSelect
      @options={{this.names}}
      @selected={{this.name}}
      @labelText="Name"
      @onChange={{fn (mut this.name)}}
      style="background: pink"
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
