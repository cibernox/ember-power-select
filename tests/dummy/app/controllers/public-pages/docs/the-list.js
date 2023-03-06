import Controller from '@ember/controller';
import { action } from '@ember/object';
import RSVP from 'rsvp';
import TheList1 from '../../../components/snippets/the-list-1';
import TheList2 from '../../../components/snippets/the-list-2';
import TheList3 from '../../../components/snippets/the-list-3';
import TheList4 from '../../../components/snippets/the-list-4';
import TheList5 from '../../../components/snippets/the-list-5';
// import TheList6 from '../../../components/snippets/the-list-6';
import TheList7 from '../../../components/snippets/the-list-7';
import TheList8 from '../../../components/snippets/the-list-8';
import TheList9 from '../../../components/snippets/the-list-9';
import TheList10 from '../../../components/snippets/the-list-10';

function generatePromise() {
  return new RSVP.Promise((resolve) => {
    setTimeout(() => resolve(['one', 'two', 'three']), 5000);
  });
}

const countries = [
  { name: 'United States', code: 'US', population: 321853000 },
  { name: 'Spain', code: 'ES', population: 46439864 },
  { name: 'Portugal', code: 'PT', population: 10374822, disabled: true },
  { name: 'Russia', code: 'RU', population: 146588880, disabled: true },
  { name: 'Latvia', code: 'LV', population: 1978300 },
  { name: 'Brazil', code: 'BR', population: 204921000, disabled: true },
  { name: 'United Kingdom', code: 'GB', population: 64596752 },
];

const groupedNumbers = [
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

export default class extends Controller {
  theList1 = TheList1;
  theList2 = TheList2;
  theList3 = TheList3;
  theList4 = TheList4;
  theList5 = TheList5;
  // theList6 = TheList6;
  theList7 = TheList7;
  theList8 = TheList8;
  theList9 = TheList9;
  theList10 = TheList10;
  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];
  emptyList = [];
  promise = null;
  countries = countries;
  groupedNumbers = groupedNumbers;

  stopPropagation(e) {
    e.stopPropagation();
  }

  removeName(name) {
    alert(`remove name: ${name}`);
  }

  @action
  refreshCollection() {
    this.set('promise', generatePromise());
  }
}
