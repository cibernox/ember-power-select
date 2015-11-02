import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return [this.store.findAll('user')];
  },

  setupController(controller, [model]) {
    this._super(controller, model);
  }
});