import Ember from 'ember';

function generatePromise() {
  return new Ember.RSVP.Promise((resolve) => {
    setTimeout(() => resolve(['one', 'two', 'three']), 5000);
  });
}

export default Ember.Controller.extend({
  names: ['Stefan', 'Miguel', 'Tomster', 'Pluto'],
  emptyList: [],
  promise: null,

  actions: {
    refreshCollection() {
      this.set('promise', generatePromise());
    }
  }
});