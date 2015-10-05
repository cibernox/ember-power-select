import Ember from 'ember';
import ajax from 'ic-ajax';

const { isBlank } = Ember;

export default Ember.Controller.extend({
  actions: {
    searchRepo(term) {
      if (isBlank(term)) { return []; }
      const url = `//api.github.com/search/repositories?q=${term}`;
      return ajax({ url }).then(json => json.items);
    }
  }
});