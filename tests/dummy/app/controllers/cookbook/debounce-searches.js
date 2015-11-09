import Ember from 'ember';
import ajax from 'ic-ajax';

const { run, isBlank } = Ember;

export default Ember.Controller.extend({
  actions: {
    searchRepo(term) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        run.debounce(this, this._performSearch, term, resolve, reject, 600);
      });
    }
  },

  _performSearch(term, resolve, reject) {
    if (isBlank(term)) { return resolve([]); }
    ajax({ url: `//api.github.com/search/repositories?q=${term}` })
      .then(json => resolve(json.items), err => reject(err));
  }
});