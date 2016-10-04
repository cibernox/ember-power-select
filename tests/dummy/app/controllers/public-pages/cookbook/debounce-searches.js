import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
const { run, isBlank, inject } = Ember;

export default Ember.Controller.extend({
  ajax: inject.service(),

  actions: {
    searchRepo(term) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        run.debounce(this, this._performSearch, term, resolve, reject, 600);
      });
    }
  },

  searchRepo: task(function* (term) {
    yield timeout(600);
    let url = `https://api.github.com/search/repositories?q=${term}`;
    return this.get('ajax').request(url).then((json) => json.items);
  }),

  _performSearch(term, resolve, reject) {
    if (isBlank(term)) {
      return resolve([]);
    }
    let url = `https://api.github.com/search/repositories?q=${term}`;
    this.get('ajax').request(url)
      .then((json) => resolve(json.items), reject);
  }
});
