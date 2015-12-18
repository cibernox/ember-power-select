import Ember from 'ember';
import layout from '../templates/components/power-select-multiple';

export default Ember.Component.extend({
  layout,
  selectedComponent: 'power-select-multiple/selected',
  beforeOptionsComponent: null,
  optionsComponent: 'power-select-multiple/options',

  // Actions
  actions: {
    handleOpen() {
      // TODO: call provided onfocus
      this.focusInput();
    },

    handleFocus() {
      this.focusInput();
    }
  },

  // Methods
  focusInput() {
    this.element.querySelector('.ember-power-select-trigger-multiple-input').focus();
  }
});
