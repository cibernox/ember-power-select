import Controller from '@ember/controller';
import { debounce } from '@ember/runloop';
import fetch from 'fetch';
import RSVP from 'rsvp';

export default class extends Controller {
  searchRepo(term) {
    return new RSVP.Promise((resolve, reject) => {
      debounce(_performSearch, term, resolve, reject, 600);
    });
  }
}

function _performSearch(term, resolve, reject) {
  let url = `https://api.github.com/search/repositories?q=${term}`;
  fetch(url).then((resp) => resp.json()).then((json) => resolve(json.items), reject);
}
