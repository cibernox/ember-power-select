import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import fetch from 'fetch';

export default class extends Controller {
  @(task(function* (term) {
    yield timeout(1500);
    let url = `https://api.github.com/search/repositories?q=${term}`;
    return fetch(url).then((resp) => resp.json()).then((json) => json.items);
  })) searchTask
}
