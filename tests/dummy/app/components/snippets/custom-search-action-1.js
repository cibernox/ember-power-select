import Component from '@glimmer/component';
import fetch from 'fetch';

export default class extends Component {
  searchRepo(term) {
    let url = `https://api.github.com/search/repositories?q=${term}`;
    return fetch(url)
      .then((resp) => resp.json())
      .then((json) => json.items);
  }
}
