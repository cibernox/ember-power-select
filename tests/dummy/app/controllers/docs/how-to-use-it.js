import Ember from 'ember';

export default Ember.Controller.extend({
  names: ['Stefan', 'Miguel', 'Tomster', 'Pluto'],
  countries: [
    { name: 'United States',  flagUrl: '/flags/us.svg' },
    { name: 'Spain',          flagUrl: '/flags/es.svg' },
    { name: 'Portugal',       flagUrl: '/flags/pt.svg' },
    { name: 'Russia',         flagUrl: '/flags/ru.svg' },
    { name: 'Latvia',         flagUrl: '/flags/lv.svg' },
    { name: 'Brazil',         flagUrl: '/flags/br.svg' },
    { name: 'United Kingdom', flagUrl: '/flags/gb.svg' },
  ],

  activeTab: 'template'
});