import Ember from 'ember';
import layout from '../../templates/components/power-select/options';

// TODO: Do I really need a component? A recursive template would do ...
export default Ember.Component.extend({
  layout: layout,
  tagName: 'ul',
  attributeBindings: ['role'],
  role: 'listbox'
});
