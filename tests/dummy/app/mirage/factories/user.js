/*
  This is an example factory definition.

  Create more files in this directory to define additional factories.
*/
import Mirage/*, {faker} */ from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name(i) {
    return `User ${i}`;
  },
  age(i) {
    return 20 + i;
  }
});
