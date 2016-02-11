import Ember from 'ember';
import layout from '../templates/components/power-select-multiple';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';
import { emberPowerSelectBuildSelection as buildNewSelection } from '../helpers/ember-power-select-build-selection';

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
    },

    handleKeydown(select, e) {
      let action = this.get('onkeydown');
      if (action) { action(select, e); }
      if (e.defaultPrevented) { return; }
      let selected = Ember.A((this.get('selected') || []));
      if (e.keyCode === 13 && select.isOpen) {
        e.stopPropagation();
        if (select.highlighted !== undefined) {
          if (selected.indexOf(select.highlighted) === -1) {
            select.actions.choose(buildNewSelection([select.highlighted, selected], { multiple: true }), e);
          } else {
            select.actions.close(e);
          }
        } else {
          select.actions.close(e);
        }
      } else if (!select.isOpen && e.keyCode >= 48 && e.keyCode <= 90 || e.keyCode === 32) { // Keys 0-9, a-z or SPACE
        // Closed multiple selects should not do anything when typing on them
        e.preventDefault();
      }
    }
  },

  // Methods
  focusInput() {
    let input = this.element.querySelector('.ember-power-select-trigger-multiple-input');
    if (input) { input.focus(); }
  }
});
