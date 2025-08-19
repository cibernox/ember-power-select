import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';

export default class extends Component {
  searchTask = task(async (term) => {
    await timeout(1500);
    let url = `https://api.github.com/search/repositories?q=${term}`;
    return fetch(url)
      .then((resp) => resp.json())
      .then((json) => json.items);
  });
}
