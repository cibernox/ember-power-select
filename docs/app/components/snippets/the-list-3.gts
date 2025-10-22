import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

export default class extends Component {
  @tracked name: string | undefined;

  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];

  <template>
    <PowerSelect
      @options={{this.names}}
      @verticalPosition="above"
      @selected={{this.name}}
      @labelText="Name"
      @onChange={{fn (mut this.name)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
    (This list of options will always be on top regardless of how much available
    space there is around)
  </template>
}
