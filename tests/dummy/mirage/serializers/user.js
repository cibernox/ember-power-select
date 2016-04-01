import BaseSerializer from './application';

export default BaseSerializer.extend({
  include: ['friends'],
  links(model) {
    return {
      bestie: {
        related: `/users/${model.bestieId}`
      }
    };
  }
});