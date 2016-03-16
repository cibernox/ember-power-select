import Ember from 'ember';
import layout from '../../templates/components/power-select/options';

export default Ember.Component.extend({
  layout: layout,
  tagName: 'ul',
  attributeBindings: ['role', 'aria-controls'],
  role: 'listbox'
});