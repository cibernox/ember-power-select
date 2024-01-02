import Component from '@glimmer/component';

export default class extends Component {
  groupedNumbers = [
    { groupName: 'Smalls', disabled: true, options: ['one', 'two', 'three'] },
    { groupName: 'Mediums', options: ['four', 'five', 'six'] },
    {
      groupName: 'Bigs',
      disabled: true,
      options: [
        { groupName: 'Fairly big', options: ['seven', 'eight', 'nine'] },
        { groupName: 'Really big', options: ['ten', 'eleven', 'twelve'] },
        'thirteen',
      ],
    },
    'one hundred',
    'one thousand',
  ];
}
