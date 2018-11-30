import Controller from '@ember/controller';
import { isBlank } from '@ember/utils';
export default Controller.extend({
  cities: ['Barcelona', 'London', 'New York', 'Porto'],
  actions: {
    handleFocus(select, e) {
      console.debug('EPS focused!');
      if (this.focusComesFromOutside(e)) {
        select.actions.open();
      }
    },

    handleBlur() {
      console.debug('EPS blurred!');
    }
  },

  // Methods
  focusComesFromOutside(e) {
    let blurredEl = e.relatedTarget;
    if (isBlank(blurredEl)) {
      return false;
    }
    return !blurredEl.classList.contains('ember-power-select-search-input');
  }
});
