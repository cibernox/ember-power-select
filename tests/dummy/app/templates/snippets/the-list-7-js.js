import Controller from '@ember/controller';
import RSVP from 'rsvp';

function generatePromise() {
  return new RSVP.Promise((resolve) => {
    setTimeout(() => resolve(['one', 'two', 'three']), 5000);
  });
}

export default Controller.extend({
  promise: null,
  actions: {
    refreshCollection() {
      this.set('promise', generatePromise());
    }
  }
});
