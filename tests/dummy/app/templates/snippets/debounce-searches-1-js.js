import Controller from '@ember/controller';
import { debounce } from '@ember/runloop';
import fetch from 'fetch';
import RSVP from 'rsvp';
export default Controller.extend({
  actions: {
    searchRepo(term) {
      return new RSVP.Promise((resolve, reject) => {
        debounce(this, this._performSearch, term, resolve, reject, 600);
      });
    }
  },

  _performSearch(term, resolve, reject) {
    let url = `https://api.github.com/search/repositories?q=${term}`;
    fetch(url).then((resp) => resp.json()).then((json) => resolve(json.items), reject);
  }
});
