import Ember from 'ember';
import layout from '../templates/components/ember-power-select';
import { defaultMatcher } from '../utils/group-utils';
const { computed } = Ember;

export default Ember.Component.extend({
  tagName: '',
  layout: layout,

  // Universal config
  disabled: false,
  placeholder: null,
  loadingMessage: "Loading options...",
  noMatchesMessage: "No results found",
  selectedComponent: null,
  dropdownPosition: 'auto',
  matcher: defaultMatcher,
  searchField: computed.alias('optionLabelPath'),
  search: null,

  // Select single config
  searchEnabled: true,
  searchMessage: "Type to search",
  searchPlaceholder: null,
  allowClear: false,

  // Select multiple config
});
