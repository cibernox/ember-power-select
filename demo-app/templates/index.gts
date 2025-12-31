import Component from '@glimmer/component';
import RouteTemplate from 'ember-route-template';
import ShadowRoot from '../components/shadow-root';
import PowerSelect from '#src/components/power-select.gts';
import { fn } from '@ember/helper';

class Index extends Component {
  diacritics = ['María', 'Søren Larsen', 'João', 'Saša Jurić', 'Íñigo'];

  selectedDiacritic: string | undefined = undefined;

  <template>
    <ShadowRoot>
      <h1>Welcome to ember-power-select!</h1>

      <PowerSelect
        @searchEnabled={{true}}
        @options={{this.diacritics}}
        @selected={{this.selectedDiacritic}}
        @labelText="Name"
        @onChange={{fn (mut this.selectedDiacritic)}}
        as |name|
      >
        {{name}}
      </PowerSelect>

      {{outlet}}
    </ShadowRoot>
  </template>
}

export default RouteTemplate(Index);
