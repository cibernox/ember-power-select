import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import PowerSelect, {
  type Select,
} from 'ember-power-select/components/power-select';

export default class extends Component {
  cities: string[] = ['Barcelona', 'London', 'New York', 'Porto'];
  selectedCities: string[] = [];

  checkLength(text: string, select: Select /*, e: Event */) {
    if (select.searchText.length >= 3 && text.length < 3) {
      return '';
    } else {
      return text.length >= 3;
    }
  }

  <template>
    <PowerSelect
      @multiple={{true}}
      @selected={{this.selectedCities}}
      @options={{this.cities}}
      @onChange={{fn (mut this.selectedCities)}}
      @labelText="Country"
      @onInput={{this.checkLength}}
      as |name|
    >
      {{name}}
    </PowerSelect>
  </template>
}
