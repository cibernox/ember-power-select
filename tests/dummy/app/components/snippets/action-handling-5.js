import Component from '@glimmer/component';
import { isBlank } from '@ember/utils';
import { action } from '@ember/object';

export default class extends Component {
  cities = ['Barcelona', 'London', 'New York', 'Porto'];

  @action
  handleFocus(select, e) {
    console.debug('EPS focused!');
    if (this.focusComesFromOutside(e)) {
      select.actions.open();
    }
  }

  @action
  handleBlur() {
    console.debug('EPS blurred!');
  }

  // Methods
  focusComesFromOutside(e) {
    let blurredEl = e.relatedTarget;
    if (isBlank(blurredEl)) {
      return false;
    }
    return !blurredEl.classList.contains('ember-power-select-search-input');
  }
}
