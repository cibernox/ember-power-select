import BaseSerializer from './application';

export default BaseSerializer.extend({
  include: ['pets'],
  links(model) {
    return {
      bestie: {
        related: `/pets/${model.bestieId}`
      }
    };
  }
});