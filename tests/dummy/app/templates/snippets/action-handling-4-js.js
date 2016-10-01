import Ember from 'ember';
export default Ember.Controller.extend({
  cities: ['Barcelona', 'London', 'New York', 'Porto'],
  actions: {
    handleFocus(select, e) {
      select.actions.open();
    }
  }
});