import Controller from '@ember/controller';
export default Controller.extend({
  groupedNumbers: [
    { groupName: 'Smalls', options: ['one', 'two', 'three'] },
    { groupName: 'Mediums', options: ['four', 'five', 'six'] },
    { groupName: 'Bigs', options: [
        { groupName: 'Fairly big', options: ['seven', 'eight', 'nine'] },
        { groupName: 'Really big', options: [ 'ten', 'eleven', 'twelve' ] },
        'thirteen'
      ]
    },
    'one hundred',
    'one thousand'
  ]
});
