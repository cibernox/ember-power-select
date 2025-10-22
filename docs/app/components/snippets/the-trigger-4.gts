import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

const placeholderComponent = <template>
  <strong>Fill</strong>
  <em>this</em>
  <small>select</small>
  and
  <span class="text-pink">praise</span>
  <img src="/grumpy-cat.png" alt="grumpy-cat" width="24" height="24" />
</template>;

export default class extends Component {
  @tracked name: string | undefined;

  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];

  <template>
    <PowerSelect
      @options={{this.names}}
      @selected={{this.name}}
      @placeholderComponent={{placeholderComponent}}
      @labelText="Name"
      @onChange={{fn (mut this.name)}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
