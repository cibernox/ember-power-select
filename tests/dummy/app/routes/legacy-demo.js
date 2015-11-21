import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller) {
    this._super(controller, this.store.findAll('user'));
  }
});