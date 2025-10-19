import Component from '@glimmer/component';
import { action } from '@ember/object';
import PowerSelect from 'ember-power-select/components/power-select';

export default class extends Component {
  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];

  @action
  foo() {}

  <template>
    <PowerSelect
      @options={{this.names}}
      @onChange={{this.foo}}
      @labelText="Names"
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
