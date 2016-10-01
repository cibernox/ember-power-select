import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    searchRepo(term) {
      if (Ember.isBlank(term)) { return []; }
      const url = `//api.github.com/search/repositories?q=${term}`;
      return ajax({ url }).then(json => json.items);
    }
  }
});