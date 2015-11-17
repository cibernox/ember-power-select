import Ember from 'ember';
import layout from '../../../templates/components/power-select/multiple/selected';

const { computed } = Ember;
const { htmlSafe } = Ember.String;

export default Ember.Component.extend({
  layout: layout,
  tagName: '',

  // CPs
  triggerMultipleInputStyle: computed('searchText.length', 'selection.length', function() {
    if (this.get('selection.length') === 0) {
      return htmlSafe('width: 100%;');
    } else {
      return htmlSafe(`width: ${(this.get('searchText.length') || 0) * 0.5 + 2}em`);
    }
  }),

  maybePlaceholder: computed('placeholder', 'selection.length', function() {
    return this.get('selection.length') === 0 ? (this.get('placeholder') || '') : '';
  }),

  actions: {
    search(term, e) {
      let { search, open } = this.get('select.actions');
      search(term, e);
      open(e);
    }
  }
});
