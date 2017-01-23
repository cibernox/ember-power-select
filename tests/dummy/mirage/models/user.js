import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  pets: hasMany('pet'),
  bestie: belongsTo('pet')
});
