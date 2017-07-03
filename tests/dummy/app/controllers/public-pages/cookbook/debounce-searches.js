import Controller from '@ember/controller';
import { isBlank } from '@ember/utils';
import { run } from '@ember/runloop';
import fetch from 'fetch';
import RSVP from 'rsvp';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  actions: {
    searchRepo(term) {
      return new RSVP.Promise((resolve, reject) => {
        run.debounce(this, this._performSearch, term, resolve, reject, 600);
      });
    }
  },

  searchRepo: task(function* (term) {
    yield timeout(600);
    let url = `https://api.github.com/search/repositories?q=${term}`;
    return fetch(url).then((resp) => resp.json()).then((json) => json.items);
  }),

  _performSearch(term, resolve, reject) {
    if (isBlank(term)) {
      return resolve([]);
    }
    let url = `https://api.github.com/search/repositories?q=${term}`;
    fetch(url).then((resp) => resp.json())
      .then((json) => resolve(json.items), reject);
  }
});
