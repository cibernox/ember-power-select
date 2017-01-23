import Ember from 'ember';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),

  actions: {
    searchRepo(term) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        Ember.run.debounce(this, this._performSearch, term, resolve, reject, 600);
      });
    }
  },

  _performSearch(term, resolve, reject) {
    let url = `https://api.github.com/search/repositories?q=${term}`;
    this.get('ajax').request(url).then(json => resolve(json.items), reject);
  }
});