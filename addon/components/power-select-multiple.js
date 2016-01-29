import Ember from 'ember';
import layout from '../templates/components/power-select-multiple';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

const { computed } = Ember;

export default Ember.Component.extend({
  layout,
  // Config
  triggerComponent: fallbackIfUndefined('power-select-multiple/trigger'),
  beforeOptionsComponent: fallbackIfUndefined(null),
  optionsComponent: fallbackIfUndefined('power-select-multiple/options'),

  // CPs
  concatenatedTriggerClass: computed('triggerClass', function() {
    let classes = ['ember-power-select-multiple-trigger'];
    if (this.get('triggerClass')) {
      classes.push(this.get('triggerClass'));
    }
    return classes.join(' ');
  }),

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
