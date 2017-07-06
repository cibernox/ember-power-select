import Controller from '@ember/controller';
import fetch from 'fetch';

export default Controller.extend({
  actions: {
    searchRepo(term) {
      let url = `https://api.github.com/search/repositories?q=${term}`;
      return fetch(url).then((resp) => resp.json()).then((json) => json.items);
    }
  }
});
