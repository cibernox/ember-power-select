import Ember from 'ember';
import layout from '../templates/components/ember-power-select';
import { defaultMatcher } from '../utils/group-utils';

export default Ember.Component.extend({
  tagName: '',
  layout: layout,

  // Universal config
  disabled: false,
  placeholder: undefined,
  loadingMessage: "Loading options...",
  noMatchesMessage: "No results found",
  optionsComponent: 'ember-power-select/options',
  dropdownPosition: 'auto',
  matcher: defaultMatcher,
  searchField: null,
  search: null,
  closeOnSelect: true,

  // Select single config
  searchEnabled: true,
  searchMessage: "Type to search",
  searchPlaceholder: null,
  allowClear: false,

  // Select multiple config

  // Lifecycle hooks
  didInitAttrs() {
    this._super(...arguments);
    Ember.assert('{{ember-power-select}} requires an `onchange` function', this.get('onchange') && typeof this.get('onchange') === 'function');
  },

  // CPs
  concreteComponentName: Ember.computed('multiple', function() {
    return `ember-power-select/${this.get('multiple') ? 'multiple' : 'single'}`;
  }),

  selectedComponent: Ember.computed('multiple', function() {
    return `ember-power-select/${this.get('multiple') ? 'multiple' : 'single'}/selected`;
  })
});