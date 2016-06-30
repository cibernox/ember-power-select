import Component from 'ember-component';
import computed from 'ember-computed';
import layout from '../templates/components/power-select-multiple';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

export default Component.extend({
  layout,
  // Config
  triggerComponent: fallbackIfUndefined('power-select-multiple/trigger'),
  beforeOptionsComponent: fallbackIfUndefined(null),

  // CPs
  concatenatedTriggerClass: computed('triggerClass', function() {
    let classes = ['ember-power-select-multiple-trigger'];
    if (this.get('triggerClass')) {
      classes.push(this.get('triggerClass'));
    }
    return classes.join(' ');
  }),

  selected: computed({
    get() {
      return [];
    },
    set(_, v) {
      if (v === null || v === undefined) {
        return [];
      }
      return v;
    }
  }),

  // Actions
  actions: {
    handleOpen(select, e) {
      let action = this.get('onopen');
      if (action && action(select, e) === false) { return false; }
      this.focusInput();
    },

    handleFocus(select, e) {
      let action = this.get('onfocus');
      if (action) { action(select, e); }
      this.focusInput();
    },

    handleKeydown(select, e) {
      let action = this.get('onkeydown');
      if (action && action(select, e) === false) {
        e.stopPropagation();
        return false;
      }
      if (e.keyCode === 13 && select.isOpen) {
        e.stopPropagation();
        if (select.highlighted !== undefined) {
          if (!select.selected || select.selected.indexOf(select.highlighted) === -1) {
            select.actions.choose(select.highlighted, e);
            return false;
          } else {
            select.actions.close(e);
            return false;
          }
        } else {
          select.actions.close(e);
          return false;
        }
      }
    },

    buildSelection(option, select) {
      let newSelection = (select.selected || []).slice(0);
      let idx = newSelection.indexOf(option);
      if (idx > -1) {
        newSelection.splice(idx, 1);
      } else {
        newSelection.push(option);
      }
      return newSelection;
    }
  },

  // Methods
  focusInput() {
    let input = this.element.querySelector('.ember-power-select-trigger-multiple-input');
    if (input) { input.focus(); }
  }
});
