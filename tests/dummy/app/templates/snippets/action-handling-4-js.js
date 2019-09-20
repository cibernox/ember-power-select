import Controller from '@ember/controller';

export default class extends Controller {
  cities = ['Barcelona', 'London', 'New York', 'Porto']
  selectedCities = []

  checkLength(text, select /*, event */) {
    if (select.searchText.length >= 3 && text.length < 3) {
      return '';
    } else {
      return text.length >= 3;
    }
  }
}
