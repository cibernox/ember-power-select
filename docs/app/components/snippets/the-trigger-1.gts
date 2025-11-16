import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

export default class extends Component {
  @tracked name: string | undefined = 'Pluto';

  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];
  destination = this.names[2];

  <template>
    <PowerSelect
      @options={{this.names}}
      @disabled={{true}}
      @selected={{this.name}}
      @labelText="Name"
      @onChange={{fn (mut this.name)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
