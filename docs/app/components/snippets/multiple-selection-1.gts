import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

export default class extends Component {
  @tracked name: string[] | undefined;

  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];

  <template>
    <PowerSelect
      @multiple={{true}}
      @searchEnabled={{true}}
      @options={{this.names}}
      @selected={{this.name}}
      @labelText="Name"
      @placeholder="Select some names..."
      @onChange={{fn (mut this.name)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
