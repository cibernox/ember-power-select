import { Factory } from 'miragejs';

export default Factory.extend({
  name(i) {
    return `Pet ${i}`;
  },

  age(i) {
    return 20 + i;
  },
});
