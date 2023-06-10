import Component from '@glimmer/component';

export default class extends Component {
  cities = ['Barcelona', 'London', 'New York', 'Porto'];
  selectedCities = [];

  checkLength(text, select /*, event */) {
    if (select.searchText.length >= 3 && text.length < 3) {
      return '';
    } else {
      return text.length >= 3;
    }
  }
}
