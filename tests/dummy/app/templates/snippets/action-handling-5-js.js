import Ember from 'ember';
export default Ember.Controller.extend({
  cities: ['Barcelona', 'London', 'New York', 'Porto'],
  actions: {
    handleFocus(select, e) {
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
    return !blurredEl || !blurredEl.classList.contains('ember-power-select-search-input');
  }
});