import Ember from 'ember';
import fetch from 'fetch';
export default Ember.Controller.extend({
  actions: {
    searchRepo(term) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        Ember.run.debounce(this, this._performSearch, term, resolve, reject, 600);
      });
    }
  },

  _performSearch(term, resolve, reject) {
    let url = `https://api.github.com/search/repositories?q=${term}`;
    fetch(url).then((resp) => resp.json()).then(json => resolve(json.items), reject);
  }
});
