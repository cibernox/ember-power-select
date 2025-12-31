import Component from '@glimmer/component';
import RouteTemplate from 'ember-route-template';
import PowerSelect from '#src/components/power-select.gts';
import { fn } from '@ember/helper';

class Index extends Component {
  diacritics = ['María', 'Søren Larsen', 'João', 'Saša Jurić', 'Íñigo'];

  selectedDiacritic: string | undefined = undefined;

  <template>
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
  </template>
}

export default RouteTemplate(Index);
