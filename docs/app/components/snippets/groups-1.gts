import Component from '@glimmer/component';
import PowerSelect from 'ember-power-select/components/power-select';
import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';

export default class extends Component {
  @tracked number: string | undefined;

  groupedNumbers = [
    { groupName: 'Smalls', options: ['one', 'two', 'three'] },
    { groupName: 'Mediums', options: ['four', 'five', 'six'] },
    {
      groupName: 'Bigs',
      options: [
        { groupName: 'Fairly big', options: ['seven', 'eight', 'nine'] },
        { groupName: 'Really big', options: ['ten', 'eleven', 'twelve'] },
        'thirteen',
      ],
    },
    'one hundred',
    'one thousand',
  ];

  <template>
    <PowerSelect
      @searchEnabled={{true}}
      @options={{this.groupedNumbers}}
      @selected={{this.number}}
      @labelText="Number"
      @onChange={{fn (mut this.number)}}
      as |num|
    >
      {{num}}
    </PowerSelect>
  </template>
}
