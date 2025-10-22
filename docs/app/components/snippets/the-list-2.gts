import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { fn } from '@ember/helper';
import { tracked } from '@glimmer/tracking';

export default class extends Component {
  @tracked name: string | undefined;

  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];

  <template>
    <PowerSelect
      @options={{this.names}}
      @renderInPlace={{true}}
      @selected={{this.name}}
      @labelText="Name"
      @onChange={{fn (mut this.name)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
    (Looks the same but inspect the DOM to see the difference)
  </template>
}
