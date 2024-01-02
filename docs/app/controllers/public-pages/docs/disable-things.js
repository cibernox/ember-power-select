import Controller from '@ember/controller';

export default class DisableThings extends Controller {
  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];

  countries = [
    { name: 'United States' },
    { name: 'Spain', disabled: true },
    { name: 'Portugal' },
    { name: 'Russia' },
    { name: 'Latvia', disabled: true },
    { name: 'Brazil' },
    { name: 'United Kingdom' },
  ];
}
