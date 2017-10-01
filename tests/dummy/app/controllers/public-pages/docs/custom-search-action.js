import Controller from '@ember/controller';
import fetch from 'fetch';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  // Actions
  actions: {
    searchRepo(term) {
      let url = `https://api.github.com/search/repositories?q=${term}`;
      return fetch(url).then((resp) => resp.json()).then((json) => json.items);
    }
  },

  // Tasks
  searchTask: task(function* (term) {
    yield timeout(1500);
    let url = `https://api.github.com/search/repositories?q=${term}`;
    return fetch(url).then((resp) => resp.json()).then((json) => json.items);
  })
});
