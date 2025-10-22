import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';

export default class extends Component {
  @tracked name: string | undefined;

  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];

  stopPropagation(e: Event) {
    e.stopPropagation();
  }

  removeName(name: string) {
    alert(`remove name: ${name}`);
  }

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
      <a
        href="#"
        {{on "mouseup" this.stopPropagation}}
        {{on "click" (fn this.removeName name)}}
      >&times;</a>
    </PowerSelect>
  </template>
}
