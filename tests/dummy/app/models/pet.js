import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  name: attr('string'),
  age: attr('number'),
  owner: belongsTo('user'),
});
