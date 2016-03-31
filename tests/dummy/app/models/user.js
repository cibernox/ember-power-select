import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  age:  DS.attr('number'),
  friends: DS.hasMany('user', { inverse: null }),
  bestie: DS.belongsTo('user', { inverse: null })
});