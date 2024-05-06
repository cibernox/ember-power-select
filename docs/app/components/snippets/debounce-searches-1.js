import Component from '@glimmer/component';
import { debounceTask } from 'ember-lifeline';
import RSVP from 'rsvp';

export default class extends Component {
  searchRepo(term) {
    return new RSVP.Promise((resolve, reject) => {
      debounceTask(this, '_performSearch', term, resolve, reject, 600);
    });
  }

  _performSearch(term, resolve, reject) {
    let url = `https://api.github.com/search/repositories?q=${term}`;
    fetch(url)
      .then((resp) => resp.json())
      .then((json) => resolve(json.items), reject);
  }
}
