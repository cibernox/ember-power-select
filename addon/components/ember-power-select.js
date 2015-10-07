import Ember from 'ember';
import layout from '../templates/components/ember-power-select';
import { indexOfOption, optionAtIndex, filterOptions, stripDiacritics, countOptions } from '../utils/group-utils';

const { RSVP, computed, run, get } = Ember;
const { htmlSafe } = Ember.String;

// TODOs:
//
// - Fallback to native select in mobile (optional and only where possible)
// - Make the autofocus functionality configurable: "always", "never" or "desktop-only" (default?)
//
// Refactor plan for extensibility
//
// List of actions => consecuences all selects can receive:
// - Click trigger          => Open/Close select
// - Hover option           => Highlight option
// - Arrows navigation      => Highlight option
// - Click option           => Select/Unselect option
// - Press enter            => Select/Unselect option or Create option
// - Receive text (input)   => Refresh results (search or filter)
// - Click remove button    => Remove selection
//
// List of possible actions to fire
// - change (onchange)
// - highlight (onhighlight)
// - search (onsearch??)
//
//
export default Ember.Component.extend({
  layout: layout,
  disabled: false,
  searchEnabled: true,
  searchPlaceholder: null,
  classNames: ['ember-power-select-wrapper'],
  loadingMessage: "Loading options...",
  noMatchesMessage: "No results found",
  searchMessage: "Type to search",
  selectedPartial: null,
  attributeBindings: ['dir'],
  _highlighted: null,
  _searchText: '',
  _loadingOptions: false,
  matcher: (value, text) => text === '' || stripDiacritics(value).toUpperCase().indexOf(stripDiacritics(text).toUpperCase()) > -1,

  // Lifecycle hooks
  didReceiveAttrs({ newAttrs: { options, multiple } }) {
    if (multiple) {
      this.set('searchEnabled', false); // I feel that this should be a CP
    }
    this.set('_loadingOptions', true);
    RSVP.Promise.resolve(options && options.value || options)
      .then(opts => this.updateOptions(opts))
      .finally(() => this.set('_loadingOptions', false));
  },

  // CPs
  _notLoadingOptions: computed.not('_loadingOptions'),

  dropdownClasses: computed('multiple', function() {
    return `ember-power-select ${this.get('multiple') && 'multiple'}`;
  }),

  selectedOption: computed('selected', {
    get() {
      return this.get('multiple') && Ember.A(this.get('selected')) || this.get('selected');
    },
    set(_, value) {
      return value;
    }
  }),

  mustSearch: computed('_searchText', 'search', function(){
    return this.get('_searchText.length') === 0 && !!this.get('search');
  }),

  triggerMultipleInputStyle: computed('_searchText', function() {
    return htmlSafe(`width: ${(this.get('_searchText.length') || 0) * 0.5 + 2}em`);
  }),

  resultsLength: computed('results', function() {
    return countOptions(this.get('results'));
  }),

  // Actions
  actions: {
    select(option, toggleDropdown, e) {
      e.preventDefault();
      this.select(option);
      toggleDropdown(e);
    },

    highlight(option) {
      if (get(option, 'disabled')) { return; }
      this.set('_highlighted', option);
    },

    removeOption(option, e) {
      e.stopPropagation();
      this.removeOption(option);
    },

    clear(e) {
      e.stopPropagation();
      e.preventDefault();
      this.set('selectedOption', null);
      if (this.get('onchange')) { this.get('onchange')(null); }
    },

    search(term /*, e */) {
      this.set('_searchText', term);
      if (this.get('search')) {
        this.performCustomSearch(term);
      } else {
        this.refreshResults();
        this.set('_highlighted', this.optionAtIndex(0));
      }
    },

    searchKeydown(toggleDropdown, e) {
      if (e.keyCode === 40 || e.keyCode === 38) { // Arrow up/down
        this.handleVerticalArrowKey(e);
      } else if (e.keyCode === 13) {  // Enter
        this.pressedEnterOnSeach(e);
        toggleDropdown(e);
      } else if (e.keyCode === 9) {   // Tab
        toggleDropdown();
      } else if (e.keyCode === 27) {  // escape
        e.preventDefault();
        toggleDropdown(e);
      } else if (e.keyCode === 8) {   // backspace
        this.handleBackspace(e);
      }
    },

    multipleModeInputKeydown(e) {
      if (e.keyCode === 40 || e.keyCode === 38) { // Arrow up/down
        return this.handleVerticalArrowKey(e);
      }
      let event = document.createEvent('Event');
      if (e.keyCode === 8) {   // backspace
        this.removeLastOptionIfSearchIsEmpty();
        event.initEvent('dropdown:open', true, true);
      } else if (e.keyCode === 13) {  // Enter
        e.stopPropagation();
        this.pressedEnterOnMultipleSelect();
        event.initEvent('dropdown:toggle', true, true);
      } else if (e.keyCode === 9) {   // Tab
        event.initEvent('dropdown:close', true, true);
      } else if (e.keyCode === 27) {  // escape
        e.preventDefault();
        event.initEvent('dropdown:close', true, true);
      } else {
        event.initEvent('dropdown:open', true, true);
      }
      this.element.querySelector('.ember-power-select').dispatchEvent(event);
    }
  },

  // Methods
  onOpen() {
    if (this._resultsDirty) { this.refreshResults(); }
    if (this.get('multiple')) {
      this.set('_highlighted', this.optionAtIndex(0));
    } else {
      this.set('_highlighted', this.get('selectedOption') || this.optionAtIndex(0));
    }
    run.scheduleOnce('afterRender', this, this.focusSearch);
    run.scheduleOnce('afterRender', this, this.scrollIfHighlightedIsOutOfViewport);
  },

  onClose() {
    this.set('_searchText', '');
    this.set('_highlighted', null);
    this._resultsDirty = true;
  },

  onFocus() {
    if (this.get('multiple')) { this.focusSearch(); }
  },

  select(option) {
    if (this.get('multiple')) {
      this.addOrRemoveToSelected(option);
    } else if (this.get('selectedOption') !== option) {
      this.set('selectedOption', option);
    }
    if (this.get('onchange')) { this.get('onchange')(this.get('selectedOption')); }
  },

  pressedEnterOnSeach() {
    const highlighted = this.get('_highlighted');
    this.select(highlighted);
  },

  pressedEnterOnMultipleSelect() {
    const highlighted = this.get('_highlighted');
    if (highlighted && (this.get('selected') || []).indexOf(highlighted) === -1) {
      this.select(highlighted);
    }
  },

  handleVerticalArrowKey(e) {
    e.preventDefault();
    const newHighlighted = this.advanceSelectableOption(this.get('_highlighted'), e.keyCode === 40 ? 1 : -1);
    this.set('_highlighted', newHighlighted);
    run.scheduleOnce('afterRender', this, this.scrollIfHighlightedIsOutOfViewport);
  },

  removeLastOptionIfSearchIsEmpty() {
    if (!this.get('multiple')) { return; }
    if (this.get('_searchText.length') !== 0) { return; }
    const lastSelection = this.get('selectedOption.lastObject');
    if (!lastSelection) { return; }
    this.removeOption(lastSelection);
    if (typeof lastSelection === 'string') {
      this.set('_searchText', lastSelection); // TODO: Convert last selection to text
    } else {
      if (!this.get('searchField')) { throw new Error('Need to provide `searchField` when options are not strings'); }
      this.set('_searchText', get(lastSelection, this.get('searchField'))); // TODO: Convert last selection to text
    }
  },

  removeOption(option) {
    this.get('selectedOption').removeObject(option);
    this._resultsDirty = true;
    if (this.get('onchange')) { this.get('onchange')(this.get('selectedOption')); }
  },

  addOrRemoveToSelected(option) {
    if (this.get('selectedOption').contains(option)) {
      this.get('selectedOption').removeObject(option);
    } else {
      this.get('selectedOption').addObject(option);
    }
  },

  scrollIfHighlightedIsOutOfViewport() {
    const optionsList = document.querySelector('.ember-power-select-options');
    const highlightedOption = optionsList.querySelector('.ember-power-select-option.highlighted');
    if (!highlightedOption) { return; }
    const optionTopScroll = highlightedOption.offsetTop - optionsList.offsetTop;
    const optionBottomScroll = optionTopScroll + highlightedOption.offsetHeight;
    if (optionBottomScroll > optionsList.offsetHeight + optionsList.scrollTop) {
      optionsList.scrollTop = optionBottomScroll - optionsList.offsetHeight;
    } else if (optionTopScroll < optionsList.scrollTop) {
      optionsList.scrollTop = optionTopScroll;
    }
  },

  focusSearch() {
    const searchInput = document.querySelector('.ember-power-select-search input') ||
      this.element.querySelector('.ember-power-select-trigger-multiple-input');
    if (searchInput) { searchInput.focus(); }
  },

  indexOfOption(option) {
    return indexOfOption(this.get('results'), option);
  },

  optionAtIndex(index) {
    return optionAtIndex(this.get('results'), index);
  },

  advanceSelectableOption(currentHighlight, step) {
    let resultsLength = this.get('resultsLength');
    let startIndex = Math.min(Math.max(this.indexOfOption(currentHighlight) + step, 0), resultsLength - 1);
    let nextOption = this.optionAtIndex(startIndex);
    while (nextOption && get(nextOption, 'disabled')) {
      nextOption = this.optionAtIndex(startIndex += step);
    }
    return nextOption;
  },

  refreshResults() {
    const { _options: options, _searchText: searchText } = this.getProperties('_options', '_searchText');
    let matcher;
    if (this.get('searchField')) {
      matcher = (option, text) => this.matcher(get(option, this.get('searchField')), text);
    } else {
      matcher = (option, text) => this.matcher(option, text);
    }
    this.set('results', filterOptions(options || [], searchText, matcher));
    this._resultsDirty = false;
  },

  updateOptions(options) {
    this.set('_options', options);
    this.refreshResults();
  },

  performCustomSearch(term) {
    this.set('_loadingOptions', true);
    const promise = term.length > 0 ? RSVP.Promise.resolve(this.get('search')(term)) : RSVP.resolve([]);
    this.set('_activeSearch', promise);
    promise.then(results => {
      if (promise !== this.get('_activeSearch')) { return; }
      this.set('results', results);
      this.set('_highlighted', this.optionAtIndex(0));
    }).finally(() => {
      if (promise !== this.get('_activeSearch')) { return; }
      this.set('_loadingOptions', false);
    });
  }
});
