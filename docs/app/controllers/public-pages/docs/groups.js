import Controller from '@ember/controller';
import Groups1 from '../../../components/snippets/groups-1';

export default class Groups extends Controller {
  groups1 = Groups1;
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
