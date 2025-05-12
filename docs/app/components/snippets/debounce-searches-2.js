import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';

export default class extends Component {
  @task(function* (term) {
    yield timeout(600);
    let url = `https://api.github.com/search/repositories?q=${term}`;
    return fetch(url)
      .then((resp) => resp.json())
      .then((json) => json.items);
  })
  searchRepo;
}
