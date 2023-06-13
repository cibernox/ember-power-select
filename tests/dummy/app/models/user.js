import Model, { attr, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @attr('string') name;
  @attr('number') age;
  @hasMany('pet', { async: true, inverse: 'owner' }) pets;
}
