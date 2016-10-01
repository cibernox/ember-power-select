import Ember from 'ember';

const { isBlank } = Ember;

export default Ember.Controller.extend({
  options: Ember.A(['Barcelona', 'London', 'New York', 'Porto']),
  selected: [],

  actions: {
    createOnEnter(select, e) {
      if (e.keyCode === 13 && select.isOpen && !select.highlighted && !isBlank(select.searchText)) {

        let selected = this.get('selected');
        if (!selected.includes(select.searchText)) {
          this.get('options').pushObject(select.searchText);
          select.actions.choose(select.searchText);
        }
      }
    }
  }
});
