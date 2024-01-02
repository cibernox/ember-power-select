import Model, { attr, belongsTo } from '@ember-data/model';

export default class PetModel extends Model {
  @attr('string') name;
  @attr('number') age;
  @belongsTo('user', { async: true, inverse: 'pets' }) owner;
}
