import { action } from '@ember/object';
import Component from '@glimmer/component';
import { restartableTask, timeout } from 'ember-concurrency';
import RSVP from 'rsvp';

export default class extends Component {
  @action
  searchRepo(term) {
    return new RSVP.Promise((resolve, reject) => {
      this._performSearch.perform(term, resolve, reject);
    });
  }

  _performSearch = restartableTask(async (term, resolve, reject) => {
    await timeout(600);
    let url = `https://api.github.com/search/repositories?q=${term}`;
    fetch(url)
      .then((resp) => resp.json())
      .then((json) => resolve(json.items), reject);
  });
}
