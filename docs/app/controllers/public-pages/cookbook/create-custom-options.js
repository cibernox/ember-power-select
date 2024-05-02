import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { isBlank } from '@ember/utils';
import CreateCustomOptions1 from '../../../components/snippets/create-custom-options-1';

export default class extends Controller {
  createCustomOptions1 = CreateCustomOptions1;

  @tracked options = ['Barcelona', 'London', 'New York', 'Porto'];

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
        this.options = [...this.options, select.searchText];
        select.actions.choose(select.searchText);
      }
    }
  }
}
