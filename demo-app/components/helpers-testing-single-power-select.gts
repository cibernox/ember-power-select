import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import PowerSelect from '#src/components/power-select.gts';
import { fn } from '@ember/helper';

const numbers = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
];

export default class HelpersTestingSinglePowerSelect extends Component {
  numbers = numbers;
  @tracked selected: string | undefined = undefined;

  <template>
    <h2 class="t3">Helpers testing with single select</h2>
    <div class="select-choose">
      <PowerSelect
        @options={{this.numbers}}
        @selected={{this.selected}}
        @onChange={{fn (mut this.selected)}}
        @searchEnabled={{true}}
        as |num|
      >
        {{num}}
      </PowerSelect>
    </div>

    {{#if this.selected}}
      <span class="select-choose-target">You've selected:
        {{this.selected}}</span>
    {{/if}}
  </template>
}
