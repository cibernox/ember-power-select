import Component from '@glimmer/component';

export default class extends Component {
  async searchRepo(term) {
    let url = `https://api.github.com/search/repositories?q=${term}`;

    const response = await fetch(url);
    const json = await response.json();

    return json.items;
  }
}
