import Ember from 'ember';
import layout from '../templates/components/power-select-multiple';

export default Ember.Component.extend({
  layout,
  triggerComponent: 'power-select-multiple/trigger',
  beforeOptionsComponent: null,
  optionsComponent: 'power-select-multiple/options',

  // CPs
  selectedComponent: Ember.computed.deprecatingAlias('triggerComponent', { id: 'power-select-multiple-selected-component', until: '0.9'}),

  // Actions
  actions: {
    handleOpen(select, e) {
      let action = this.get('onopen');
      if (action) { action(select, e); }
      this.focusInput();
    },

    handleFocus(select, e) {
      let action = this.get('onfocus');
      if (action) { action(select, e); }
      this.focusInput();
    }
  },

  // Methods
  focusInput() {
    this.element.querySelector('.ember-power-select-trigger-multiple-input').focus();
  }
});
