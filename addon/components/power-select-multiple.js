import Ember from 'ember';
import layout from '../templates/components/power-select-multiple';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

export default Ember.Component.extend({
  layout,
  // Config
  disabled: fallbackIfUndefined(false),
  placeholder: fallbackIfUndefined(null),
  loadingMessage: fallbackIfUndefined('Loading options...'),
  noMatchesMessage: fallbackIfUndefined('No results found'),
  dropdownPosition: fallbackIfUndefined('auto'),
  searchField: fallbackIfUndefined(null),
  search: fallbackIfUndefined(null),
  closeOnSelect: fallbackIfUndefined(true),
  dropdownClass: fallbackIfUndefined(null),
  triggerClass: fallbackIfUndefined(null),
  dir: fallbackIfUndefined(null),
  opened: fallbackIfUndefined(false),
  searchEnabled: fallbackIfUndefined(true),
  searchMessage: fallbackIfUndefined("Type to search"),
  searchPlaceholder: fallbackIfUndefined(null),
  triggerComponent: fallbackIfUndefined('power-select-multiple/trigger'),
  beforeOptionsComponent: fallbackIfUndefined(null),
  optionsComponent: fallbackIfUndefined('power-select-multiple/options'),

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
