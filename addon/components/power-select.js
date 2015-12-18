import Ember from 'ember';
import layout from '../templates/components/power-select';
import { defaultMatcher } from '../utils/group-utils';

const { computed } = Ember;

function fallbackIfUndefined(fallback) {
  return computed({
    get() { return fallback; },
    set(_, v) { return v === undefined ? fallback : v; }
  });
}

export default Ember.Component.extend({
  layout: layout,

  // Universal config
  tagName: fallbackIfUndefined(''),
  disabled: fallbackIfUndefined(false),
  placeholder: fallbackIfUndefined(null),
  loadingMessage: fallbackIfUndefined('Loading options...'),
  noMatchesMessage: fallbackIfUndefined('No results found'),
  optionsComponent: fallbackIfUndefined('power-select/options'),
  afterOptionsComponent: fallbackIfUndefined(null),
  dropdownPosition: fallbackIfUndefined('auto'),
  matcher: fallbackIfUndefined(defaultMatcher),
  searchField: fallbackIfUndefined(null),
  search: fallbackIfUndefined(null),
  closeOnSelect: fallbackIfUndefined(true),
  dropdownClass: fallbackIfUndefined(null),
  triggerClass: fallbackIfUndefined(null),
  dir: fallbackIfUndefined(null),
  opened: fallbackIfUndefined(false),

  // Select single config
  searchEnabled: fallbackIfUndefined(true),
  searchMessage: fallbackIfUndefined("Type to search"),
  searchPlaceholder: fallbackIfUndefined(null),
  allowClear: fallbackIfUndefined(false),

  // Lifecycle hooks
  didInitAttrs() {
    this._super(...arguments);
    Ember.assert('{{power-select}} requires an `onchange` function', this.get('onchange') && typeof this.get('onchange') === 'function');
  },

  // CPs
  concreteComponentName: Ember.computed('multiple', function() {
    return `power-select/${this.get('multiple') ? 'multiple' : 'single'}`;
  }),

  selectedComponentOrDefault: Ember.computed('multiple', 'selectedComponent', function() {
    let givenComponent = this.get('selectedComponent');
    if (givenComponent) { return givenComponent; }
    return `power-select/${this.get('multiple') ? 'multiple' : 'single'}/selected`;
  }),

  beforeOptionsComponentOrDefault: Ember.computed('multiple', 'beforeOptionsComponent', function() {
    let givenComponent = this.get('beforeOptionsComponent');
    if (givenComponent) { return givenComponent; }
    return this.get('multiple') ? null : `power-select/before-options`;
  })
});
