import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import CustomSearchAction1 from '../../../components/snippets/custom-search-action-1';
import CustomSearchAction2 from '../../../components/snippets/custom-search-action-2';

export default class extends Controller {
  customSearchAction1 = CustomSearchAction1;
  customSearchAction2 = CustomSearchAction2;

  async searchRepo(term) {
    let url = `https://api.github.com/search/repositories?q=${term}`;

    const response = await fetch(url);
    const json = await response.json();

    return json.items;
  }

  // Tasks
  searchTask = task(async (term) => {
    await timeout(1500);
    let url = `https://api.github.com/search/repositories?q=${term}`;
    return fetch(url)
      .then((resp) => resp.json())
      .then((json) => json.items);
  });
}
