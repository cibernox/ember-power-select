import Route from '@ember/routing/route';

export default Route.extend({
  setupController(controller) {
    this._super(controller, this.store.findAll('user'));
  }
});
