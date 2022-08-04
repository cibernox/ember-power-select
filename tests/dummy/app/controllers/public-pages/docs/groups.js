import Controller from '@ember/controller';

export default class Groups extends Controller {
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
}
