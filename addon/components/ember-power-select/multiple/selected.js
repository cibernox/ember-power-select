import Ember from 'ember';
import layout from '../../../templates/components/ember-power-select/multiple/selected';

const { htmlSafe } = Ember.String;

export default Ember.Component.extend({
  layout: layout,
  tagName: '',

  // CPs
  triggerMultipleInputStyle: Ember.computed('searchText.length', function() {
    return htmlSafe(`width: ${(this.get('searchText.length') || 0) * 0.5 + 2}em`);
  }),
});
