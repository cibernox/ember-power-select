import Controller from '@ember/controller';

const countries = [
  { name: 'United States', flagUrl: '/flags/us.svg', population: 321853000 },
  { name: 'Spain', flagUrl: '/flags/es.svg', population: 46439864 },
  { name: 'Portugal', flagUrl: '/flags/pt.svg', population: 10374822 },
  { name: 'Russia', flagUrl: '/flags/ru.svg', population: 146588880 },
  { name: 'Latvia', flagUrl: '/flags/lv.svg', population: 1978300 },
  { name: 'Brazil', flagUrl: '/flags/br.svg', population: 204921000 },
  { name: 'United Kingdom', flagUrl: '/flags/gb.svg', population: 64596752 },
];

export default class TheTrigger extends Controller {
  countries = countries;
  destination = countries[2];
  names = ['Stefan', 'Miguel', 'Tomster', 'Pluto'];
  name = 'Pluto';
}
