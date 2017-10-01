import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import fetch from 'fetch';

export default Controller.extend({
  searchRepo: task(function* (term) {
    yield timeout(600);
    let url = `https://api.github.com/search/repositories?q=${term}`;
    return fetch(url).then((resp) => resp.json()).then((json) => json.items);
  })
});
