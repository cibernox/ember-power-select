import Controller from '@ember/controller';
import { computed } from '@ember/object';
const countries = [
  { id: 1, name: 'United States',  flagUrl: '/flags/us.svg' },
  { id: 2, name: 'Spain',          flagUrl: '/flags/es.svg' },
  { id: 3, name: 'Portugal',       flagUrl: '/flags/pt.svg' },
  { id: 4, name: 'Russia',         flagUrl: '/flags/ru.svg' },
  { id: 5, name: 'Latvia',         flagUrl: '/flags/lv.svg' },
  { id: 6, name: 'Brazil',         flagUrl: '/flags/br.svg' },
  { id: 7, name: 'United Kingdom', flagUrl: '/flags/gb.svg' },
];

export default Controller.extend({
  countries,
  destination: computed('destinationId', 'countries', function() {
    const countries = this.get('countries');
    if (!countries) {
      return null;
    }
    return countries.find(x => x.id === this.get('destinationId'));
  }),  
  actions: {
    foo() { }
  }
});
