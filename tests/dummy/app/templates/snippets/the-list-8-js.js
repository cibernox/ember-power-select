import Ember from 'ember';

export default Ember.Controller.extend({
  countries: [
    { name: 'United States',  code: 'US' },
    { name: 'Spain',          code: 'ES' },
    { name: 'Portugal',       code: 'PT', disabled: true },
    { name: 'Russia',         code: 'RU', disabled: true },
    { name: 'Latvia',         code: 'LV' },
    { name: 'Brazil',         code: 'BR', disabled: true },
    { name: 'United Kingdom', code: 'GB' },
  ]
});