import Model, { attr, hasMany } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  age: attr('number'),
  pets: hasMany('pet', { inverse: 'owner' }),
});
