import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  friends: hasMany('user'),
  bestie: belongsTo('user')
});
