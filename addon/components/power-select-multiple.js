import Ember from 'ember';
import layout from '../templates/components/power-select-multiple';

export default Ember.Component.extend({
  tagName: '',
  layout,
  selectedComponent: 'power-select-multiple/selected',
  beforeOptionsComponent: null,
});
