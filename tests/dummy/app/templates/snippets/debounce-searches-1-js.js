import Ember from 'ember';

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

  _performSearch(term, resolve, reject) {
    if (isBlank(term)) { return resolve([]); }
    this.get('ajax').request(`https//api.github.com/search/repositories?q=${term}`)
      .then(json => resolve(json.items), reject);
  }
});