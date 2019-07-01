import Controller from '@ember/controller';
import { action } from '@ember/object';
import RSVP from 'rsvp';

function generatePromise() {
  return new RSVP.Promise((resolve) => {
    setTimeout(() => resolve(['one', 'two', 'three']), 5000);
  });
}

export default class extends Controller {
  promise = null

  @action
  refreshCollection() {
    this.set('promise', generatePromise());
  }
}
