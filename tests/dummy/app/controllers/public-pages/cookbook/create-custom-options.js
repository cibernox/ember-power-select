import Controller from '@ember/controller';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import { A } from '@ember/array';

export default class extends Controller {
  options = A(['Barcelona', 'London', 'New York', 'Porto']);
  selected = [];

  @action
  createOnEnter(select, e) {
    if (
      e.keyCode === 13 &&
      select.isOpen &&
      !select.highlighted &&
      !isBlank(select.searchText)
    ) {
      if (!this.selected.includes(select.searchText)) {
        this.options.push(select.searchText);
        select.actions.choose(select.searchText);
      }
    }
  }
}
