import Component from '@glimmer/component';
import { debounce } from '@ember/runloop';
import RSVP from 'rsvp';

export default class extends Component {
  searchRepo(term) {
    return new RSVP.Promise((resolve, reject) => {
      debounce(_performSearch, term, resolve, reject, 600);
    });
  }
}

function _performSearch(term, resolve, reject) {
  let url = `https://api.github.com/search/repositories?q=${term}`;
  fetch(url)
    .then((resp) => resp.json())
    .then((json) => resolve(json.items), reject);
}
