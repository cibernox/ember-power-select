import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';

export default Ember.Controller.extend({
  ajax: Ember.inject.service(),

  searchTask: task(function* (term) {
    yield timeout(1500);
    let url = `https://api.github.com/search/repositories?q=${term}`;
    return this.get('ajax').request(url).then((json) => json.items);
  })
});