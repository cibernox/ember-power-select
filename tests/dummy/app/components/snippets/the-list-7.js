import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import RSVP from 'rsvp';

function generatePromise() {
  return new RSVP.Promise((resolve) => {
    setTimeout(() => resolve(['one', 'two', 'three']), 5000);
  });
}

export default class extends Component {
  @tracked promise = null;

  @action
  refreshCollection() {
    this.promise = generatePromise();
  }
}
