import Ember from 'ember';
import layout from '../templates/components/ember-power-select';
import { defaultMatcher } from '../utils/group-utils';

export default Ember.Component.extend({
  layout: layout,

  // Universal config
  disabled: false,
  placeholder: null,
  loadingMessage: "Loading options...",
  noMatchesMessage: "No results found",
  selectedPartial: null,
  dropdownPosition: 'auto',
  matcher: defaultMatcher,
  searchField: null,
  search: null,

  // Select single config
  searchEnabled: true,
  searchMessage: "Type to search",
  searchPlaceholder: null,
  allowClear: false,

  // Select multiple config
});