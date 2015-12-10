import Ember from 'ember';

export default Ember.Controller.extend({
  names: ['Stefan', 'Miguel', 'Tomster', 'Pluto'],

  actions: {
    createItem(name, dropdown) {
      this.get('names').pushObject(name);
      this.set('selected', name);
      dropdown.actions.close();
    }
  }
});