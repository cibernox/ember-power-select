import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

const countries = [
  { name: 'United States', flagUrl: '/flags/us.svg' },
  { name: 'Spain', flagUrl: '/flags/es.svg' },
  { name: 'Portugal', flagUrl: '/flags/pt.svg' },
  { name: 'Russia', flagUrl: '/flags/ru.svg' },
  { name: 'Latvia', flagUrl: '/flags/lv.svg' },
  { name: 'Brazil', flagUrl: '/flags/br.svg' },
  { name: 'United Kingdom', flagUrl: '/flags/gb.svg' },
];

export default class extends Component {
  @tracked country: string | undefined;

  options = countries;

  <template>
    <PowerSelect
      @triggerClass="bootstrap-theme-trigger"
      @dropdownClass="slide-fade bootstrap-theme-dropdown"
      @searchField="name"
      @searchEnabled={{true}}
      @options={{this.options}}
      @selected={{this.country}}
      @onChange={{fn (mut this.country)}}
      as |country|
    >
      <img
        src={{country.flagUrl}}
        class="icon-flag"
        alt="Flag of {{country.name}}"
      />
      <strong>{{country.name}}</strong>
    </PowerSelect>
  </template>
}
